import React from 'react'
import ReactDOM from 'react-dom'
import Navigation from './Navigation'

import './style.css'

const renderNav = (props, el) => {
  return ReactDOM.render(
    <Navigation {...props} />,
    el
  )
}

const renderFooter = (props, el, site) => {
  return ReactDOM.render(
    <div className="top">
      <div id="footer-links">
        <div className="container-fluid">
          <div className="row bottom-xs">
            <div className="col-xs-7">
              <div className="box">
                <ul>
                  <li><a href="https://nd.service-now.com/nd_portal?id=sc_cat_item&sys_id=1198d67ddb4a7240de73f5161d961936&lib_list_problem=lib_list_web_content" target="_blank">Website Feedback</a></li>
                  <li><a href="http://library.nd.edu/library-policies" target="_blank">Library Policies</a></li>
                  <li><a href="http://librarygiving.nd.edu" target="_blank">Library Giving</a></li>
                  <li><a href="http://library.nd.edu/">Jobs</a></li>
                  <li><a href="https://wiki.nd.edu/display/libintranet/Home" target="_blank">Hesnet</a></li>
                  <li><a href="https://nd.service-now.com/nd_portal?id=sc_cat_item&sys_id=1198d67ddb4a7240de73f5161d961936" target="_blank">Report a Problem</a></li>
                </ul>
              </div>
            </div>
            <div className="col-xs-3 col-xs-offset-2">
              <div className="box right">
                <ul>
                  <li><a href="http://twitter.com/ndlibraries" target="_blank"><img src={site + "/images/twitter.png"} /> NDLibraries</a></li>
                  <li><a href="https://www.facebook.com/ndlibraries/" target="_blank"><img src={site + "/images/facebook.png"} /> NDLibraries</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer-info">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className="box">
                <p>Copyright &copy; 2017 University of Notre Dame</p>
                <p><a href="https://www.google.com/maps/place/Theodore+M.+Hesburgh+Library/@41.7023619,-86.2363832,17z/data=!3m1!4b1!4m5!3m4!1s0x8816d29f1af60a29:0x87f74f541c574744!8m2!3d41.7023579!4d-86.2341945">221 Hesburgh Library, Notre Dame, IN 46556</a> </p>
                <p><a href="tel:5746316679">(574) 631-6679</a></p>
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="box right">
                <img src={site + "/images/logo.png"} className="flogo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    el
  )
}

export default (el, links, titles, site) => {
  let props = {
    links,
    titles,
  }

  let type = el.dataset.type
  if (type === "header") {
    renderNav(props, el)
  } else if (type === "footer") {
    renderFooter(props, el, site)
  }
}
