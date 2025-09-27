from typing import Optional
from langchain_ollama import OllamaLLM
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from loguru import logger
from ..db.chromadb import ChromaDBManager

ollama_llm = OllamaLLM(model="llama3.2", streaming=False)

async def create_qa_chain(db_manager: ChromaDBManager) -> Optional[RetrievalQA]:
    """Create RetrievalQA chain using the vectorstore."""
    try:
        if db_manager.vectorstore is None:
            logger.warning("Vectorstore not initialized.")
            return None

        retriever = db_manager.get_retriever()

        prompt_template = PromptTemplate(
            input_variables=["context", "question"],
            template="You are a helpful assistant that answers questions based only on the provided diary context. Do not use external knowledge.\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:"
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=ollama_llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt_template}
        )
        logger.info("QA chain created.")
        return qa_chain
    except Exception as e:
        logger.error(f"Error creating QA chain: {e}")
        return None

async def query_llm(db_manager: ChromaDBManager, query: str) -> str:
    """Query the LLM based on diary data."""
    try:
        qa_chain = await create_qa_chain(db_manager)
        if not qa_chain:
            return "Knowledge base is empty or error in setup. Please add diary entries."

        result = await qa_chain.ainvoke({"query": query})
        answer = result.get("result", "I couldn't find a relevant answer in your diary.")
        logger.info(f"LLM query processed: {query}")
        return answer
    except Exception as e:
        logger.error(f"Error querying LLM: {e}")
        return "Something went wrong while processing your query."
