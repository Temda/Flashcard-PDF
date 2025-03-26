import fitz  # PyMuPDF
import re
from typing import Union, BinaryIO

def clean_text(text: str) -> str:
    text = re.sub(r'[^a-zA-Z\s\n]', '', text)
    
    text = re.sub(r' {2,}', ' ', text)
    
    text = re.sub(r'\n{2,}', '\n', text)
    
    return text.strip()

def extract_text_from_pdf(file: Union[BinaryIO, bytes]) -> str:
    try:
        with fitz.open(stream=file.read() if hasattr(file, 'read') else file, 
                      filetype="pdf") as pdf_document:
            
            if pdf_document.is_encrypted:
                raise ValueError("Encrypted PDF - unable to extract text")
                
            text = []
            for page in pdf_document:
                page_text = page.get_text()
                if page_text: 
                    text.append(page_text)
            
            if not text:
                raise RuntimeError("No text found in PDF")
                
            full_text = "\n".join(text)
            return clean_text(full_text)
            
    except fitz.FileDataError as e:
        raise ValueError(f"Invalid PDF file: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Failed to extract text: {str(e)}")