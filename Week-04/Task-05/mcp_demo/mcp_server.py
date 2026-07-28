"""
Model Context Protocol (MCP) Demonstration Server
Implements standard MCP JSON-RPC protocol exposing Tools, Resources, and Prompts primitives.
"""

import sys
import json
import os
import sqlite3
import urllib.request
import urllib.parse
from typing import Dict, Any, List

# Define MCP Primitives

TOOLS = [
    {
        "name": "read_local_file",
        "description": "Reads and returns the contents of a specified file on the local filesystem. Chat models alone cannot inspect your local file system.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "Absolute or relative path to the local file to read."
                }
            },
            "required": ["file_path"]
        }
    },
    {
        "name": "query_live_service",
        "description": "Queries a live external HTTP web service endpoint to fetch real-time live data. Chat models alone have training cutoffs and cannot query live network APIs.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The HTTP/HTTPS URL endpoint to query."
                }
            },
            "required": ["url"]
        }
    },
    {
        "name": "execute_sqlite_query",
        "description": "Executes a SQL query on a local SQLite database and returns the structured tabular results. Chat models alone cannot execute live SQL against local DB engines.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "db_path": {
                    "type": "string",
                    "description": "Path to SQLite database file (or :memory: for temporary DB)."
                },
                "query": {
                    "type": "string",
                    "description": "SQL statement to execute."
                }
            },
            "required": ["db_path", "query"]
        }
    }
]

RESOURCES = [
    {
        "uri": "file:///d:/FlyRank/Week-04/Task-04/n8n_workflow.json",
        "name": "FL-04 Workflow Definition JSON",
        "description": "Local n8n workflow configuration file containing the 5-step research pipeline schema.",
        "mimeType": "application/json"
    },
    {
        "uri": "sqlite:///d:/FlyRank/Week-04/Task-05/mcp_demo/analytics.db",
        "name": "Local Production Analytics Database",
        "description": "Live local database storing workflow execution stats and metrics.",
        "mimeType": "application/x-sqlite3"
    }
]

PROMPTS = [
    {
        "name": "audit_workflow_quality",
        "description": "Standardized prompt template to critique a workflow node execution.",
        "arguments": [
            {
                "name": "workflow_id",
                "description": "ID or name of the workflow to audit",
                "required": True
            }
        ]
    }
]

def handle_tools_list() -> List[Dict[str, Any]]:
    return TOOLS

def handle_resources_list() -> List[Dict[str, Any]]:
    return RESOURCES

def handle_prompts_list() -> List[Dict[str, Any]]:
    return PROMPTS

def handle_tool_call(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "read_local_file":
        file_path = arguments.get("file_path", "")
        if not os.path.exists(file_path):
            return {"content": [{"type": "text", "text": f"Error: File '{file_path}' does not exist."}], "isError": True}
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Successfully read local file '{file_path}' ({len(content)} bytes):\n\n" + content[:1500] + ("\n... [truncated]" if len(content) > 1500 else "")
                    }
                ],
                "isError": False
            }
        except Exception as e:
            return {"content": [{"type": "text", "text": f"Exception reading file: {str(e)}"}], "isError": True}

    elif name == "query_live_service":
        url = arguments.get("url", "")
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MCP/1.0 Client"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                status_code = response.getcode()
                body = response.read().decode("utf-8")
                return {
                    "content": [
                        {
                            "type": "text",
                            "text": f"Live Network Query to '{url}' returned HTTP status {status_code}:\n\n{body[:1500]}"
                        }
                    ],
                    "isError": False
                }
        except Exception as e:
            return {"content": [{"type": "text", "text": f"HTTP request failed: {str(e)}"}], "isError": True}

    elif name == "execute_sqlite_query":
        db_path = arguments.get("db_path", ":memory:")
        query = arguments.get("query", "")
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            cursor.execute("CREATE TABLE IF NOT EXISTS workflow_runs (id INTEGER PRIMARY KEY, workflow_name TEXT, execution_time_ms INT, status TEXT)")
            cursor.execute("SELECT COUNT(*) FROM workflow_runs")
            if cursor.fetchone()[0] == 0:
                cursor.execute("INSERT INTO workflow_runs VALUES (1, 'FL-04 Research Pipeline', 1420, 'SUCCESS')")
                cursor.execute("INSERT INTO workflow_runs VALUES (2, 'SEO Keyword Extractor', 850, 'SUCCESS')")
                cursor.execute("INSERT INTO workflow_runs VALUES (3, 'Adversarial Fact Checker', 2100, 'SUCCESS')")
                conn.commit()
                
            cursor.execute(query)
            if query.strip().upper().startswith("SELECT"):
                rows = cursor.fetchall()
                col_names = [description[0] for description in cursor.description]
                result_str = f"Columns: {col_names}\nRows:\n" + "\n".join(str(r) for r in rows)
            else:
                conn.commit()
                result_str = f"Query executed successfully. Affected rows: {cursor.rowcount}"
            conn.close()
            return {
                "content": [{"type": "text", "text": f"SQLite execution result:\n{result_str}"}],
                "isError": False
            }
        except Exception as e:
            return {"content": [{"type": "text", "text": f"SQLite Execution Error: {str(e)}"}], "isError": True}
    else:
        return {"content": [{"type": "text", "text": f"Unknown tool: {name}"}], "isError": True}

def process_request(request_json: Dict[str, Any]) -> Dict[str, Any]:
    method = request_json.get("method")
    req_id = request_json.get("id")
    params = request_json.get("params", {})

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {},
                    "resources": {},
                    "prompts": {}
                },
                "serverInfo": {
                    "name": "FlyRank-Production-MCP-Server",
                    "version": "1.0.0"
                }
            }
        }
    elif method == "tools/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": handle_tools_list()}}
    elif method == "resources/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"resources": handle_resources_list()}}
    elif method == "prompts/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"prompts": handle_prompts_list()}}
    elif method == "tools/call":
        name = params.get("name")
        args = params.get("arguments", {})
        result = handle_tool_call(name, args)
        return {"jsonrpc": "2.0", "id": req_id, "result": result}
    else:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"}
        }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--single-request":
        raw_in = sys.stdin.read()
        req = json.loads(raw_in)
        res = process_request(req)
        print(json.dumps(res, indent=2))
        return

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            res = process_request(req)
            sys.stdout.write(json.dumps(res) + "\n")
            sys.stdout.flush()
        except Exception as e:
            err_res = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": str(e)}}
            sys.stdout.write(json.dumps(err_res) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
