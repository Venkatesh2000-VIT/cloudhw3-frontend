import boto3
import json
from datetime import datetime
from opensearchpy import OpenSearch, RequestsHttpConnection
import os

print('0')
s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')

def lambda_handler(event, context):
    # Extract S3 object info from the event
    print('1')
    s3_event = event['Records'][0]['s3']
    bucket_name = s3_event['bucket']['name']
    object_key = s3_event['object']['key']
    
    
    # Initialize clients
    
    opensearch_client = OpenSearch(
        hosts=[{'host': 'search-photo-pqpzewv3u2ujipfas4t4tniadm.us-east-1.es.amazonaws.com', 'port': 443}],
        http_auth=('cloudAssignment3', 'fesxun-0momVu-cuscun'),  # Replace with opensearch auth if required
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )
    
    # Detect labels using Rekognition
    rekognition_response = rekognition_client.detect_labels(
        Image={'S3Object': {'Bucket': bucket_name, 'Name': object_key}},
        MaxLabels=10
    )
    labels = [label['Name'] for label in rekognition_response['Labels']]
    print('3')
    print('bucket name', bucket_name)
    print('object key', object_key)
    print('labels',labels)
    
    # Retrieve custom metadata
    metadata = s3_client.head_object(Bucket=bucket_name, Key=object_key)
    print("metadata", metadata)
    custom_labels = metadata['Metadata'].get('customlabels', '')
    custom_labels_list = custom_labels.split(',') if custom_labels else []
    print('4')
    # Combine Rekognition labels and custom labels
    all_labels = list(set(labels + custom_labels_list))
    print('all_labels', all_labels)
    # Prepare the document to index in OpenSearch
    document = {
        "objectKey": object_key,
        "bucket": bucket_name,
        "createdTimestamp": datetime.now().isoformat(),
        "labels": all_labels
    }
    print('6')
    # Index the document in OpenSearch
    response = opensearch_client.index(
        index="photos",
        body=document
    )
    print('7')
    print(f"Indexed document: {response}")
