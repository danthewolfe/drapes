// Call the documentReady() function to use this code

import renderEl from './reactEntry'
import config from './configuration'

function documentReady (links, titles) {
  const site = config.baseUrl

  var wrappedClass = 'hesburgh-wrapped'
  // Check to see if the body has not been wrapped yet. If it has, do nothing.
  if(!document.body.classList.contains(wrappedClass)) {
    addHeader(site)
    addFooter(site)
    updateHead(site)

    // Add a class to denote we wrapped the content
    document.body.classList.add(wrappedClass)

    activateReact(links, titles, site)
  }
}

// add the tempalte haeder to the page
function addHeader (site) {
  const headerEl = '<div class="react-data" data-type="header" />'

  // Get the replacement template with an xhr request
  try {
    document.body.insertAdjacentHTML('afterbegin', headerEl)
  } catch (e) {
    console.log(e)
  }
}

// add the template footer to the page
function addFooter (site) {
  const headerEl = '<div class="react-data" data-type="footer" />'

  try {
    document.body.insertAdjacentHTML('beforeend', headerEl)
  } catch (e) {
    console.log(e)
  }
}

// add more css files to the <head> tag
function updateHead (site) {
  let headEl =
    `
    <meta charset="utf-8" /> \
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /> \
    <meta id='nd-version' content=${config.version} /> \
    `

  try {
    document.head.insertAdjacentHTML('beforeend', headEl)
  } catch (e) {
    console.log(e)
  }
}

function activateReact (links, titles, site) {
  document.querySelectorAll('.react-data').forEach((el) => renderEl(el, links, titles, site))
}

window.documentReady = documentReady
