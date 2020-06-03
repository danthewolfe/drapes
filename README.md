# drapes
Hesburgh utility to wrap various webpages with a defined template

## Basic Example
```
<html>
<head>
  <title>FAKE PAGE TITLE</title>
  <!-- include files -->
  <script src='https://resources.library.nd.edu/frame/code.js' type='text/javascript'></script>
  <script>
    document.addEventListener("DOMContentLoaded", function(event) {
      documentReady();
    });
  </script>
  <!-- end -->
</head>
<body>
  <div>FAKE PAGE CONTENT</div>
</body>
</html>

```

## Example with extra links
```
  <!-- include files -->
  <script src='http://https://resources.library.nd.edu/frame/code.js' type='text/javascript'></script>
  <script>
    document.addEventListener("DOMContentLoaded", function(event) {
      const links = [
        { title: 'Google', href: 'http://google.com'},
        { title: 'AOL', href:'http://aol.com' }
      ]
      documentReady(links);
    });
  </script>
  <!-- end -->
```

# Notes

 * To test locally, run:

  `node server.js`

 * To generate files and upload to AWS:

  `./mangle-and-deploy.sh`
  
 * Requires and includes [html-muncher](https://github.com/ccampbell/html-muncher) with the following modifications listed in [Issue 6](https://github.com/ccampbell/html-muncher/issues/6).
 * HTML Muncher is licensed under [Apache2 license](https://www.apache.org/licenses/LICENSE-2.0).

# Dependent sites
This is a list of known sites that currently use drapes for producing it's header/footer:
- http://onesearch.library.nd.edu/
- https://factotum.library.nd.edu/
- https://nd.illiad.oclc.org/illiad/IND/illiad.dll
- https://medieval-microfilms-and-facsimiles.library.nd.edu/
