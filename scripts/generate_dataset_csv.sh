#!/bin/bash

bucket_name=$1
folder_name=$2

echo "Generating dataset CSV..."
echo "From Google cloud storage bucket: $bucket_name"
echo "Subfolder: $folder_name"

gsutil ls gs://$bucket_name/$folder_name/*.jpg | awk -v category="$folder_name" '{print $0 "," category}' >> dataset.csv

echo "Finished"