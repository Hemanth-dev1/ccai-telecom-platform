from pathlib import Path
import chromadb

BASE_DIR = Path(__file__).resolve().parent

DB_PATH = BASE_DIR / "chroma_db"

client = chromadb.PersistentClient(
    path=str(DB_PATH)
)

# Lazy initialization: collection is set up on first use
_collection = None

def _init_collection():
    global _collection
    if _collection is not None:
        return

    try:
        _collection = client.get_collection(name="telecom_kb")
        print("\nChromaDB: Collection 'telecom_kb' loaded.\n")
    except Exception:
        print("\nChromaDB: Creating new collection...")
        try:
            _collection = client.create_collection(name="telecom_kb")
            kb_files = [
                BASE_DIR / "knowledge_base" / "billing_faq.txt",
                BASE_DIR / "knowledge_base" / "roaming_policy.txt",
                BASE_DIR / "knowledge_base" / "recharge_issues.txt",
                BASE_DIR / "knowledge_base" / "network_troubleshooting.txt",
            ]
            for idx, file_path in enumerate(kb_files):
                if file_path.exists():
                    doc = file_path.read_text().strip()
                    if doc:
                        _collection.add(documents=[doc], ids=[str(idx)])
                        print(f"  Ingested: {file_path.name}")
                    else:
                        print(f"  Skipped (empty): {file_path.name}")
            print("ChromaDB: Knowledge base ready.\n")
        except Exception as e2:
            print(f"\nChromaDB init error: {e2}\n")
            _collection = None


def retrieve_context(query):

    _init_collection()

    if _collection is None:
        return "Knowledge base unavailable."

    try:
        results = _collection.query(
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