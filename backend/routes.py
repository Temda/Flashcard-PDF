from flask import request, render_template, jsonify
from app import app
from services.pdf_parser import extract_text_from_pdf
from services.translation_service import translate_text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        text = extract_text_from_pdf(file)
        flashcards = generate_flashcards(text)
        return jsonify(flashcards)
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def generate_flashcards(text):
    sentences = text.split('\n')
    flashcards = []
    for sentence in sentences:
        translation = translate_text(sentence)
        flashcards.append({'front': sentence, 'back': translation})
    return flashcards