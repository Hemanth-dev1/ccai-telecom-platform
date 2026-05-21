#!/usr/bin/env bash
#
# deploy.sh — Aurora Telecom AI Platform — GCP Deployment Script
#
# Usage:
#   ./deploy.sh                  # Run the full interactive deployment
#   ./deploy.sh --auto           # Automated: read from .deploy.env
#   ./deploy.sh --help           # Show help
#
# Prerequisites:
#   - gcloud CLI installed & authenticated  (gcloud auth login)
#   - Docker installed
#   - A GCP project with billing enabled
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }

# ============================================
# Default config
# ============================================
REGION="us-central1"
REPOSITORY="aurora-repo"
BACKEND_SERVICE="aurora-backend"
FRONTEND_SERVICE="aurora-frontend"
DATA_BUCKET="aurora-sqlite-data"
BACKEND_IMAGE=""
FRONTEND_IMAGE=""

# ============================================
# HELP
# ============================================
if [[ "${1:-}" == "--help" ]]; then
    echo ""
    echo "Aurora Telecom AI Platform — GCP Deployment Script"
    echo ""
    echo "Interactive mode (default):"
    echo "  ./deploy.sh"
    echo ""
    echo "Automated mode (read config from .deploy.env):"
    echo "  ./deploy.sh --auto"
    echo ""
    echo "Environment variables (for automation):"
    echo "  PROJECT_ID         — GCP Project ID (required)"
    echo "  REGION             — GCP region (default: us-central1)"
    echo "  GEMINI_API_KEY     — Gemini API key (required)"
    echo "  DF_PROJECT_ID      — Dialogflow CX Project ID"
    echo "  LOCATION_ID        — Dialogflow location (default: global)"
    echo "  AGENT_ID           — Dialogflow CX Agent ID"
    echo "  DATA_BUCKET        — GCS bucket for SQLite (default: aurora-sqlite-data)"
    echo ""
    exit 0
fi

# ============================================
# Load config
# ============================================
if [[ "${1:-}" == "--auto" ]]; then
    if [[ ! -f ".deploy.env" ]]; then
        err ".deploy.env not found!"
        exit 1
    fi
    source .deploy.env
    PROJECT_ID="${PROJECT_ID:?PROJECT_ID not set in .deploy.env}"
    GEMINI_API_KEY="${GEMINI_API_KEY:?GEMINI_API_KEY not set in .deploy.env}"
    DF_PROJECT_ID="${DF_PROJECT_ID:-$PROJECT_ID}"
    LOCATION_ID="${LOCATION_ID:-global}"
    AGENT_ID="${AGENT_ID:-}"
    REGION="${REGION:-us-central1}"
    DATA_BUCKET="${DATA_BUCKET:-aurora-sqlite-data}"
else
    # Interactive: collect config
    echo ""
    echo "============================================"
    echo " Aurora Telecom AI Platform — GCP Deploy"
    echo "============================================"
    echo ""

    read -rp "Enter your GCP Project ID: " PROJECT_ID
    [[ -z "$PROJECT_ID" ]] && { err "Project ID required"; exit 1; }

    read -rsp "Enter your Gemini API key: " GEMINI_API_KEY
    echo ""
    [[ -z "$GEMINI_API_KEY" ]] && { err "Gemini API key required"; exit 1; }

    read -rp "Dialogflow CX Project ID (default: $PROJECT_ID): " DF_PROJECT_ID
    DF_PROJECT_ID="${DF_PROJECT_ID:-$PROJECT_ID}"

    read -rp "Dialogflow CX Location ID (default: global): " LOCATION_ID
    LOCATION_ID="${LOCATION_ID:-global}"

    read -rp "Dialogflow CX Agent ID (leave blank if not used): " AGENT_ID

    read -rp "GCP Region (default: us-central1): " REGION
    REGION="${REGION:-us-central1}"

    read -rp "GCS bucket name for SQLite data (default: aurora-sqlite-data): " DATA_BUCKET
    DATA_BUCKET="${DATA_BUCKET:-aurora-sqlite-data}"
fi

# ============================================
# Step 1: Verify tools
# ============================================
echo ""
info "Step 1/9: Verifying tools..."

command -v gcloud >/dev/null 2>&1 || { err "gcloud not found. Install from https://cloud.google.com/sdk"; exit 1; }
command -v docker >/dev/null 2>&1 || { err "Docker not found. Install Docker first."; exit 1; }

log "gcloud and Docker found"

# ============================================
# Step 2: Set GCP project
# ============================================
echo ""
info "Step 2/9: Setting GCP project to $PROJECT_ID..."

gcloud config set project "$PROJECT_ID" --quiet
log "Project set to $PROJECT_ID"

# ============================================
# Step 3: Enable required APIs
# ============================================
echo ""
info "Step 3/9: Enabling required GCP APIs..."

