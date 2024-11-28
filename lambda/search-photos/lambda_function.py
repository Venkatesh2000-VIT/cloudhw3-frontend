import os
import boto3
import json

from opensearchpy import OpenSearch

# Set up OpenSearch client
host = os.getenv("os_host")
username = os.getenv("os_name")
password = os.getenv("os_password")

auth = (username, password)
print(host, auth)

opensearch_client = OpenSearch(
    hosts = [{"host": host, "port": 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    ssl_show_warn = False
)

def lambda_handler(event, context):
    print(event)
    client = boto3.client('lexv2-runtime')

    q = event['queryStringParameters']['q']
    print(q)

    response = client.recognize_text(
        botId='IZ93Z7GB8E',
        botAliasId='I4NUKIXFBH',
        localeId='en_US',
        sessionId='sessionId',
        text=q
    )
    print(response)

    # Extract the slots from the event
    slots = response['sessionState']['intent']['slots']
    slot_values = [value for key, value in slots.items() if value]
    print(slot_values)

    original_values = [item['value']['originalValue'] for item in slot_values]

    index_name = 'photos' 
    query = {
        'size': 10,
        'query': {
            'bool': {
                'should': [
                    {'match': {'labels': slot}} for slot in original_values
                ],
                'minimum_should_match': 1
            }
        }
    }
    
    # Execute the search query
    response = opensearch_client.search(
        body=query,
        index=index_name
    )
    print(response)
    
    # Extract the results from the response
    results = [
        {
            '_score': hit['_score'],
            'objectKey': hit['_source']['objectKey'],
            'bucket': hit['_source']['bucket']
        }
        for hit in response['hits']['hits']
    ]
    print(results)
    
    # Return the search results
    return {
        'statusCode': 200,
        "isBase64Encoded": False,
        "headers": { "Content-Type": "application/json" },
        'body': json.dumps(results)
    }