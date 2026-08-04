import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOK_PATH = ROOT / "work" / "notebooks" / "w07_action_playbook.ipynb"

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

nb = json.loads(NOTEBOOK_PATH.read_text(encoding="utf-8"))

print(f"Executing notebook: {NOTEBOOK_PATH}")
exec_context = {}

execution_count = 1
for cell_idx, cell in enumerate(nb["cells"]):
    if cell["cell_type"] == "code":
        code_source = "".join(cell["source"])
        print(f"\n--- Executing Code Cell {cell_idx + 1} ---")
        
        # Capture stdout
        import io
        old_stdout = sys.stdout
        sys.stdout = buffer = io.StringIO()
        
        try:
            exec(code_source, exec_context)
            output_text = buffer.getvalue()
        except Exception as e:
            sys.stdout = old_stdout
            print(f"Error executing cell {cell_idx + 1}: {e}")
            raise e
        finally:
            sys.stdout = old_stdout

        print("Cell Output:")
        print(output_text)
        
        cell["execution_count"] = execution_count
        cell["outputs"] = [
            {
                "name": "stdout",
                "output_type": "stream",
                "text": output_text.splitlines(keepends=True)
            }
        ]
        execution_count += 1

NOTEBOOK_PATH.write_text(json.dumps(nb, indent=1), encoding="utf-8")
print(f"\nSuccessfully executed notebook and updated outputs: {NOTEBOOK_PATH}")
