# ==========================================
# BASE
# ==========================================
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ==========================================
# PYTHON DEPENDENCIES
# ==========================================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ==========================================
# APPLICATION CODE
# ==========================================
COPY . .

# Create data directory for SQLite persistence
# Ensure data and chroma_db directories exist (chroma_db excluded from .dockerignore)
RUN mkdir -p /app/data /app/rag/chroma_db

# Cloud Run uses PORT env variable (default 8080)
ENV PORT=8080

# Default DATABASE_URL points to the persisted volume
ENV DATABASE_URL="sqlite:///./data/telecom_ai.db"

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT:-8080}/')" || exit 1

# Run with uvicorn on $PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
