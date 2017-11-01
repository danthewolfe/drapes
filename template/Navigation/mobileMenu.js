import React from 'react'
import PropTypes from 'prop-types'

const MobileMenu = (props) => {
  if (props.open) {
    return (
      <ul className='topnav' id='topNav'>
        <li><a href='https://library.nd.edu/research/'>Research</a></li>
        <li><a href='https://library.nd.edu/services/'>Services</a></li>
        <li><a href='https://library.nd.edu/libraries/'>Libraries &amp; Centers</a></li>
        <li><a href='https://library.nd.edu/about/'>About</a></li>
        <li><a href='https://library.nd.edu/hours'>Hours</a></li>
      </ul>
    )
  }
  return null
}

export default MobileMenu
