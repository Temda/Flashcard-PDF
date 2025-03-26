import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'fallback-gemini-key')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'fallback-openAI-key')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads/')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 
    ALLOWED_EXTENSIONS = {'pdf'}