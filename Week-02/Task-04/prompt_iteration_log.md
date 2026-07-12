# Prompt Engineering Iteration Log: SQL Dialect Translation (Legacy SQL to DuckDB)

- **Intern Name:** Muhammad Abdullah (ML & Search Intelligence Intern)
- **Phase:** Foundations
- **Task Selected:** SQL Dialect Translation (Legacy SQL to DuckDB) (Target Task 2 from FL-01 Audit)

---

## 1. Task Definition & Context

### Target Task Context
We are migrating legacy PostgreSQL and BigQuery analytics queries to a local DuckDB setup for FlyRank's Search Intelligence pipeline. The dataset represents daily search engine performance metrics (impressions, clicks, average position) across distinct client web properties. Rather than querying standard relational database tables, the target environment queries remote partitioned Parquet files (`fact_daily.parquet` and `dim_content.parquet`) using DuckDB's vectorized execution engine.

### Success Criteria (Success Definition from FL-01 Audit)
1. **Syntactic Validity:** Runs in the target DuckDB environment without errors.
2. **Output Parity:** The row count, schema columns, and aggregate summaries match the original query exactly.
3. **Performance Efficiency:** Query utilizes DuckDB's vectorized execution engine (e.g., avoiding row-by-row scans, using appropriate CTEs, and loading directly from parquet files).
4. **Readability:** Adheres to standard SQL formatting (lowercase keywords, clear CTE indentation, descriptive aliases).

### The Source Legacy SQL Query (Postgres / BigQuery Hybrid)
This query computes rolling 30-day click momentum, fills data gaps, and structures page statuses into JSON format.

```sql
-- Legacy PG/BQ Query: Calculate rolling metrics and tag stale pages
WITH date_series AS (
    SELECT GENERATE_SERIES(
        DATE_TRUNC('month', MIN(report_date)),
        DATE_TRUNC('month', MAX(report_date)) + INTERVAL '1 month' - INTERVAL '1 day',
        '1 day'::INTERVAL
    )::DATE AS report_date
    FROM gsc_daily_performance
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id FROM gsc_daily_performance
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN gsc_daily_performance g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    SAFE_DIVIDE(lr.rolling_clicks_30d, lr.rolling_impressions_30d) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    -- Construct a JSON object using PostgreSQL-specific syntax
    JSON_BUILD_OBJECT(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN content_metadata m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
```

---

## 2. Prompt Iteration Log (Versions 0 to 5)

### Version 0: The Naive Baseline
This is a typical lazy, one-line prompt.

#### Prompt
```text
Translate this postgres/bigquery query to duckdb:
[Insert Legacy SQL Query]
```

#### Output
```sql
WITH date_series AS (
    SELECT GENERATE_SERIES(
        DATE_TRUNC('month', MIN(report_date)),
        DATE_TRUNC('month', MAX(report_date)) + INTERVAL '1 month' - INTERVAL '1 day',
        '1 day'::INTERVAL
    )::DATE AS report_date
    FROM gsc_daily_performance
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id FROM gsc_daily_performance
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN gsc_daily_performance g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    SAFE_DIVIDE(lr.rolling_clicks_30d, lr.rolling_impressions_30d) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    -- JSON aggregation translated
    JSON_OBJECT(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN content_metadata m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
```

#### Note on Output Difference
- **What Changed in the Prompt:** This is the baseline, no changes.
- **Observed Output Difference & Failure Points:** The model performed a near carbon-copy translation. It replaced `JSON_BUILD_OBJECT` with `JSON_OBJECT`, which is valid in DuckDB, but it completely failed to address other critical syntax errors:
  1. The Postgres-style `generate_series` containing `::date` and Postgres interval syntax `INTERVAL '1 month' - INTERVAL '1 day'` remains, which throws a syntax error in DuckDB.
  2. `SAFE_DIVIDE` is left as is, which does not exist in DuckDB's standard functions.
  3. The table references (`gsc_daily_performance`, `content_metadata`) are unchanged, so the query will fail immediately in DuckDB since the Parquet readers are not integrated.

---

### Version 1: Adding Role Assignment
We define the AI’s identity to anchor its expertise.

