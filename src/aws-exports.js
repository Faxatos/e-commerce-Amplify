/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "eu-north-1",
    "aws_cognito_identity_pool_id": "eu-north-1:60a6e0ec-43af-4f27-806d-592ec0bb7dba",
    "aws_cognito_region": "eu-north-1",
    "aws_user_pools_id": "eu-north-1_iTZlLxNk1",
    "aws_user_pools_web_client_id": "2o92rsnato97aa8spif6j69o4c",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_dynamodb_all_tables_region": "eu-north-1",
    "aws_dynamodb_table_schemas": [
        {
            "tableName": "productstable-dev",
            "region": "eu-north-1"
        },
        {
            "tableName": "cartstable-dev",
            "region": "eu-north-1"
        },
        {
            "tableName": "orderstable-dev",
            "region": "eu-north-1"
        }
    ],
    "aws_cloud_logic_custom": [
        {
            "name": "productsapi",
            "endpoint": "https://zj22ciab5b.execute-api.eu-north-1.amazonaws.com/dev",
            "region": "eu-north-1"
        },
        {
            "name": "cartsapi",
            "endpoint": "https://2rnwnxlxii.execute-api.eu-north-1.amazonaws.com/dev",
            "region": "eu-north-1"
        },
        {
            "name": "ordersapi",
            "endpoint": "https://3et7pavl32.execute-api.eu-north-1.amazonaws.com/dev",
            "region": "eu-north-1"
        }
    ]
};


export default awsmobile;
