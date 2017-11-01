#!/bin/bash

BUCKET=resources.library.nd.edu

pushd mangler
  echo -e "\n=== Deploying to s3 bucket ${BUCKET}"
  aws s3 sync ./toBuild/dist s3://${BUCKET}/frame --delete --acl public-read --profile wseAdmin
popd

echo -e "\nDeployed to ${BUCKET}.s3-website-us-east-1.amazonaws.com/frame"
