#!/bin/bash
BUCKET=resources.library.nd.edu

function doStuff {
  # mangle html
  munch --css ./template/css --html ./template/html --ignore .nd,.body,.classList,.library,.readyState,.status,.head,.s3-website-us-east-1,.amazonaws,.com,.edu,.href,.title,.b,.alerts,.alert-section,.alert-container,.alert-description,.informational,.informational-yellow,.warning
  # upload to aws
  aws s3 sync ./template s3://${BUCKET}/frame --exclude '*' --include '*.js' --acl public-read
  aws s3 sync ./template/css_opt s3://${BUCKET}/frame/css --acl public-read
  aws s3 sync ./template/html_opt s3://${BUCKET}/frame/html --acl public-read
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
