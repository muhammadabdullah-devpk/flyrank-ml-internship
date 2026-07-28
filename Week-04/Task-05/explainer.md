# Workflows vs. Agents & Model Context Protocol (MCP) Explainer

## Executive Summary
As artificial intelligence transitions from passive completion interfaces into active software components, the industry frequently conflates "workflows" with "agents." Understanding this distinction—and mastering standard protocol interfaces like Anthropic's Model Context Protocol (MCP)—is critical for evaluating autonomous software. This explainer articulates the technical differences between workflows and agents, classifies our FL-04 research pipeline, demystifies MCP's architectural primitives, and details a concrete upgrade path to evolve FL-04 into an autonomous agent.

---

## 1. Workflows vs. Agents: The Fundamental Architectural Shift

In modern AI engineering, system architectures exist along a spectrum defined by control flow location and execution autonomy.

### What is an AI Workflow?
An **AI workflow** is an orchestrated sequence of execution steps where control flow, state transitions, execution paths, and fallback logic are determined upfront by human developers. In a workflow, Large Language Models (LLMs) function as specialized cognitive processors embedded within a fixed, hardcoded graph (such as sequential prompt chaining, parallel routing, or orchestrator-subworker patterns). The execution graph is static: the system follows a predefined sequence regardless of intermediate model outputs or environment feedback.

### What is an AI Agent?
An **AI agent** is an autonomous system where the LLM functions as the central decision-making engine controlling its own execution loop. Given a high-level goal, operating context, and an array of accessible tools, an agent operates in a dynamic ReAct (Reasoning and Acting) loop. At each step, the model evaluates its current state, dynamically selects and executes tools, inspects tool outputs, self-corrects, and autonomously determines whether to iterate or terminate once the goal is achieved.

| Architectural Dimension | AI Workflow (e.g., Prompt Chaining) | Autonomous AI Agent |
| :--- | :--- | :--- |
| **Control Flow** | Hardcoded, static graph defined by developers | Dynamic, runtime-determined by LLM reasoning loop |
| **Tool Execution** | Predetermined node triggers in sequence | Autonomous selection based on environment feedback |
| **Error Handling** | Fixed fallback logic or pipeline termination | Dynamic self-correction, retries, and tool pivoting |
| **Determinism** | High structural predictability | High adaptability with non-deterministic pathing |

---

## 2. Classification of the FL-04 Pipeline

Our FL-04 implementation—the 5-step "Source-Grounded Research & Briefing Pipeline" built in n8n—is strictly an **AI Workflow**, specifically a **Sequential Prompt-Chained Workflow**.

### FL-04 Pipeline Architecture
1. **Step 1 (Extract Facts):** Webhook-triggered node extracting verified facts and entities into JSON.
2. **Step 2 (Synthesize Outline):** LLM node grouping facts into thematic pillars and structural outlines.
3. **Step 3 (First Pass Draft):** LLM node generating initial draft markdown text based on outline.
4. **Step 4 (Adversarial Audit):** LLM node critiquing draft accuracy, checking hallucinations, and scoring quality.
5. **Step 5 (Format & Revise):** LLM node formatting final markdown output and posting to Slack.

### Technical Justification
Although Step 4 performs adversarial critique, the execution control flow is completely rigid and unbranching. If Step 4 identifies critical factual hallucinations or calculates a failing quality score (e.g., 40/100), the workflow cannot dynamically halt, query external web tools to retrieve missing evidence, or re-route execution back to Step 3 for revision. The pipeline blindly executes Step 5. Because the control topology is fixed at design time without LLM-driven looping or dynamic tool selection, FL-04 is a workflow, not an agent.

---

## 3. Model Context Protocol (MCP): Demystifying the Primitives

Anthropic's Model Context Protocol (MCP) is an open standard establishing a universal client-server interface ("USB-C for AI") between LLMs and external systems. MCP eliminates custom integration code by using JSON-RPC protocol over stdio or HTTP transport layers.

MCP establishes **three core primitives**:

1. **Tools (Executable Actions):** Functions exposed by an MCP server that an LLM can invoke with structured parameters to execute actions or retrieve live computation (e.g., `read_local_file`, `execute_sqlite_query`, `query_live_service`).
2. **Resources (Context Streams):** Read-only data endpoints identified by standard URIs (`file://`, `sqlite://`, `api://`) exposed by the server to stream context, file content, or database schemas directly into prompt context.
3. **Prompts (Standardized Templates):** Parameterized prompt templates managed by the server that expose domain-specific instructions and contextual workflows to client applications.

---

## 4. Concrete Agent Upgrade for FL-04

To evolve FL-04 into a true autonomous agent, we must implement the **"Dynamic Evaluator-Optimizer Agent with MCP Integration."**

### Key Upgrade Requirements
1. **Autonomous Control Loop:** Replace the linear 5-step n8n graph with a Python-based ReAct agent loop powered by an LLM reasoning engine.
2. **MCP Tool Suite Integration:** Provide the agent with three MCP tools:
   - `web_search_mcp`: Executes real-time search queries to discover missing domain evidence.
   - `file_system_mcp`: Reads local raw documents and verification logs.
   - `fact_checker_mcp`: Validates claims against authoritative external endpoints.
3. **Dynamic Feedback & Self-Correction:** When the internal evaluator node detects unsupported claims or low quality scores, the agent dynamically decides to call `web_search_mcp` to retrieve grounding data, updates its draft, and re-audits.
4. **Autonomous Termination Condition:** The loop iterates dynamically until the audit score reaches target threshold (Quality Score >= 90%) or maximum allowable retries expire.

By replacing hardcoded graph execution with an LLM-driven loop utilizing MCP tools, FL-04 transitions from a static workflow into an autonomous research agent.
