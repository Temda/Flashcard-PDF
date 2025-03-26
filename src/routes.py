from flask import request, render_template, jsonify
from app import app
from services.pdf_parser import extract_text_from_pdf
from services.translation_service import translate_text
import time

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
async def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        try:
            text = extract_text_from_pdf(file)
            flashcards = await generate_flashcards(text) 
            return jsonify(flashcards), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

async def generate_flashcards(text, n=10):
    sentences = [s.strip() for s in text.split('\n') if s.strip()]
    flashcards = []
    
    for sentence in sentences[:n]:
        print(f"Processing: {sentence[:n]}")
        translation = translate_text(sentence)
        flashcards.append({"front": sentence, "back": translation})
        time.sleep(10)

    print(flashcards)
    return flashcards
