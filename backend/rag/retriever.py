from pathlib import Path
import chromadb

BASE_DIR = Path(__file__).resolve().parent

DB_PATH = BASE_DIR / "chroma_db"

client = chromadb.PersistentClient(
    path=str(DB_PATH)
)

collection = client.get_collection(
    name="telecom_kb"
)


def retrieve_context(query):

    try:

        results = collection.query(
            query_texts=[query],
            n_results=1
        )

        documents = results.get("documents")

        if documents and documents[0]:

            return documents[0][0]

        return "No relevant telecom context found."

    except Exception as e:

        print(f"Retriever Error: {e}")

        return "Knowledge retrieval failed."