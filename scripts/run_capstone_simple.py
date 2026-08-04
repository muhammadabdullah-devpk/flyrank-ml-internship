import json
import os
import sys
import io
import contextlib
import pandas as pd
import numpy as np

nb_path = 'work/notebooks/capstone.ipynb'

with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

global_env = {'__name__': '__main__'}
exec_count = 1

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        source_code = "".join(cell['source']) if isinstance(cell['source'], list) else cell['source']
        if not source_code.strip():
            continue
        
        output_capture = io.StringIO()
        cell['outputs'] = []
        cell['execution_count'] = exec_count
        
        try:
            with contextlib.redirect_stdout(output_capture):
                exec(source_code, global_env)
            
            stdout_text = output_capture.getvalue()
            if stdout_text:
                cell['outputs'].append({
                    "name": "stdout",
                    "output_type": "stream",
                    "text": stdout_text.splitlines(keepends=True)
                })
        except Exception as e:
            print(f"Error executing cell {exec_count}: {e}")
            cell['outputs'].append({
                "name": "stderr",
                "output_type": "stream",
                "text": [str(e)]
            })
        
        exec_count += 1

with open(nb_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1)

print(f"Executed {exec_count-1} code cells and saved outputs to {nb_path}.")
