#!/bin/bash
BUCKET=resources.library.nd.edu

function doStuff {
  # mangle html
  munch --css ./template --html ./template --ignore nd
  # upload to aws
  aws s3 sync ./template_opt s3://${BUCKET}/frame --exclude '.*' --exclude '*.md' --acl public-read --profile wseAdmin
  echo "\033[0;31mDeployed to ${BUCKET}.s3-website-us-east-1.amazonaws.com/frame."
}

function installStuff {
  pushd html-muncher
  python setup.py install
  popd
    echo "\033[0;31mMunch was not installed, so we installed it for you."
}

# check if munch is installed
if hash munch 2>/dev/null; then
  doStuff
else
  installStuff
  doStuff
fi
