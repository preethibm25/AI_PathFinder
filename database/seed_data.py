"""
Standalone runner for seeding database from root directory.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database.connection import SessionLocal, Base, engine
from app.database.seed import seed_database

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        print("Database initialized and seeded successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
