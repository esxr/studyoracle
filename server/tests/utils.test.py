# import utils
from server.utils import convert_PageObjects_to_Documents
from langchain.docstore.document import Document

# import PyPDF2
from PyPDF2 import PdfReader

def test_convert_PageObjects_to_Documents():
    # open "assignments.pdf" using PyPDF2 Reader
    sample_file_path = open("tests/assignments.pdf", "rb")
    pdf_reader = PdfReader(sample_file_path)
    # convert PageObjects to Documents
    list_of_documents = convert_PageObjects_to_Documents(pdf_reader.pages)

    # check if the number of PageObjects and Documents are the same
    assert len(pdf_reader.pages) == len(list_of_documents)

    # check if the first page of the PDF is converted to a Document
    assert isinstance(list_of_documents[0], Document)