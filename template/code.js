// Call the documentReady() function to use this code
if (typeof DRAPES_TEMPLATE_ROOT === 'undefined') {
  // This will be the default whenever it isn't overridden. Thus, live will use this, and dev will use local paths
  DRAPES_TEMPLATE_ROOT = 'https://resources.library.nd.edu/frame'
}

var headerTemplate = DRAPES_TEMPLATE_ROOT + '/html/header.html'
var footerTemplate = DRAPES_TEMPLATE_ROOT + '/html/footer.html'
var headTemplate = DRAPES_TEMPLATE_ROOT + '/html/head.html'
var contentfulDirectApi = (typeof DEV_ENV !== 'undefined' && DEV_ENV === true)
  ? 'https://ryz12uieaj.execute-api.us-east-1.amazonaws.com/dev'
  : 'https://406bc7ziyc.execute-api.us-east-1.amazonaws.com/prod'

function documentReady (links, titles, site) {

  var wrappedClass = 'hesburgh-wrapped'
  // Check to see if the body has not been wrapped yet. If it has, do nothing.
  if(!document.body.classList.contains(wrappedClass)) {
    addHeader(headerTemplate, links, titles, site)
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

function displayTitle(title) {
  return '<div><a href=' + title.href + '>' + title.title + '</a></div>'
}

function displayAlerts(alertsData) {
  alertsData.forEach((alert) => {
    // Matches markdown link pattern: [display text](link)
    // Display text is first capture group and link url is second capture group.
    const regex = /\[(.*?)\]\((.*?)\)/gm
    const html = alert.fields.description.replace(regex, '<a href="$2" target="_blank">$1</a>')
    alert.html = html

    // Create class name based on alert type (Ex: "Informational – Yellow" -> "informational-yellow")
    alert.class = alert.fields.type.toLowerCase().replace(/\s+[^a-zA-z]*\s*/g, '-')
  })
  var alertSort = (left, right) => {
    // Put "Warning" type at top, otherwise sort alphanumeric asc
    if (left.fields.type !== right.fields.type) {
      if (left.fields.type === 'Warning' || right.fields.type === 'Warning') {
        return left.fields.type === 'Warning' ? -1 : 1
      } else {
        return left.fields.type < right.fields.type ? -1 : 1
      }
    } else {
      // If type is the same, sort by start time
      return left.fields.startTime < right.fields.startTime
        ? -1
        : (left.fields.startTime > right.fields.startTime ? 1 : 0)
    }
  }
  alertsData.sort(alertSort)

  var alertCategorize = (alerts) => {
    var out = {}
    alerts.filter(a => a.fields && a.fields.type).forEach((alert) => {
      if (out[alert.fields.type]) {
        out[alert.fields.type].push(alert)
      } else {
        out[alert.fields.type] = [alert]
      }
    })
    return out
  }
  var alertCategories = alertCategorize(alertsData || [])
  var categoryArray = Object.keys(alertCategories).map(type => {
    var currentAlerts = alertCategories[type] || []
    var className = currentAlerts.length > 0 ? ` ${currentAlerts[0].class}` : ''
    return `
      <div class='alert-section${className}'>
        ${currentAlerts.map((alert) => `
          <div class='alert-container'>
            <div class='alert-description'>${alert.html || ''}</div>
          </div>
        `).join('')}
      </div>
    `
  })
  return categoryArray.length ? `<div class='alerts'>${categoryArray.join('')}</div>` : ''
}

// add the tempalte haeder to the page
function addHeader (headerTemplate, links, titles, site) {
  var ADDITIONAL_LINKS_VARIABLE = '{{{ADDITIONAL_LINKS}}}'
  var ADDITIONAL_TITLES_VARIABLE = '{{{ADDITIONAL_TITLES}}}'
  var ALERTS_VARIABLE = '{{{ALERTS}}}'

  return getAlerts(site).then((alertsData) => {
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
        newContent = newContent.replace(ADDITIONAL_LINKS_VARIABLE, additionalLinks.join(''))

        // Check if there are any additional titles to include and insert them
        let additionalTitles = []
        if(titles) {
           additionalTitles = titles.map(function(title) {
            return displayTitle(title)
          })
        }
        newContent = newContent.replace(ADDITIONAL_TITLES_VARIABLE, additionalTitles.join(''))

        newContent = newContent.replace(ALERTS_VARIABLE, displayAlerts(alertsData))

        newContent = newContent.replace(/\{\{\{DRAPES_TEMPLATE_ROOT\}\}\}/g, DRAPES_TEMPLATE_ROOT)
        document.body.insertAdjacentHTML('afterbegin', newContent)
      } catch (e) {
        console.log(e)
      }
    }
    xhr.send()
  })
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
      var modified = this.responseText.replace(/\{\{\{DRAPES_TEMPLATE_ROOT\}\}\}/g, DRAPES_TEMPLATE_ROOT)
      document.body.insertAdjacentHTML('beforeend', modified)
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
      var modified = this.responseText.replace(/\{\{\{DRAPES_TEMPLATE_ROOT\}\}\}/g, DRAPES_TEMPLATE_ROOT)
      document.head.insertAdjacentHTML('beforeend', modified)
    } catch (e) {
      console.log(e)
    }
  }
  xhr.send()
}

function getAlerts (site) {
  return new Promise((resolve, reject) => {
    // If no site specified, can't fetch alerts. Resolve instantly
    if (!site) {
      return resolve([])
    }

    var xhr = new XMLHttpRequest()

    var now = new Date().toISOString()
    var queryString = 'content_type=alert'
    queryString += '&fields.domain[in]=all,' + site
    queryString += '&fields.startTime[lte]=' + now
    queryString += '&fields.endTime[gte]=' + now
    var url = `${contentfulDirectApi}/livequery?query=${encodeURIComponent(queryString)}`

    xhr.open('GET', url, true)
    xhr.onload = function() {
      // Return if not ready or not good status
      if (this.status >= 200 && this.status < 300) {
        return resolve(JSON.parse(xhr.response))
      } else {
        console.error({ status: this.status, text: xhr.statusText })
        return resolve([]) // Technically this should be reject, but we don't want to hinder page load so we'll fail silently
      }
    }
    xhr.onerror = resolve
    xhr.send()
  })
}
