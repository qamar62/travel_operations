import os
import sys

# Add your virtualenv Python path
VIRTUALENV = "/home/yy89pc8fin0s/virtualenv/travel_operations/backend/3.9/lib/python3.9/site-packages"
if VIRTUALENV not in sys.path:
    sys.path.insert(0, VIRTUALENV)

# Add the project directory to the Python path
project_dir = "/home/yy89pc8fin0s/travel_operations/backend"
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

# Set up Django's settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Import the WSGI application
from core.wsgi import application