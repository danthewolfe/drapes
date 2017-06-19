const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = '127.0.0.1'
const port = 3001

http.createServer((request, response) => {
    console.log('request ', request.url)

    var filePath = '.' + request.url
    if (filePath == './')
        filePath = './index.html'

    var extname = String(path.extname(filePath)).toLowerCase()
    var contentType = 'text/html'
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    }

    contentType = mimeTypes[extname] || 'application/octet-stream'

    fs.readFile(filePath, function(error, content) {
        if (error) {
          console.log('error loading something', error, content)
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType })
          response.end(content, 'utf-8')
        }
    })

}).listen(port);
console.log(`Server running at http://${hostname}:${port}/`)
