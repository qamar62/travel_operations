import os
import sys

# Add the project directory to the Python path
INTERP = os.path.expanduser("/opt/alt/python39/venv/bin/python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

cwd = os.getcwd()
sys.path.append(cwd)

# Set up Django's settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Import the WSGI application
from core.wsgi import application  # This should be after setting DJANGO_SETTINGS_MODULE