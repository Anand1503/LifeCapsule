from typing import List, Optional
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import os
from loguru import logger

# Ensure CPU-only for Ollama
os.environ["OLLAMA_NUM_THREAD"] = "1"

class ChromaDBManager:
    def __init__(self, persist_directory: str = "backend/chroma_db"):
        self.persist_directory = persist_directory
        self.embeddings = OllamaEmbeddings(model="llama3.2")
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.vectorstore: Optional[Chroma] = None
        self._load_vectorstore()

    def _load_vectorstore(self):
        """Load or create the vectorstore."""
        try:
            self.vectorstore = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
            logger.info("Vectorstore loaded.")
        except Exception as e:
            logger.warning(f"Could not load vectorstore, creating new: {e}")
            self.vectorstore = None

    async def add_documents(self, documents: List[Document]):
        """Add documents to the vector store asynchronously."""
        try:
            if self.vectorstore is None:
                self.vectorstore = Chroma.from_documents(
                    documents, self.embeddings, persist_directory=self.persist_directory
                )
            else:
                await self.vectorstore.aadd_documents(documents)
            self.vectorstore.persist()
            logger.info(f"Added {len(documents)} documents to ChromaDB.")
        except Exception as e:
            logger.error(f"Error adding documents to ChromaDB: {e}")
            raise

    def get_retriever(self, k: int = 4):
        """Get the retriever from vectorstore."""
        if self.vectorstore is None:
            return None
        return self.vectorstore.as_retriever(search_kwargs={"k": k})

    async def update_from_diary(self, diary_content: str):
        """Update vectorstore from full diary content."""
        try:
            if not diary_content.strip():
                logger.warning("No diary content to update.")
                return

            split_texts = self.text_splitter.split_text(diary_content)
            documents = [Document(page_content=text, metadata={"source": "diary"}) for text in split_texts]

            # Recreate vectorstore with new documents
            self.vectorstore = Chroma.from_documents(
                documents, self.embeddings, persist_directory=self.persist_directory
            )
            logger.info("Vectorstore updated from diary.")
        except Exception as e:
            logger.error(f"Error updating vectorstore: {e}")
            raise

    async def query(self, query_text: str, n_results: int = 4) -> dict:
        """Query the vectorstore asynchronously."""
        try:
            if self.vectorstore is None:
                return {"documents": [], "distances": []}
            results = await self.vectorstore.asimilarity_search_with_score(query_text, k=n_results)
            return {
                "documents": [doc.page_content for doc, _ in results],
                "distances": [score for _, score in results]
            }
        except Exception as e:
            logger.error(f"Error querying ChromaDB: {e}")
            return {"documents": [], "distances": []}
