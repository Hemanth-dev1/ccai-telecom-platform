import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(
    name="telecom_kb"
)

documents = []

files = [
    "knowledge_base/billing_faq.txt",
    "knowledge_base/roaming_policy.txt",
    "knowledge_base/recharge_issues.txt",
    "knowledge_base/network_troubleshooting.txt"
]

for file_path in files:

    with open(file_path, "r") as file:
        documents.append(file.read())

for idx, doc in enumerate(documents):

    collection.add(
        documents=[doc],
        ids=[str(idx)]
    )

print("Knowledge base ingested successfully.")