import io
from flask import request
import pdfminer
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.pdfpage import PDFPage
from pdfminer.layout import LAParams


def extract_pdf_text(file_storage):
    # Set up layout analysis parameters
    laparams = LAParams(all_texts=True)

    resource_manager = PDFResourceManager()
    fake_file_handle = io.StringIO()
    converter = TextConverter(resource_manager, fake_file_handle, laparams=laparams)
    page_interpreter = PDFPageInterpreter(resource_manager, converter)

    # Process the FileStorage object
    file_stream = file_storage.stream
    for page in PDFPage.get_pages(file_stream, caching=True, check_extractable=True):
        page_interpreter.process_page(page)

    text = fake_file_handle.getvalue()

    # Close open handles
    converter.close()
    fake_file_handle.close()

    if text:
        return text
    else:
        return "No text extracted"
