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
