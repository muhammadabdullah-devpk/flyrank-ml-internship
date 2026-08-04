import json
import os
import sys
from pathlib import Path
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

nb_path = Path('work/notebooks/capstone.ipynb')

with open(nb_path, 'r', encoding='utf-8') as f:
    nb = nbformat.read(f, as_version=4)

ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

try:
    print("Executing capstone.ipynb top-to-bottom...")
    ep.preprocess(nb, {'metadata': {'path': 'work/notebooks'}})
    print("Execution completed successfully!")
except Exception as e:
    print(f"Error during execution: {e}")

with open(nb_path, 'w', encoding='utf-8') as f:
    nbformat.write(nb, f)

print("Updated capstone.ipynb with executed cell outputs.")
