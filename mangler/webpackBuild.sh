pushd toBuild
  webpack --config webpack.config.js
  mkdir -p dist/images
  cp -r images/ dist/images/
popd

