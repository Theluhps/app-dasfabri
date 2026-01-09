"""
Serviço de OCR para processamento de documentos
Implementa OCR com alta precisão para documentos de comércio exterior
"""

from typing import Dict, List, Optional, Any
from pathlib import Path
import io
from loguru import logger

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    Image = None
    logger.warning("Pillow não instalado. Execute: pip install Pillow")

try:
    import pdf2image
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    logger.warning("pdf2image não instalado. Execute: pip install pdf2image")

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    logger.warning("EasyOCR não instalado. Execute: pip install easyocr")

try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logger.warning("Tesseract não instalado. Execute: pip install pytesseract")


class OCRService:
    """
    Serviço de OCR para processamento de documentos
    Suporta múltiplos idiomas e tipos de documentos
    """
    
    def __init__(self):
        self.easyocr_reader = None
        self.supported_languages = ['en', 'pt', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'ko']
        
        if EASYOCR_AVAILABLE:
            try:
                # Inicializar EasyOCR (pode demorar na primeira vez)
                logger.info("Inicializando EasyOCR...")
                self.easyocr_reader = easyocr.Reader(self.supported_languages, gpu=False)
                logger.info("EasyOCR inicializado com sucesso")
            except Exception as e:
                logger.error(f"Erro ao inicializar EasyOCR: {e}")
                self.easyocr_reader = None
    
    def extract_text_from_image(self, image_path: str, language: str = 'pt') -> Dict[str, Any]:
        """
        Extrai texto de uma imagem
        
        Args:
            image_path: Caminho para a imagem
            language: Idioma do documento (pt, en, etc.)
        
        Returns:
            Dict com texto extraído e metadados
        """
        if not PIL_AVAILABLE:
            raise Exception("Pillow não está instalado. Execute: pip install Pillow")
        try:
            image = Image.open(image_path)
            return self._process_image(image, language)
        except Exception as e:
            logger.error(f"Erro ao processar imagem {image_path}: {e}")
            raise
    
    def extract_text_from_pdf(self, pdf_path: str, language: str = 'pt') -> Dict[str, Any]:
        """
        Extrai texto de um PDF
        
        Args:
            pdf_path: Caminho para o PDF
            language: Idioma do documento
        
        Returns:
            Dict com texto extraído de todas as páginas
        """
        if not PDF2IMAGE_AVAILABLE or not PIL_AVAILABLE:
            raise Exception("pdf2image e Pillow não estão instalados. Execute: pip install pdf2image Pillow")
        try:
            # Converter PDF para imagens
            images = pdf2image.convert_from_path(pdf_path)
            
            all_text = []
            for i, image in enumerate(images):
                page_result = self._process_image(image, language)
                page_result['page'] = i + 1
                all_text.append(page_result)
            
            return {
                'text': '\n\n'.join(page['text'] for page in all_text),
                'pages': all_text,
                'total_pages': len(images),
                'language': language
            }
        except Exception as e:
            logger.error(f"Erro ao processar PDF {pdf_path}: {e}")
            raise
    
    def extract_text_from_bytes(self, file_bytes: bytes, file_type: str, language: str = 'pt') -> Dict[str, Any]:
        """
        Extrai texto de bytes de arquivo
        
        Args:
            file_bytes: Bytes do arquivo
            file_type: Tipo do arquivo (pdf, png, jpg, etc.)
            language: Idioma do documento
        
        Returns:
            Dict com texto extraído
        """
        if not PIL_AVAILABLE:
            # Retornar resultado vazio se OCR não estiver disponível
            return {
                'text': '',
                'confidence': 0,
                'method': 'none',
                'error': 'Pillow não está instalado'
            }
        try:
            if file_type.lower() == 'pdf':
                if not PDF2IMAGE_AVAILABLE:
                    return {
                        'text': '',
                        'confidence': 0,
                        'method': 'none',
                        'error': 'pdf2image não está instalado'
                    }
                # Para PDF, salvar temporariamente e processar
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                    tmp.write(file_bytes)
                    tmp_path = tmp.name
                    result = self.extract_text_from_pdf(tmp_path, language)
                    Path(tmp_path).unlink()  # Limpar arquivo temporário
                    return result
            else:
                # Para imagens
                image = Image.open(io.BytesIO(file_bytes))
                return self._process_image(image, language)
        except Exception as e:
            logger.error(f"Erro ao processar bytes: {e}")
            # Retornar resultado vazio em caso de erro
            return {
                'text': '',
                'confidence': 0,
                'method': 'none',
                'error': str(e)
            }
    
    def _process_image(self, image, language: str = 'pt') -> Dict[str, Any]:
        """
        Processa uma imagem e extrai texto
        
        Args:
            image: Objeto PIL Image
            language: Idioma do documento
        
        Returns:
            Dict com texto e metadados
        """
        # Tentar EasyOCR primeiro (mais preciso)
        if self.easyocr_reader and EASYOCR_AVAILABLE:
            try:
                lang_code = language[:2] if language in self.supported_languages else 'en'
                result = self.easyocr_reader.readtext(image)
                
                text_lines = [item[1] for item in result]
                confidence_scores = [item[2] for item in result]
                
                return {
                    'text': '\n'.join(text_lines),
                    'confidence': sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0,
                    'method': 'easyocr',
                    'language': lang_code,
                    'lines': len(text_lines)
                }
            except Exception as e:
                logger.warning(f"EasyOCR falhou, tentando Tesseract: {e}")
        
        # Fallback para Tesseract
        if TESSERACT_AVAILABLE:
            try:
                lang_code = language[:2] if language in ['pt', 'en', 'es'] else 'eng'
                text = pytesseract.image_to_string(image, lang=lang_code)
                
                # Obter dados de confiança
                data = pytesseract.image_to_data(image, lang=lang_code, output_type=pytesseract.Output.DICT)
                confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
                
                return {
                    'text': text,
                    'confidence': avg_confidence / 100,  # Normalizar para 0-1
                    'method': 'tesseract',
                    'language': lang_code,
                    'lines': len(text.split('\n'))
                }
            except Exception as e:
                logger.error(f"Tesseract falhou: {e}")
        
        raise Exception("Nenhum engine de OCR disponível. Instale EasyOCR ou Tesseract.")
    
    def classify_document(self, text: str) -> Dict[str, Any]:
        """
        Classifica tipo de documento baseado no texto extraído
        
        Args:
            text: Texto extraído do documento
        
        Returns:
            Dict com tipo de documento e confiança
        """
        text_lower = text.lower()
        
        # Padrões para identificar tipos de documentos
        patterns = {
            'invoice': ['invoice', 'fatura', 'factura', 'bill', 'nota fiscal'],
            'bill_of_lading': ['bill of lading', 'conhecimento de embarque', 'bl', 'b/l'],
            'packing_list': ['packing list', 'lista de empaque', 'lista de embalagem'],
            'commercial_invoice': ['commercial invoice', 'fatura comercial'],
            'certificate_of_origin': ['certificate of origin', 'certificado de origem'],
            'insurance': ['insurance', 'seguro', 'apólice'],
            'license': ['license', 'licença', 'licencia', 'autorização'],
        }
        
        scores = {}
        for doc_type, keywords in patterns.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[doc_type] = score / len(keywords)
        
        if scores:
            best_match = max(scores.items(), key=lambda x: x[1])
            return {
                'document_type': best_match[0],
                'confidence': best_match[1],
                'all_scores': scores
            }
        
        return {
            'document_type': 'other',
            'confidence': 0.0,
            'all_scores': {}
        }


# Singleton do serviço OCR
_ocr_service: Optional[OCRService] = None


def get_ocr_service() -> OCRService:
    """Obtém instância singleton do OCRService"""
    global _ocr_service
    if _ocr_service is None:
        _ocr_service = OCRService()
    return _ocr_service

