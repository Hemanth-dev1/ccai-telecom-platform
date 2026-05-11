import google.generativeai as genai

from config import GEMINI_API_KEY


# ==========================================
# CONFIGURE GEMINI
# ==========================================

genai.configure(
    api_key=GEMINI_API_KEY
)


# ==========================================
# SHARED MODEL
# ==========================================

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)