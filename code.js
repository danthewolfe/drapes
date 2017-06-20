// Call the documentReady() function to use this code
const documentReady = (links) => {
  replaceContent('https://resources.library.nd.edu/frame/frame.html', links)
}

// Generic function to replace content
const replaceContent = (template, links) => {
  const wrappedClass = 'hesburgh-wrapped'
  const TEMPLATE_CONTENT = '{{{CONTENT}}}'
  const ADDITIONAL_LINKS = '{{{ADDITIONAL_LINKS}}}'

  // Get the replacement template with an xhr request
  var xhr= new XMLHttpRequest()
  xhr.open('GET', template, true);
  xhr.onreadystatechange= function() {
    // Return if not ready or not good status
    if (this.readyState !==4 ) return
    if (this.status !==200 ) return

    // Check to see if the body has not been wrapped yet. If it has, do nothing.
    if(!document.body.classList.contains(wrappedClass)) {

      // Try to replace target if it exists */
      try {
        const template = this.responseText
        let newContent = template.replace('{{{CONTENT}}}', document.body.innerHTML)

        // Check if there are any additional links to include and insert them
        let additionalLinks = []
        if(links) {
           additionalLinks = links.map((link) => {
            return displayLink(link)
          })
        }
        newContent = newContent.replace('{{{ADDITIONAL_LINKS}}}', additionalLinks.join(''))

        // Do the actual replacement of target with content
        document.body.outerHTML = newContent
        // Add a class to denote we wrapped the content
        document.body.classList.add(wrappedClass)
      } catch (e) {
        console.log(`Could not replace "${target}" because it does not exist.`)
      }
    }
  }
  xhr.send()
}

// Format a link object and return html
const displayLink = (link)  => {
  return `<div class="menu-link"><a href=${link.href}>${link.title}</a></div>`
}
