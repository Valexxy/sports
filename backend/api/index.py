import sys
from pathlib import Path

# Add parent directory to sys.path so app module is discoverable
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app

# Vercel entrypoint
app = app
