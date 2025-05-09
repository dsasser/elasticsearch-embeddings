#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

curl --cacert ./certs/es01.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "https://localhost:${ES_PORT}/_ingest/pipeline/openai_embeddings_pipeline" \
  -H 'Content-Type: application/json' \
  -d @- <<EOF
{
  "processors": [
    {
      "attachment": {
        "description": "Extract text from binary attachments",
        "field": "_attachment",
        "target_field": "_extracted_attachment",
        "ignore_missing": true,
        "indexed_chars_field": "_attachment_indexed_chars",
        "if": "ctx?._extract_binary_content == true",
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'attachment' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ],
        "remove_binary": false
      }
    },
    {
      "set": {
        "tag": "set_body",
        "description": "Set any extracted text on the 'body' field",
        "field": "body",
        "copy_from": "_extracted_attachment.content",
        "ignore_empty_value": true,
        "if": "ctx?._extract_binary_content == true",
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'set' with tag 'set_body' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ]
      }
    },
    {
      "gsub": {
        "tag": "remove_replacement_chars",
        "description": "Remove unicode 'replacement' characters",
        "field": "body",
        "pattern": "�",
        "replacement": "",
        "ignore_missing": true,
        "if": "ctx?._extract_binary_content == true",
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'gsub' with tag 'remove_replacement_chars' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ]
      }
    },
    {
      "gsub": {
        "tag": "remove_extra_whitespace",
        "description": "Squish whitespace",
        "field": "body",
        "pattern": "\\\\s+",
        "replacement": " ",
        "ignore_missing": true,
        "if": "ctx?._reduce_whitespace == true",
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'gsub' with tag 'remove_extra_whitespace' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ]
      }
    },
    {
      "trim": {
        "description": "Trim leading and trailing whitespace",
        "field": "body",
        "ignore_missing": true,
        "if": "ctx?._reduce_whitespace == true",
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'trim' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ]
      }
    },
    {
      "remove": {
        "tag": "remove_meta_fields",
        "description": "Remove meta fields",
        "field": [
          "_attachment",
          "_attachment_indexed_chars",
          "_extracted_attachment",
          "_extract_binary_content",
          "_reduce_whitespace",
          "_run_ml_inference"
        ],
        "ignore_missing": true,
        "on_failure": [
          {
            "append": {
              "description": "Record error information",
              "field": "_ingestion_errors",
              "value": "Processor 'remove' with tag 'remove_meta_fields' in pipeline '{{ _ingest.on_failure_pipeline }}' failed with message '{{ _ingest.on_failure_message }}'"
            }
          }
        ]
      }
    },
    {
      "inference": {
        "model_id": "openai_embeddings",
        "input_output": {
          "input_field": "body",
          "output_field": "embedding"
        }
      }
    }
  ]
}
EOF
