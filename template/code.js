// Call the documentReady() function to use this code
function documentReady (links) {
  var headerTemplate = 'https://resources.library.nd.edu/frame/header.html'
  var footerTemplate = 'https://resources.library.nd.edu/frame/footer.html'
  var headTemplate = 'https://resources.library.nd.edu/frame/head.html'

  var wrappedClass = 'hesburgh-wrapped'
  // Check to see if the body has not been wrapped yet. If it has, do nothing.
  if(!document.body.classList.contains(wrappedClass)) {
    addHeader(headerTemplate, links)
    addFooter(footerTemplate)
    updateHead(headTemplate)

    // Add a class to denote we wrapped the content
    document.body.classList.add(wrappedClass)
  }
}

// Format a link object and return html
function displayLink(link) {
  return '<div class="menu-link"><a href=' + link.href + '>' + link.title + '</a></div>'
}

// add the tempalte haeder to the page
function addHeader (headerTemplate, links) {
  var ADDITIONAL_LINKS = '{{{ADDITIONAL_LINKS}}}'

  // Get the replacement template with an xhr request
  var xhr= new XMLHttpRequest()
  xhr.open('GET', headerTemplate, true);
  xhr.onreadystatechange= function() {
    // Return if not ready or not good status
    if (this.readyState !==4 ) return
    if (this.status !==200 ) return

    try {
      let newContent = this.responseText

      // Check if there are any additional links to include and insert them
      let additionalLinks = []
      if(links) {
         additionalLinks = links.map(function(link) {
          return displayLink(link)
        })
      }
      newContent = newContent.replace('{{{ADDITIONAL_LINKS}}}', additionalLinks.join(''))
      document.body.insertAdjacentHTML('afterbegin', newContent)
    } catch (e) {
      console.log(e)
    }
  }
  xhr.send()
}

// add the template footer to the page
function addFooter (footerTemplate) {
  // Get the replacement template with an xhr request
  var xhr= new XMLHttpRequest()
  xhr.open('GET', footerTemplate, true);
  xhr.onreadystatechange= function() {
    // Return if not ready or not good status
    if (this.readyState !==4 ) return
    if (this.status !==200 ) return

    try {
      document.body.insertAdjacentHTML('beforeend', this.responseText)
    } catch (e) {
      console.log(e)
    }
  }
  xhr.send()
}

// add more css files to the <head> tag
function updateHead (headTemplate) {
  // Get the replacement template with an xhr request
  var xhr= new XMLHttpRequest()
  xhr.open('GET', headTemplate, true);
  xhr.onreadystatechange= function() {
    // Return if not ready or not good status
    if (this.readyState !==4 ) return
    if (this.status !==200 ) return

    try {
      document.head.insertAdjacentHTML('beforeend', this.responseText)
    } catch (e) {
      console.log(e)
    }
  }
  xhr.send()
}
