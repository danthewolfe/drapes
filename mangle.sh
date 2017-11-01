#!/bin/bash

pushd mangler
  yarn
popd

echo -e "\n=== Copying template to temporary build directory"
cp -r template/ mangler/toBuild/
rm mangler/toBuild/style.css

pushd mangler/toBuild
  echo -e "\n=== Installing template dependencies"
  yarn
popd

pushd mangler
  echo -e "\n=== Mangling CSS classes and ids"
  node index.js
  echo -e "\n=== Compiling mangled template"
  yarn build
popd