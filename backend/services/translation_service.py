import google.generativeai as genai
import json
import os

# api_key = os.getenv("GEMINI_API_KEY")
api_key = "AIzaSyBnPGPNj1Mlu49XHMlDegaUJIjX3Orttl4"


if not api_key:
    raise ValueError("Gemini API key is not configured.")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-pro-exp-03-25")

def translate_text(text, n):

    prompt = "\n".join([
        f"""
        Translate the following English word into Thai without explanations.
        Return the response in JSON format as follows:
        {{"front": "{word}", "back": "translated Thai word"}}
        """
        for word in text[:n]
    ])


    print("prompt", prompt)
    try:
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text') and response.text:
            try:
                translation = json.loads(response.text.strip())
                print(translation)
                return translation
            except json.JSONDecodeError:
                return {"error": "Failed to parse translation response."}
        
        return {"error": "Translation Error: No valid response received."}

    except Exception as e:
        return {"error": f"Translation failed: {str(e)}"}
