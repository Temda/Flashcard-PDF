import requests
from app import app

def translate_text(text):
    api_key = app.config['GEMINI_API_KEY']
    response = requests.post(
        'https://api.gemini.com/translate',
        json={'text': text, 'target_lang': 'en'},
        headers={'Authorization': f'Bearer {api_key}'}
    )
    return response.json().get('translation', '')