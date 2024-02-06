import requests
import os
import logging


def call_insurance_with_ai(
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
):
    """
    Call insurance company with AI

    Parameters:
    -----------
    patientFullName : string
        patient's full name
    patientInsurancePlan : string
        patient's insurance plan
    patientInsuranceID : string
        patient's insurance ID
    physicianName : string
        physician's name
    physicianNPI : string
        physician's NPI
    physicianNotes : string
        physician's notes
    reasonForCall : string
        reason for call
    insuranceName : string
        insurance company's name
    insurancePlan : string
        insurance company's plan
    insurancePhoneNumber : string
        insurance company's phone number

    Returns:
    --------
    None
    """
    headers = {
        "Authorization": os.environ.get("BLAND_API_KEY"),
    }

    task = f"""
            Hello, my name is Rahul, and I am calling on behalf of Dr. ${physicianName}. I am calling to request information about a prior authorization for one of our patients.

            Patient Information:
            - Full Name: ${patientFullName}
            - Insurance Plan: ${patientInsurancePlan}
            - Insurance ID: ${patientInsuranceID}

            Physician Information:
            - Physician Name: ${physicianName}
            - Physician NPI: ${physicianNPI}

            We would like to inquire about the prior authorization process for this patient, who is covered under the ${insurancePlan} plan of ${insuranceName}. Specifically, we need to know the necessary steps, required documentation, and the estimated time frame for the authorization process.

            Additionally, here are some notes from Dr. ${physicianName} regarding the patient's condition and the treatment plan: "${physicianNotes}". This information is pertinent to the prior authorization request.

            The reason for this call is ${reasonForCall}. Could you please provide us with the relevant information and guide us through the process?

            Also, for any further communication, you can reach us at Dr. ${physicianName}'s office at [Physician's Contact Number]. Thank you for your assistance.
            """

    data = {
        "phone_number": insurancePhoneNumber,
        "task": task,
        "voice_id": 1,
        "reduce_latency": True,
        "request_data": {},
        "voice_settings": {"speed": 1},
        "interruption_threshold": "null",
    }

    try:
        response = requests.post(
            "https://api.bland.ai/call", json=data, headers=headers
        )
        response.raise_for_status()  # Raises HTTPError for bad requests

        response_data = response.json()
        if response_data.get("status") != "success":
            return {
                "status": "error",
                "message": "API call unsuccessful",
                "details": response_data,
            }, 500

        return {"status": "success", "call_id": response_data.get("call_id")}, 200

    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Failed to make API call",
            "details": str(e),
        }, 500
