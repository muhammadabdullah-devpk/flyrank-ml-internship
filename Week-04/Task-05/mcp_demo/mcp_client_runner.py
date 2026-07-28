"""
MCP Client Runner
Connects to the MCP Server over stdio process piping, executes handshakes, 
inspects primitives (tools, resources, prompts), and runs 3 non-chat tasks.
"""

import sys
import os
import json
import subprocess
from typing import Dict, Any

# Ensure stdout handles UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def send_rpc(proc: subprocess.Popen, req: Dict[str, Any]) -> Dict[str, Any]:
    req_line = json.dumps(req) + "\n"
    proc.stdin.write(req_line)
    proc.stdin.flush()
    res_line = proc.stdout.readline()
    if not res_line:
        raise RuntimeError("MCP Server closed connection unexpectedly.")
    return json.loads(res_line.strip())

def main():
    server_script = os.path.join(os.path.dirname(__file__), "mcp_server.py")
    
    print("=" * 80)
    print("INITIALIZING MODEL CONTEXT PROTOCOL (MCP) CLIENT-SERVER SESSION")
    print("=" * 80)
    print(f"Connecting client to MCP Server process: python {server_script}\n")

    proc = subprocess.Popen(
        [sys.executable, server_script],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        bufsize=1
    )

    try:
        # Step 1: Handshake (initialize)
        init_req = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "clientInfo": {"name": "Claude-MCP-Client-Runner", "version": "1.0.0"}
            }
        }
        init_res = send_rpc(proc, init_req)
        print("[SUCCESS] MCP Initialize Handshake Successful!")
        print(f"Server Info: {init_res['result']['serverInfo']}\n")

        # Step 2: Discover Primitives (Tools, Resources, Prompts)
        tools_res = send_rpc(proc, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
        resources_res = send_rpc(proc, {"jsonrpc": "2.0", "id": 3, "method": "resources/list"})
        prompts_res = send_rpc(proc, {"jsonrpc": "2.0", "id": 4, "method": "prompts/list"})

        print("[INFO] DISCOVERED MCP PRIMITIVES:")
        print(f"  * Tools Discovered ({len(tools_res['result']['tools'])}): {[t['name'] for t in tools_res['result']['tools']]}")
        print(f"  * Resources Discovered ({len(resources_res['result']['resources'])}): {[r['name'] for r in resources_res['result']['resources']]}")
        print(f"  * Prompts Discovered ({len(prompts_res['result']['prompts'])}): {[p['name'] for p in prompts_res['result']['prompts']]}\n")

        # ---------------------------------------------------------------------
        # TASK 1: Read local system file (Cannot be done by Chat alone)
        # ---------------------------------------------------------------------
        print("-" * 80)
        print("[TASK 1] READING LOCAL SYSTEM FILE CONTENT (Local FS Access)")
        print("-" * 80)
        target_file = os.path.abspath("d:/FlyRank/Week-04/Task-04/n8n_workflow.json")
        t1_req = {
            "jsonrpc": "2.0",
            "id": 5,
            "method": "tools/call",
            "params": {
                "name": "read_local_file",
                "arguments": {"file_path": target_file}
            }
        }
        print(f"[Client -> MCP Server] Calling tool 'read_local_file' with args: {{'file_path': '{target_file}'}}")
        t1_res = send_rpc(proc, t1_req)
        print(f"[MCP Server -> Client] Tool Response:\n{t1_res['result']['content'][0]['text']}\n")

        # ---------------------------------------------------------------------
        # TASK 2: Query Live Network Web Service (Cannot be done by Chat alone)
        # ---------------------------------------------------------------------
        print("-" * 80)
        print("[TASK 2] QUERYING LIVE EXTERNAL API SERVICE (Real-time Live Network)")
        print("-" * 80)
        target_url = "https://jsonplaceholder.typicode.com/todos/1"
        t2_req = {
            "jsonrpc": "2.0",
            "id": 6,
            "method": "tools/call",
            "params": {
                "name": "query_live_service",
                "arguments": {"url": target_url}
            }
        }
        print(f"[Client -> MCP Server] Calling tool 'query_live_service' with args: {{'url': '{target_url}'}}")
        t2_res = send_rpc(proc, t2_req)
        print(f"[MCP Server -> Client] Tool Response:\n{t2_res['result']['content'][0]['text']}\n")

        # ---------------------------------------------------------------------
        # TASK 3: Execute Live SQL Query on Local Database (Cannot be done by Chat alone)
        # ---------------------------------------------------------------------
        print("-" * 80)
        print("[TASK 3] EXECUTING LIVE SQL QUERY ON LOCAL DATABASE (Database Computation)")
        print("-" * 80)
        db_file = os.path.abspath("d:/FlyRank/Week-04/Task-05/mcp_demo/analytics.db")
        sql_query = "SELECT workflow_name, execution_time_ms, status FROM workflow_runs WHERE status = 'SUCCESS';"
        t3_req = {
            "jsonrpc": "2.0",
            "id": 7,
            "method": "tools/call",
            "params": {
                "name": "execute_sqlite_query",
                "arguments": {"db_path": db_file, "query": sql_query}
            }
        }
        print(f"[Client -> MCP Server] Calling tool 'execute_sqlite_query' with args: {{'db_path': '{db_file}', 'query': '{sql_query}'}}")
        t3_res = send_rpc(proc, t3_req)
        print(f"[MCP Server -> Client] Tool Response:\n{t3_res['result']['content'][0]['text']}\n")

        print("=" * 80)
        print("[SUCCESS] ALL 3 MCP TASKS EXECUTED SUCCESSFULLY VIA STANDARDIZED PROTOCOL!")
        print("=" * 80)

    finally:
        proc.terminate()

if __name__ == "__main__":
    main()
