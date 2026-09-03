import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if os.environ.get("VERCEL"):
    DEFAULT_DB_PATH = "sqlite:////tmp/jobshield.db"
else:
    DEFAULT_DB_PATH = f"sqlite:///{os.path.join(BASE_DIR, '..', 'jobshield.db')}"

DB_PATH = os.environ.get("DATABASE_URL", DEFAULT_DB_PATH)

engine = create_engine(
    DB_PATH,
    connect_args={"check_same_thread": False} if DB_PATH.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
