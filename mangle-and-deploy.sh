#!/bin/bash

./mangle.sh
./deploy.sh

echo "=== Cleaning up build dir"
rm -rf mangler/toBuild
