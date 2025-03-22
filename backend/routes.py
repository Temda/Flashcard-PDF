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
        # print(text)
        return jsonify(flashcards), 200
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Mock Data Testing
def generate_flashcards(text):
    mock_flashcards = [
        {"front": "Artificial Intelligence", "back": "ปัญญาประดิษฐ์"},
        {"front": "Machine Learning", "back": "การเรียนรู้ของเครื่อง"},
        {"front": "Neural Network", "back": "เครือข่ายประสาทเทียม"},
        {"front": "Deep Learning", "back": "การเรียนรู้เชิงลึก"},
        {"front": "Natural Language Processing", "back": "การประมวลผลภาษาธรรมชาติ"},
    ]
    
    sentences = text.split('\n')
    
    flashcards = []
    for i, sentence in enumerate(sentences):
        if i < len(mock_flashcards):
            flashcards.append(mock_flashcards[i])
        else:
            flashcards.append({'front': sentence, 'back': sentence})
    
    return flashcards

# รอ เชื่อมต่อกับ AI  
# def generate_flashcards(text):
#     sentences = text.split('\n')
#     flashcards = []
#     for sentence in sentences:
#         translation = translate_text(sentence)
#         flashcards.append({'front': sentence, 'back': translation})
#     return flashcards