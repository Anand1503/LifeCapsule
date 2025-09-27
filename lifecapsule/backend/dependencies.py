from .db.chromadb import ChromaDBManager

# Global instance
db_manager = ChromaDBManager()

def get_db_manager() -> ChromaDBManager:
    return db_manager
