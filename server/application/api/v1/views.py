from . import v1

from flask import jsonify, request
import logging

@v1.route("/analyze", methods=["POST"])
def analyze():
    logging.info("Received request to analyze a prior authorization")
    file = request.files["file"]
    text = extract_pdf_text(file)
    result = analyze_prior_authorization_against_requirements(text)
    return jsonify(result)