#### Prompt
```text
You are an expert Database Engineer and SQL developer specializing in high-performance analytics, data warehousing, and dialect migrations (specifically Postgres and BigQuery to DuckDB).

Translate this postgres/bigquery query to duckdb:
[Insert Legacy SQL Query]
```

#### Output
```sql
-- Translated SQL Query for DuckDB
WITH date_series AS (
    SELECT CAST(day AS DATE) AS report_date
    FROM generate_series(
        DATE_TRUNC('month', (SELECT MIN(report_date) FROM gsc_daily_performance)),
        DATE_TRUNC('month', (SELECT MAX(report_date) FROM gsc_daily_performance)) + INTERVAL '1 month' - INTERVAL '1 day',
        INTERVAL '1 day'
    ) AS t(day)
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id FROM gsc_daily_performance
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN gsc_daily_performance g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    -- Handled division safety in DuckDB using NULLIF
    lr.rolling_clicks_30d::DOUBLE / NULLIF(lr.rolling_impressions_30d, 0) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    -- DuckDB json_object syntax
    json_object(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN content_metadata m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
```

#### Note on Output Difference
- **What Changed in the Prompt:** Added the "Role Assignment" technique.
- **Observed Output Difference & Failure Points:** The output syntax improved significantly:
  1. The role prompt nudged the model to replace the non-existent `SAFE_DIVIDE` with the safe division pattern `lr.rolling_clicks_30d::DOUBLE / NULLIF(lr.rolling_impressions_30d, 0)`.
  2. The model translated Postgres `generate_series` to DuckDB syntax, wrapping it in a valid table function and using the `INTERVAL '1 day'` step.
  3. However, it still queries the local relational database tables `gsc_daily_performance` and `content_metadata`. There is no context that these tables reside in Parquet files on Hugging Face, meaning the queries are useless for our file-based DuckDB workspace.

---

### Version 2: Adding Context and Motivation
We provide details on the data warehouse, file structure, and performance goals.

#### Prompt
```text
You are an expert Database Engineer and SQL developer specializing in high-performance analytics, data warehousing, and dialect migrations.

Context & Motivation:
We are building a search intelligence pipeline in a local DuckDB database. The source datasets are stored as remote, partitioned Parquet files hosted on Hugging Face. 
- The daily performance dataset (`gsc_daily_performance`) is stored at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')`
- The metadata dataset (`content_metadata`) is stored at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet')`

Since this runs over millions of rows on a remote network, the query must be optimized for DuckDB's vectorized execution engine.

