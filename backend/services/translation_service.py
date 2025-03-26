import google.generativeai as genai
from app import app

api_key = app.config.get('GEMINI_API_KEY')
# ไม่ต้องใช้งาน API key นะ เพราะว่า ลบทิ้งไปแล้วเป็น key test เฉยๆ อิอิ
if not api_key:
    raise ValueError("Gemini API key is not configured in app.config.")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-pro-exp-03-25")

def translate_text(text):

    try:
        response = model.generate_content(
            f"Translate the following English text into Thai using only words, without explanations: {text}"
        )
        
        if hasattr(response, 'text') and response.text:
            return response.text.strip()
        return "Translation Error"
    
    except Exception as e:
        return {"error": f"Translation failed: {str(e)}"}
