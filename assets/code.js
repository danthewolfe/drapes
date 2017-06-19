/* Call the documentReady() function to use this code */
const documentReady = (links) => {
  replaceHeader(links)
  replaceFooter()
}

/* Generic function to replace content */
const replaceContent = (target, content, links) => {

  // Get the replacement content with an xhr request
  var xhr= new XMLHttpRequest();
  xhr.open('GET', content, true);
  xhr.onreadystatechange= function() {
    // Return if not ready or not good status
    if (this.readyState!==4) return;
    if (this.status!==200) return;

    // Try to replace target if it exists
    try {
      let newContent = this.responseText

      // Check if there are any additional links to include and insert them
      if(links) {
        let additionalLinks = links.map((link) => {
          return `<a href=${link.href}>${link.title}</a>`
        })

        newContent = newContent.replace('<span id=\'additional-links\'/>', additionalLinks.join(''))
      }

      // Do the actual replacement of target with content
      document.getElementById(target).outerHTML = newContent;
    } catch (e) {
      console.log(`Could not replace "${target}" because it does not exist.`)
    }
  };
  xhr.send();
}

/* Replace <a id='replace-header' /> with content from template */
const replaceHeader = (links) => {
  replaceContent('replace-header', 'http://localhost:3001/assets/header.html', links)
}

/* Replace <a id='replace-footer' /> with content from template */
const replaceFooter = () => {
  replaceContent('replace-footer', 'http://localhost:3001/assets/footer.html')
}