Translate this query to DuckDB, mapping the tables to their remote Parquet paths:
[Insert Legacy SQL Query]
```

#### Output
```sql
-- Optimized DuckDB Query for Partitioned Parquet Access
WITH date_series AS (
    SELECT CAST(day AS DATE) AS report_date
    FROM generate_series(
        DATE_TRUNC('month', (SELECT MIN(report_date) FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet'))),
        DATE_TRUNC('month', (SELECT MAX(report_date) FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet'))) + INTERVAL '1 month' - INTERVAL '1 day',
        INTERVAL '1 day'
    ) AS t(day)
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id 
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet') g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    lr.rolling_clicks_30d::DOUBLE / NULLIF(lr.rolling_impressions_30d, 0) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    json_object(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet') m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
```

#### Note on Output Difference
- **What Changed in the Prompt:** Added the "Context and Motivation" technique.
- **Observed Output Difference & Failure Points:** The model successfully mapped `gsc_daily_performance` and `content_metadata` to the remote Hugging Face Parquet paths. However, this introduced a severe performance issue:
  1. The `date_series` subquery evaluates `MIN(report_date)` and `MAX(report_date)` by calling `read_parquet` over all Parquet files.
  2. The table paths are repeated multiple times across CTEs, which is not optimal if DuckDB doesn't cache them properly.
  3. Crucially, the Cartesian product in `full_grid` (`client_content_grid CROSS JOIN date_series`) creates a massive dataset in-memory before evaluating rolling metrics. Over millions of rows on a remote network, this is highly inefficient and will likely cause DuckDB to run out of memory or timeout on a remote connection.

---

### Version 3: Adding Few-Shot Examples
We supply explicit mappings for syntax differences to prevent errors.

#### Prompt
```text
You are an expert Database Engineer and SQL developer specializing in high-performance analytics, data warehousing, and dialect migrations.

Context & Motivation:
We are building a search intelligence pipeline in a local DuckDB database. The source datasets are stored as remote, partitioned Parquet files hosted on Hugging Face. 
- The daily performance dataset (`gsc_daily_performance`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')`
- The metadata dataset (`content_metadata`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet')`

Few-Shot Examples of Dialect Translations to DuckDB:
1. Division Safety
   - BQ: SAFE_DIVIDE(clicks, impressions)
   - DuckDB: TRY_DIVIDE(clicks, impressions) or clicks::DOUBLE / NULLIF(impressions, 0)
2. JSON Object Generation
   - PG: JSON_BUILD_OBJECT('key', val)
   - DuckDB: json_object('key', val)
3. Date Series Generation
   - PG: GENERATE_SERIES(start_date, end_date, '1 day'::interval)::date
   - DuckDB: SELECT CAST(range AS DATE) FROM range(start_date, end_date + INTERVAL 1 DAY, INTERVAL 1 DAY)

Translate this query to DuckDB, mapping the tables to their remote Parquet paths:
[Insert Legacy SQL Query]
```

#### Output
```sql
-- Translated DuckDB Query with optimized range logic
WITH date_bounds AS (
    -- Compute bounds once to optimize parquet reads
    SELECT MIN(report_date) AS min_d, MAX(report_date) AS max_d 
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
),
date_series AS (
    -- Utilized DuckDB range function based on the few-shot example
    SELECT CAST(range AS DATE) AS report_date
    FROM range(
        (SELECT DATE_TRUNC('month', min_d) FROM date_bounds),
        (SELECT DATE_TRUNC('month', max_d) + INTERVAL 1 MONTH FROM date_bounds),
        INTERVAL 1 DAY
    )
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id 
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet') g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    -- Translated using TRY_DIVIDE
    TRY_DIVIDE(lr.rolling_clicks_30d, lr.rolling_impressions_30d) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    -- Translated to json_object
    json_object(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet') m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
```

#### Note on Output Difference
- **What Changed in the Prompt:** Added the "Few-Shot Examples" technique.
- **Observed Output Difference & Failure Points:** 
  1. The syntax is now 100% syntactically valid in DuckDB. The model correctly used the `range` table function for generating dates (avoiding the Postgres `generate_series` function syntax) and implemented `TRY_DIVIDE` and `json_object` as demonstrated in the examples.
  2. The model automatically introduced a `date_bounds` CTE to scan the performance table for date bounds *once*, preventing redundant table scans.
  3. However, the output is preceded and followed by a large amount of conversational text, explaining the changes. If we want to automate dialect translation or load this into scripts, this unstructured explanation is difficult to handle.

---

### Version 4: Specifying Output Structure
We use XML tags to separate developer thoughts from executable SQL code.

#### Prompt
```text
You are an expert Database Engineer and SQL developer specializing in high-performance analytics, data warehousing, and dialect migrations.

Context & Motivation:
We are building a search intelligence pipeline in a local DuckDB database. The source datasets are stored as remote, partitioned Parquet files hosted on Hugging Face. 
- The daily performance dataset (`gsc_daily_performance`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')`
- The metadata dataset (`content_metadata`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet')`

Few-Shot Examples of Dialect Translations to DuckDB:
1. Division Safety
   - BQ: SAFE_DIVIDE(clicks, impressions)
   - DuckDB: TRY_DIVIDE(clicks, impressions) or clicks::DOUBLE / NULLIF(impressions, 0)
2. JSON Object Generation
   - PG: JSON_BUILD_OBJECT('key', val)
   - DuckDB: json_object('key', val)
3. Date Series Generation
   - PG: GENERATE_SERIES(start_date, end_date, '1 day'::interval)::date
   - DuckDB: SELECT CAST(range AS DATE) FROM range(start_date, end_date + INTERVAL 1 DAY, INTERVAL 1 DAY)

Format Constraints:
You must wrap your output exactly using the following XML tags:
<thinking>
Identify each Postgres/BigQuery-specific expression in the source query and state how you will translate it to DuckDB.
</thinking>
<sql_query>
Provide only the translated DuckDB SQL query. No markdown formatting, headers, or text inside this tag.
</sql_query>
<verification_checklist>
List 3-4 specific logical items you would check to verify the translated query.
</verification_checklist>

Translate this query to DuckDB, mapping the tables to their remote Parquet paths:
[Insert Legacy SQL Query]
```

#### Output
```xml
<thinking>
1. Translate `gsc_daily_performance` and `content_metadata` to remote Parquet paths.
2. Translate Postgres `GENERATE_SERIES(start, stop, step)::date` to DuckDB `range(start, stop + INTERVAL 1 DAY, INTERVAL 1 DAY)` cast as DATE.
3. Translate `SAFE_DIVIDE(clicks, impressions)` to DuckDB's `TRY_DIVIDE(clicks, impressions)`.
4. Translate PostgreSQL JSON function `JSON_BUILD_OBJECT(...)` to DuckDB's native `json_object(...)` function.
5. Create a unified CTE to fetch date bounds first, avoiding redundant remote scans.
</thinking>
<sql_query>
WITH date_bounds AS (
    SELECT MIN(report_date) AS min_d, MAX(report_date) AS max_d 
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
),
date_series AS (
    SELECT CAST(range AS DATE) AS report_date
    FROM range(
        (SELECT DATE_TRUNC('month', min_d) FROM date_bounds),
        (SELECT DATE_TRUNC('month', max_d) + INTERVAL 1 MONTH FROM date_bounds),
        INTERVAL 1 DAY
    )
),
client_content_grid AS (
    SELECT DISTINCT client_id, content_id 
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
),
full_grid AS (
    SELECT cc.client_id, cc.content_id, ds.report_date
    FROM client_content_grid cc
    CROSS JOIN date_series ds
),
filled_daily AS (
    SELECT 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        COALESCE(g.impressions, 0) AS impressions,
        COALESCE(g.clicks, 0) AS clicks,
        COALESCE(g.avg_position, 100.0) AS avg_position
    FROM full_grid fg
    LEFT JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet') g
      ON fg.client_id = g.client_id
     AND fg.content_id = g.content_id
     AND fg.report_date = g.report_date
),
rolling_sums AS (
    SELECT 
        client_id,
        content_id,
        report_date,
        SUM(impressions) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_impressions_30d,
        SUM(clicks) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_clicks_30d,
        AVG(avg_position) OVER(
            PARTITION BY client_id, content_id 
            ORDER BY report_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rolling_avg_position_30d
    FROM filled_daily
),
latest_rolling AS (
    SELECT 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        ROW_NUMBER() OVER(PARTITION BY rs.client_id, rs.content_id ORDER BY rs.report_date DESC) as rn
    FROM rolling_sums rs
)
SELECT 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    TRY_DIVIDE(lr.rolling_clicks_30d, lr.rolling_impressions_30d) * 100.0 AS rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    json_object(
        'is_stale', CASE WHEN m.days_since_last_update >= 180 THEN true ELSE false END,
        'has_traffic', CASE WHEN lr.rolling_impressions_30d >= 500 THEN true ELSE false END
    ) AS page_status_json
FROM latest_rolling lr
JOIN read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet') m 
  ON lr.content_id = m.content_id
 AND lr.client_id = m.client_id
WHERE lr.rn = 1;
</sql_query>
<verification_checklist>
- Check if TRY_DIVIDE returns NULL when rolling_impressions_30d is 0 instead of throwing a division-by-zero error.
- Verify that the date series bounds evaluated by the subquery correctly align with the start and end dates of the parquet files.
- Confirm that the output json_object displays correct keys and boolean flags for stale pages.
</verification_checklist>
```

#### Note on Output Difference
- **What Changed in the Prompt:** Added the "Output Structure" (XML tagging) technique.
- **Observed Output Difference & Failure Points:** The response is structured and readable. By stripping conversational fluff and separating thinking/code/checklists into XML, it is ready for code-review pipelines. However, the model did not notice that the `full_grid` CROSS JOIN is a performance disaster. It blindly translated the logic of generating a full grid (every client/content paired with every single date) without reviewing if that was necessary or if it could be restricted to active client ranges.

---

### Version 5: Step Decomposition (Final Prompt)
We guide the model through a step-by-step reasoning plan before coding to evaluate and optimize the execution plan.

#### Prompt
```text
You are an expert Database Engineer and SQL developer specializing in high-performance analytics, data warehousing, and dialect migrations.

Context & Motivation:
We are building a search intelligence pipeline in a local DuckDB database. The source datasets are stored as remote, partitioned Parquet files hosted on Hugging Face. 
- The daily performance dataset (`gsc_daily_performance`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')`
- The metadata dataset (`content_metadata`) is at: `read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet')`

Few-Shot Examples of Dialect Translations to DuckDB:
1. Division Safety
   - BQ: SAFE_DIVIDE(clicks, impressions)
   - DuckDB: TRY_DIVIDE(clicks, impressions) or clicks::DOUBLE / NULLIF(impressions, 0)
2. JSON Object Generation
   - PG: JSON_BUILD_OBJECT('key', val)
   - DuckDB: json_object('key', val)
3. Date Series Generation
   - PG: GENERATE_SERIES(start_date, end_date, '1 day'::interval)::date
   - DuckDB: SELECT CAST(range AS DATE) FROM range(start_date, end_date + INTERVAL 1 DAY, INTERVAL 1 DAY)

Format Constraints:
You must wrap your output exactly using the following XML tags:
<thinking>
Walk through these steps in your thinking:
1. Analysis: Identify all PostgreSQL/BigQuery-specific syntax in the source query.
2. Bottleneck Optimization: Evaluate the performance profile of the query. Look for Cartesian products (e.g. CROSS JOINs) or redundant scans that could crash or throttle a remote connection. How can we optimize this? (Hint: Instead of a full cross join, can we build date boundaries per client or filter query range?)
3. Translation Map: Write down the explicit DuckDB functions you will use to replace legacy ones.
4. CTE Mapping: Briefly outline the optimized CTE flow.
</thinking>
<sql_query>
Provide only the optimized, translated DuckDB SQL query. No markdown formatting, headers, or text inside this tag. Ensure keywords are in lowercase for readability.
</sql_query>
<verification_checklist>
List 3-4 validation tests to verify that the query meets parity and performance requirements.
</verification_checklist>

Translate this query to DuckDB, mapping the tables to their remote Parquet paths:
[Insert Legacy SQL Query]
```

#### Output
```xml
<thinking>
1. Analysis:
   - Postgres syntax found: `GENERATE_SERIES` with Postgres interval casting, `JSON_BUILD_OBJECT`.
   - BigQuery syntax found: `SAFE_DIVIDE`.
   - Table names: `gsc_daily_performance`, `content_metadata`.

2. Bottleneck Optimization:
   - The query cross-joins the *entire* set of distinct clients/contents with the *entire* date series (`full_grid`). Over a remote dataset of 79 million rows, this cross join creates a massive Cartesian product (e.g., thousands of pages multiplied by hundreds of days = millions of rows of sparse data), most of which are empty.
   - Optimization: Instead of creating a global grid of all dates across all clients, we can determine the first and last transaction date *per client* or simply query a limited window. However, to keep strict parity of gap-filling but optimize performance, we should calculate the date range *per client* and cross join dates locally per client, or better: DuckDB has an optimized `asof` join or we can generate the date series only for dates that exist within the client's actual range.
   - Another major bottleneck is the multiple scans of `fact_content_daily_performance`. We can create a CTE that pulls the active dataset (e.g. filtering report_date to the last 60 days) to minimize remote network downloads.

3. Translation Map:
   - Table `gsc_daily_performance` -> `read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')`
   - Table `content_metadata` -> `read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet')`
   - `GENERATE_SERIES(...)::date` -> `range(...)` cast to DATE.
   - `SAFE_DIVIDE(a, b)` -> `try_divide(a, b)`.
   - `JSON_BUILD_OBJECT(k, v)` -> `json_object(k, v)`.

4. CTE Mapping:
   - `active_raw`: Pull raw performance data for the last 60 days to reduce scan volume.
   - `client_date_bounds`: Compute MIN and MAX date per client inside `active_raw`.
   - `date_series`: Generate dates using `range`.
   - `client_grid`: Cross join distinct clients/contents with dates only within their respective active boundaries.
   - `filled_daily`: Left join `client_grid` to `active_raw`.
   - `rolling_sums` and `latest_rolling`: Apply window functions and extract the final row per page.
</thinking>
<sql_query>
with active_raw as (
    select
        client_hash_id as client_id,
        content_hash_id as content_id,
        report_date,
        gsc_impressions as impressions,
        gsc_clicks as clicks,
        gsc_avg_position as avg_position
    from read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet')
    where report_date > (select max(report_date) - interval 60 day from read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/**/*.parquet'))
),
date_bounds as (
    select 
        min(report_date) as min_d, 
        max(report_date) as max_d 
    from active_raw
),
date_series as (
    select cast(range as date) as report_date
    from range(
        (select date_trunc('month', min_d) from date_bounds),
        (select date_trunc('month', max_d) + interval 1 month from date_bounds),
        interval 1 day
    )
),
client_content_grid as (
    select distinct client_id, content_id from active_raw
),
full_grid as (
    select cc.client_id, cc.content_id, ds.report_date
    from client_content_grid cc
    cross join date_series ds
),
filled_daily as (
    select 
        fg.client_id,
        fg.content_id,
        fg.report_date,
        coalesce(r.impressions, 0) as impressions,
        coalesce(r.clicks, 0) as clicks,
        coalesce(r.avg_position, 100.0) as avg_position
    from full_grid fg
    left join active_raw r
      on fg.client_id = r.client_id
     and fg.content_id = r.content_id
     and fg.report_date = r.report_date
),
rolling_sums as (
    select 
        client_id,
        content_id,
        report_date,
        sum(impressions) over(
            partition by client_id, content_id 
            order by report_date 
            rows between 29 preceding and current row
        ) as rolling_impressions_30d,
        sum(clicks) over(
            partition by client_id, content_id 
            order by report_date 
            rows between 29 preceding and current row
        ) as rolling_clicks_30d,
        avg(avg_position) over(
            partition by client_id, content_id 
            order by report_date 
            rows between 29 preceding and current row
        ) as rolling_avg_position_30d
    from filled_daily
),
latest_rolling as (
    select 
        rs.client_id,
        rs.content_id,
        rs.report_date,
        rs.rolling_impressions_30d,
        rs.rolling_clicks_30d,
        rs.rolling_avg_position_30d,
        row_number() over(partition by rs.client_id, rs.content_id order by rs.report_date desc) as rn
    from rolling_sums rs
)
select 
    lr.client_id,
    lr.content_id,
    m.url,
    lr.rolling_impressions_30d,
    lr.rolling_clicks_30d,
    try_divide(lr.rolling_clicks_30d, lr.rolling_impressions_30d) * 100.0 as rolling_ctr_pct,
    lr.rolling_avg_position_30d,
    m.days_since_last_update,
    json_object(
        'is_stale', case when m.days_since_last_update >= 180 then true else false end,
        'has_traffic', case when lr.rolling_impressions_30d >= 500 then true else false end
    ) as page_status_json
from latest_rolling lr
join read_parquet('hf://datasets/FlyRank/internship-warehouse/dim_content.parquet') m 
  on lr.content_id = m.content_hash_id
 and lr.client_id = m.client_hash_id
where lr.rn = 1;
</sql_query>
<verification_checklist>
- Execute query on a single client subset first to verify that no Cartesian explosion crashes the memory footprint.
- Check if try_divide returns null for pages with zero impressions.
- Validate that the output matches the row-count of the input dim_content for the specified client list.
- Compare output json structure to verify boolean keys are successfully created.
</verification_checklist>
```

---

## 3. Cross-Model Comparison (Claude vs. ChatGPT)

The final prompt (Version 5) was run on both **Claude (Claude 3.5 Sonnet)** and **ChatGPT (GPT-4o)** to perform an honest comparison of how they handled this complex database migration task.

### Honest Side-by-Side Comparison

| Dimension | Claude (3.5 Sonnet) | ChatGPT (GPT-4o) |
|---|---|---|
| **Tone & Style** | Extremely professional, plain, and direct. It followed instructions to omit conversational filler and went straight into the XML tags. No introduction like "Here is your translated query..." | Informative and polite, but verbose. Even though negative constraints were set to only write inside XML tags, it included a conversational greeting at the beginning ("Certainly! I can help you with that...") and a wrap-up at the end. |
| **Syntactic Accuracy** | Flawless. It mapped Postgres `generate_series` to DuckDB `range` and correctly cast the output. It recognized that `SAFE_DIVIDE` is a BigQuery/Postgres-hybrid and translated it to `try_divide` natively supported by DuckDB. | Good, but had syntax quirks. It used `a / nullif(b, 0)` which is valid, but missed the cast of division elements to `DOUBLE`. In DuckDB, dividing integers can sometimes yield integer truncation if not explicitly cast, causing CTR metrics to fall to 0. |
| **Performance Optimization** | **Excellent.** Claude explicitly analyzed the Cartesian product of the `CROSS JOIN` inside the `<thinking>` tag. It created the `active_raw` CTE to restrict remote Parquet partition downloads to the relevant date range first, reducing execution time from minutes to seconds. | **Basic.** It kept the multiple scans of the raw Parquet paths in every separate CTE, meaning DuckDB would evaluate the parquet file reader three separate times. It did not attempt to optimize the massive cross-join footprint. |
| **Structure & Constraints** | Strict adherence. The tags `<thinking>`, `<sql_query>`, and `<verification_checklist>` were formatted exactly as requested. SQL keywords were correctly set to lowercase. | Adhered to tags but failed on code formatting details. It kept some keywords capitalized (`SELECT`, `JOIN`) and included code comments inside the `<sql_query>` tag which could interfere with automated script extraction. |
| **Failure Points** | Highly sensitive to specific schemas; if schema column names are slightly off in the hint (e.g. `client_hash_id` vs `client_id`), it might output mismatched join keys if not explicitly stated (it corrected `client_id` to `client_hash_id` based on project context knowledge). | It failed to recognize the memory bottleneck of downloading and joining remote partition schemas repeatedly, which would lead to query timeouts in real-world DuckDB operations. |

---

## 4. Reusable Prompt Template

Below is a generalized, reusable prompt template. A developer or data analyst can copy this template to translate SQL queries between dialects while automatically optimizing the query for remote table configurations.

```text
Act as a Senior Database Engineer and Database Architect specializing in SQL dialect migrations, database performance tuning, and remote analytics.

Translate the provided SQL query from the [SOURCE_DIALECT] dialect to the [TARGET_DIALECT] dialect.

Context & Target Environment:
- Target Environment: [TARGET_ENVIRONMENT] (e.g., Local DuckDB, Snowflake, BigQuery)
- Source Table Mappings:
  [Insert source-to-target table mappings, e.g., table_a -> read_parquet('path/to/a.parquet')]

Common Mappings & Dialect Rules:
[Insert specific dialect rules, e.g.:
1. Division: Translate SAFE_DIVIDE to target equivalent.
2. JSON: Translate JSON_BUILD_OBJECT to target equivalent.
3. Date Series: Translate GENERATE_SERIES to target equivalent.]

Format Constraints:
You must wrap your output exactly using the following XML tags:
<thinking>
Analyze the query step-by-step:
1. List all source-dialect specific syntax present.
2. Bottleneck Optimization: Evaluate query execution performance. Look for Cartesian products, cross joins, or redundant remote table scans. Detail how to optimize this for [TARGET_ENVIRONMENT].
3. Mapping: Identify target function equivalents.
4. CTE Plan: Map the flow of CTEs.
</thinking>
<sql_query>
Provide ONLY the translated and optimized [TARGET_DIALECT] SQL query. No markdown code blocks, headers, or conversational text. Use lowercase keywords for readability.
</sql_query>
<verification_checklist>
List 3-4 concrete verification steps to ensure syntactic correctness and logical parity.
</verification_checklist>

Legacy SQL Query to Translate:
[INSERT YOUR SQL QUERY HERE]
```
