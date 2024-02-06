# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are defined in the environment
import os
import logging
import boto3
from botocore.exceptions import NoCredentialsError
import logging

# Environment setup
try:
    bucket_name = os.environ["S3_BUCKET_NAME"]
except KeyError:
    logging.error("`S3_BUCKET_NAME` environment variable required")
    raise EnvironmentError("[error]: `S3_BUCKET_NAME` environment variable required")


def init_blob_storage():
    """
    Connect to S3
    """
    logging.info("Initializing blob storage")
    s3 = boto3.client("s3")
    return s3


blob_storage = init_blob_storage()


def upload_file_to_blob_storage(file_path, file_id, insurance_provider, file_name=None):
    """
    Uploads a file to the specified S3 bucket.
    :param file_path: The file path to upload.
    :param file_id: The ID (filename) for the file in S3.
    :param insurance_provider: The insurance provider associated with the file.
    :param file_name: The name of file being uploaded.
    :raises: NoCredentialsError if credentials are not available.
    :raises: Exception if there is an error uploading the file.
    """
    try:
        logging.info("Uploading file to blob storage")
        key = get_file_path(file_id, insurance_provider)
        # Reopen the temporary file in binary read mode for uploading
        with open(file_path, "rb") as file_to_upload:
            file_to_upload.seek(0)  # Reset file pointer to the start of the file
            blob_storage.upload_fileobj(
                Fileobj=file_to_upload,
                Bucket=bucket_name,
                Key=key,
                ExtraArgs={"ContentType": "application/pdf"},
            )

    except NoCredentialsError:
        logging.error("Credentials not available")
        raise NoCredentialsError("Credentials not available")
    except Exception as e:  # Catch all exceptions
        logging.error(f"Error uploading file to blob storage: {str(e)}")
        raise Exception(str(e))


def get_file_path(file_id, insurance_provider):
    """
    Retrieves the path for a file in S3.
    :param file_id: The ID (filename) of the file in S3.
    :param insurance_provider: The insurance provider associated with the file.
    :return: The path for the file.
    """
    logging.info("Retrieving file path")
    key = f"{insurance_provider}/{file_id}"
    return key


def get_file_url(file_id, insurance_provider):
    """
    Retrieves the URL for a file in S3.
    :param file_id: The ID (filename) of the file in S3.
    :param insurance_provider: The insurance provider associated with the file.
    :return: The URL for the file.
    """
    logging.info("Retrieving file URL")
    key = get_file_path(file_id, insurance_provider)
    url = blob_storage.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": bucket_name, "Key": key},
        ExpiresIn=3600,  # Expiration time in seconds
    )
    return url
