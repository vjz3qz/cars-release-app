from . import v1

from flask import jsonify, request
import logging
from application.utils.handle_file_upload import extract_pdf_text
from application.controllers.analyze_controller import (
    analyze_prior_authorization_against_requirements,
)
from application.controllers.discovery_controller import (
    fetch_procedure_requirements_by_insurance,
)
from application.controllers.call_controller import call_insurance_with_ai
from application.controllers.upload_controller import (
    upload_file_url,
    upload_file_object,
)
from application.services.blob_storage_service import get_file_url


@v1.route("/query-requirements", methods=["POST"])
def query_requirements():
    try:
        json_data = request.json or {}
        insurance_provider = json_data.get("insurance_provider")
        procedure = json_data.get("procedure")
        cpt_code = json_data.get("cpt_code", "")
        history_of_present_illness = json_data.get("history_of_present_illness", "")
        additional_information = json_data.get("additional_information", "")

        if not insurance_provider:
            logging.error("No insurance_provider provided")
            return jsonify({"error": "No insurance_provider provided"}), 400
        if not procedure:
            logging.error("No procedure provided")
            return jsonify({"error": "No procedure provided"}), 400

        response_text, source_documents = fetch_procedure_requirements_by_insurance(
            insurance_provider,
            procedure,
            cpt_code,
            history_of_present_illness,
            additional_information,
        )
        return jsonify(
            {"response_text": response_text, "source_documents": source_documents}
        )

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@v1.route("/analyze-prior-authorization", methods=["POST"])
def analyze_prior_authorization():
    try:
        if "insurance_provider" not in request.form:
            logging.error("No insurance_provider provided")
            return jsonify({"error": "No insurance_provider provided"}), 400
        if "procedure" not in request.form:
            logging.error("No procedure provided")
            return jsonify({"error": "No procedure provided"}), 400
        if "prior_authorization_letter" not in request.files:
            logging.error("No prior authorization letter file provided")
            return jsonify({"error": "No file provided"}), 400

        insurance_provider = request.form["insurance_provider"]
        procedure = request.form["procedure"]
        prior_authorization_letter = request.files["prior_authorization_letter"]
        cpt_code = request.form.get("cpt_code", "")
        additional_information = request.form.get("additional_information", "")

        # process file and extract text
        prior_authorization_text = extract_pdf_text(prior_authorization_letter)

        (
            response_text,
            source_documents,
        ) = analyze_prior_authorization_against_requirements(
            insurance_provider,
            procedure,
            prior_authorization_text,
            cpt_code,
            additional_information,
        )
        return jsonify(
            {
                "response_text": response_text,
                "source_documents": source_documents,
            }
        )

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@v1.route("/call-insurance", methods=["POST"])
def call_insurance():
    try:
        json_data = request.json or {}
        patientFullName = json_data.get("patientFullName")
        patientInsurancePlan = json_data.get("patientInsurancePlan")
        patientInsuranceID = json_data.get("patientInsuranceID")
        physicianName = json_data.get("physicianName")
        physicianNPI = json_data.get("physicianNPI")
        physicianNotes = json_data.get("physicianNotes")
        reasonForCall = json_data.get("reasonForCall")
        insuranceName = json_data.get("insuranceName")
        insurancePlan = json_data.get("insurancePlan")
        insurancePhoneNumber = json_data.get("insurancePhoneNumber")

        if not patientFullName:
            logging.error("Patient full name is required")
            return jsonify({"error": "Patient full name is required"}), 400
        if not patientInsurancePlan:
            logging.error("Patient insurance plan is required")
            return jsonify({"error": "Patient insurance plan is required"}), 400
        if not patientInsuranceID:
            logging.error("Patient insurance ID is required")
            return jsonify({"error": "Patient insurance ID is required"}), 400
        if not physicianName:
            logging.error("Physician name is required")
            return jsonify({"error": "Physician name is required"}), 400
        if not physicianNPI:
            logging.error("Physician NPI is required")
            return jsonify({"error": "Physician NPI is required"}), 400
        if not physicianNotes:
            logging.error("Physician notes are required")
            return jsonify({"error": "Physician notes are required"}), 400
        if not reasonForCall:
            logging.error("Task is required")
            return jsonify({"error": "Task is required"}), 400
        if not insuranceName:
            logging.error("Insurance name is required")
            return jsonify({"error": "Insurance name is required"}), 400
        if not insurancePlan:
            logging.error("Insurance plan is required")
            return jsonify({"error": "Insurance plan is required"}), 400
        if not insurancePhoneNumber:
            logging.error("Phone number is required")
            return jsonify({"error": "Phone number is required"}), 400

        response, status_code = call_insurance_with_ai(
            patientFullName,
            patientInsurancePlan,
            patientInsuranceID,
            physicianName,
            physicianNPI,
            physicianNotes,
            reasonForCall,
            insuranceName,
            insurancePlan,
            insurancePhoneNumber,
        )
        return jsonify(response), status_code

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@v1.route("/upload-file", methods=["POST"])
def upload_file():
    try:
        file_object = request.files.get("file")
        file_url = request.form.get("url")
        insurance_provider = request.form.get("insurance_provider")

        if not file_object and not file_url:
            logging.error("No file or url provided")
            return jsonify({"error": "No file or url provided"}), 400
        if not insurance_provider:
            logging.error("No insurance provider provided")
            return jsonify({"error": "No insurance provider provided"}), 400

        if file_object and file_url:
            file_id = upload_file_object(
                file_object, insurance_provider, file_url=file_url
            )
        else:
            file_id = (
                upload_file_url(file_url, insurance_provider)
                if file_url
                else upload_file_object(file_object, insurance_provider)
            )

        return jsonify({"file_id": file_id})

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@v1.route("/get-file", methods=["GET"])
def get_file():
    try:
        file_id = request.args.get("file_id")
        insurance_provider = request.args.get("insurance_provider")

        if not file_id:
            logging.error("No file id provided")
            return jsonify({"error": "No file id provided"}), 400
        if not insurance_provider:
            logging.error("No insurance provider provided")
            return jsonify({"error": "No insurance provider provided"}), 400

        file_url = get_file_url(file_id, insurance_provider)

        return jsonify({"file_url": file_url})

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# TODO different tables for diff docs, procedures, embeddings, figure out filtration strategy
