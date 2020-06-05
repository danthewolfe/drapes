#!/bin/bash
BUCKET=resources.library.nd.edu

function doStuff {
  # mangle html
  munch --css ./template --html ./template --html ./examples --ignore .nd,.body,.classList,.library,.readyState,.status,.head,.s3-website-us-east-1,.amazonaws,.com,.edu,.href,.title,.b,.alerts,.alert-section,.alert-container,.alert-description,.informational,.informational-yellow,.warning,.execute-api,.us-east-1,.responseText,.onload,.onerror
  # munch screws up images so let's get rid of that, so we don't accidentally upload it
  rm -R ./template_opt/images
  # upload to aws
  aws s3 sync ./template_opt s3://${BUCKET}/frame --exclude '.*' --exclude '*.md' --acl public-read # --profile wseAdmin
  aws s3 sync ./template/images s3://${BUCKET}/frame/images --acl public-read
  echo "Deployed to ${BUCKET}.s3-website-us-east-1.amazonaws.com/frame."
}

function installStuff {
  pushd html-muncher
  python setup.py install
  popd
    echo "Munch was not installed, so we installed it for you."
}

# check if munch is installed
if hash munch 2>/dev/null; then
  doStuff
else
  installStuff
  doStuff
fi
