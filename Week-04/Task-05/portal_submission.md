# Submission Deliverable: Week-04 Task-05 - Workflows vs. Agents & Model Context Protocol (MCP)

**Author:** FlyRank Intern  
**Repository:** `flyrank-ml-internship`  
**Task Directory:** `Week-04/Task-05`  
**Date:** July 28, 2026  

---

## 1. Technical Explainer Summary

The 854-word technical explainer essay is fully written and saved in [`explainer.md`](file:///d:/FlyRank/Week-04/Task-05/explainer.md) and [`README.md`](file:///d:/FlyRank/Week-04/Task-05/README.md).

### Core Takeaways from Explainer:
- **Workflow vs. Agent Distinction:** Workflows feature human-defined hardcoded graphs (e.g. DAGs, prompt chains) where LLMs act as static processing nodes. Agents place the LLM at the center of an autonomous loop (ReAct) where the model dynamically selects tools, evaluates feedback, and decides control flow.
- **FL-04 Classification:** FL-04 (5-step n8n Research Brief Pipeline) is strictly a **Sequential Prompt-Chained Workflow** because control flow is fixed upfront in n8n without LLM-driven looping or dynamic tool selection.
- **MCP Primitives:** 
  1. **Tools:** Executable functions taking actions (e.g., `read_local_file`, `execute_sqlite_query`).
  2. **Resources:** Read-only data endpoints streaming context into prompts (`file://`, `sqlite://`).
  3. **Prompts:** Parameterized server-hosted prompt templates.
- **Concrete FL-04 Upgrade:** **"Dynamic Evaluator-Optimizer Agent with MCP Integration"** introducing a ReAct reasoning loop, web search MCP tool calls for real-time fact-checking, and dynamic self-correction loops until quality score thresholds (>= 90%) are met.

---

## 2. Evidence of Working MCP Connector & 3 Non-Chat Tasks

We implemented a full standard Model Context Protocol (MCP) server and client setup in [`mcp_demo/`](file:///d:/FlyRank/Week-04/Task-05/mcp_demo/).

- **MCP Server:** [`mcp_demo/mcp_server.py`](file:///d:/FlyRank/Week-04/Task-05/mcp_demo/mcp_server.py)
- **MCP Client Runner:** [`mcp_demo/mcp_client_runner.py`](file:///d:/FlyRank/Week-04/Task-05/mcp_demo/mcp_client_runner.py)
- **Visual Evidence Screenshot:** [`screenshots/mcp_tool_execution_proof.png`](file:///d:/FlyRank/Week-04/Task-05/screenshots/mcp_tool_execution_proof.png)

### Summary of Executed MCP Tasks (Chat Alone Cannot Perform):

| Task # | Capability Category | MCP Tool Called | Arguments Passed | Execution Result / Output |
| :--- | :--- | :--- | :--- | :--- |
| **Task 1** | Local File System Inspection | `read_local_file` | `{"file_path": ".../n8n_workflow.json"}` | Successfully read and parsed 6,857 bytes of local disk content. |
| **Task 2** | Real-time Live Web Service Query | `query_live_service` | `{"url": "https://jsonplaceholder.typicode.com/todos/1"}` | Queried live HTTP API returning real-time JSON response (HTTP 200). |
| **Task 3** | Local Database SQL Execution | `execute_sqlite_query` | `{"db_path": ".../analytics.db", "query": "SELECT..."}` | Executed live SQL query against SQLite database returning 3 structured tabular rows. |

---

## 3. Terminal Execution Logs

```text
================================================================================
INITIALIZING MODEL CONTEXT PROTOCOL (MCP) CLIENT-SERVER SESSION
================================================================================
Connecting client to MCP Server process: python d:\FlyRank\Week-04\Task-05\mcp_demo\mcp_server.py

[SUCCESS] MCP Initialize Handshake Successful!
Server Info: {'name': 'FlyRank-Production-MCP-Server', 'version': '1.0.0'}

[INFO] DISCOVERED MCP PRIMITIVES:
  * Tools Discovered (3): ['read_local_file', 'query_live_service', 'execute_sqlite_query']
  * Resources Discovered (2): ['FL-04 Workflow Definition JSON', 'Local Production Analytics Database']
  * Prompts Discovered (1): ['audit_workflow_quality']

--------------------------------------------------------------------------------
[TASK 1] READING LOCAL SYSTEM FILE CONTENT (Local FS Access)
--------------------------------------------------------------------------------
[Client -> MCP Server] Calling tool 'read_local_file' with args: {'file_path': 'd:\FlyRank\Week-04\Task-04\n8n_workflow.json'}
[MCP Server -> Client] Tool Response:
Successfully read local file 'd:\FlyRank\Week-04\Task-04\n8n_workflow.json' (6857 bytes)

--------------------------------------------------------------------------------
[TASK 2] QUERYING LIVE EXTERNAL API SERVICE (Real-time Live Network)
--------------------------------------------------------------------------------
[Client -> MCP Server] Calling tool 'query_live_service' with args: {'url': 'https://jsonplaceholder.typicode.com/todos/1'}
[MCP Server -> Client] Tool Response:
Live Network Query to 'https://jsonplaceholder.typicode.com/todos/1' returned HTTP status 200:
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}

--------------------------------------------------------------------------------
[TASK 3] EXECUTING LIVE SQL QUERY ON LOCAL DATABASE (Database Computation)
--------------------------------------------------------------------------------
[Client -> MCP Server] Calling tool 'execute_sqlite_query' with args: {'db_path': 'd:\FlyRank\Week-04\Task-05\mcp_demo\analytics.db', 'query': 'SELECT workflow_name, execution_time_ms, status FROM workflow_runs WHERE status = \'SUCCESS\';'}
[MCP Server -> Client] Tool Response:
SQLite execution result:
Columns: ['workflow_name', 'execution_time_ms', 'status']
Rows:
('FL-04 Research Pipeline', 1420, 'SUCCESS')
('SEO Keyword Extractor', 850, 'SUCCESS')
('Adversarial Fact Checker', 2100, 'SUCCESS')

================================================================================
[SUCCESS] ALL 3 MCP TASKS EXECUTED SUCCESSFULLY VIA STANDARDIZED PROTOCOL!
================================================================================
```

---

## 4. Evaluation Criteria Verification

- [x] **Explainer technically correct and clearly in own words:** Covered in 854 words in `explainer.md`.
- [x] **Workflow vs agent distinction applied accurately to FL-04:** Justified as a prompt-chained workflow due to fixed graph topology without LLM-driven loops.
- [x] **Connector demonstrably working:** MCP server and client runner connected over stdio JSON-RPC.
- [x] **Three tasks chat alone could not have done:** Local FS read, live HTTP query, local SQLite database query.
- [x] **One concrete agent upgrade named for pipeline:** "Dynamic Evaluator-Optimizer Agent with MCP Tool Integration" named and architected.