REQUIRED_APIS=(
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "artifactregistry.googleapis.com"
    "storage.googleapis.com"
    "secretmanager.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    gcloud services enable "$api" --quiet
    log "Enabled $api"
done

# ============================================
# Step 4: Store secrets in Secret Manager
# ============================================
echo ""
info "Step 4/9: Storing secrets in Secret Manager..."

# Create secrets if they don't exist
for secret_name in "gemini-api-key" "dialogflow-project-id" "dialogflow-agent-id"; do
    if ! gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "placeholder" | gcloud secrets create "$secret_name" \
            --replication-policy="automatic" \
            --project="$PROJECT_ID" --quiet
        log "Created secret: $secret_name"
    else
        log "Secret already exists: $secret_name"
    fi
done

# Update secrets with current values
echo -n "$GEMINI_API_KEY" | gcloud secrets versions add "gemini-api-key" --data-file=- --quiet
echo -n "$DF_PROJECT_ID" | gcloud secrets versions add "dialogflow-project-id" --data-file=- --quiet
if [[ -n "$AGENT_ID" ]]; then
    echo -n "$AGENT_ID" | gcloud secrets versions add "dialogflow-agent-id" --data-file=- --quiet
fi

log "Secrets updated"

# ============================================
# Step 5: Create Artifact Registry
# ============================================
echo ""
info "Step 5/9: Setting up Artifact Registry..."

if gcloud artifacts repositories describe "$REPOSITORY" \
    --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    log "Repository $REPOSITORY already exists"
else
    gcloud artifacts repositories create "$REPOSITORY" \
        --repository-format=docker \
        --location="$REGION" \
        --project="$PROJECT_ID" --quiet
    log "Created repository: $REPOSITORY"
fi

# Configure Docker for Artifact Registry
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
log "Docker configured for Artifact Registry"

# ============================================
# Step 6: Create GCS bucket for SQLite data
# ============================================
echo ""
info "Step 6/9: Creating GCS bucket for SQLite persistence..."

if gsutil ls "gs://${DATA_BUCKET}" &>/dev/null 2>&1; then
    log "Bucket $DATA_BUCKET already exists"
else
    gsutil mb -l "$REGION" "gs://${DATA_BUCKET}"
    log "Created bucket: $DATA_BUCKET"
fi

# ============================================
# Step 7: Build and push Docker images
# ============================================
echo ""
info "Step 7/9: Building and pushing Docker images..."

TAG="$(date +%Y%m%d-%H%M%S)"
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-backend:${TAG}"
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-frontend:${TAG}"

echo ""
info "Building backend image..."
docker build -t "$BACKEND_IMAGE" -t "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-backend:latest" ./backend
docker push "$BACKEND_IMAGE"
docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-backend:latest"
log "Backend image pushed: $BACKEND_IMAGE"

# ============================================
# Step 8: Deploy backend to Cloud Run
# ============================================
echo ""
info "Step 8/9: Deploying backend to Cloud Run..."

gcloud run deploy "$BACKEND_SERVICE" \
    --image="$BACKEND_IMAGE" \
    --region="$REGION" \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=3 \
    --concurrency=50 \
    --timeout=120s \
    --set-env-vars="^~^GEMINI_API_KEY=$GEMINI_API_KEY~PROJECT_ID=$DF_PROJECT_ID~LOCATION_ID=$LOCATION_ID~AGENT_ID=$AGENT_ID" \
    --add-volume=name=aurora-data,type=cloud-storage,bucket="$DATA_BUCKET" \
    --add-volume-mount=volume=aurora-data,mount-path=/app/data \
    --quiet

BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
    --region="$REGION" \
    --format="value(status.url)" \
    --project="$PROJECT_ID")

log "Backend deployed at: $BACKEND_URL"

# ============================================
# Step 9: Build frontend with backend URL + Deploy
# Build MUST happen AFTER backend is deployed so we know the URL at build time
# ============================================
echo ""
info "Step 9/9: Building frontend & deploying to Cloud Run..."

docker build \
    --build-arg "AUTH_USERNAME=Hemanth" \
    --build-arg "AUTH_PASSWORD=Hemanth@123" \
    -t "${FRONTEND_IMAGE}" \
    -t "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-frontend:latest" \
    ./frontend
docker push "${FRONTEND_IMAGE}"
docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/aurora-frontend:latest"
log "Frontend image pushed: ${FRONTEND_IMAGE}"

gcloud run deploy "$FRONTEND_SERVICE" \
    --image="${FRONTEND_IMAGE}" \
    --region="$REGION" \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --memory=256Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=3 \
    --concurrency=80 \
    --timeout=60s \
    --set-env-vars="^~^BACKEND_URL=$BACKEND_URL" \
    --quiet

FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" \
    --region="$REGION" \
    --format="value(status.url)" \
    --project="$PROJECT_ID")

log "Frontend deployed at: $FRONTEND_URL"

# ============================================
# Done
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}  DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo -e "  ${CYAN}Frontend URL:${NC}  $FRONTEND_URL"
echo -e "  ${CYAN}Backend URL:${NC}   $BACKEND_URL"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo "  1. Visit $FRONTEND_URL to access the platform"
echo "  2. Log in with username 'Hemanth' and password 'Hemanth@123'"
echo "  3. Test the chat endpoint directly:"
echo "     curl -X POST $BACKEND_URL/chat \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"message\":\"My bill is too high\",\"session_id\":\"test-001\"}'"
echo ""
echo -e "  ${YELLOW}To redeploy with latest code:${NC}"
echo "     ./deploy.sh --auto"
echo ""
