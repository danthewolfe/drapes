import React from 'react'
import PropTypes from 'prop-types'

const Menu = (props) => {
  return (
    <div className='menu-drawer visible' aria-expanded="true" id={props.id} role='group'>
      <div className='container-fluid row'>
        {props.children}
      </div>
      <div className='container-fluid row'>
        <div className='col-md-offset-2 col-md-8'>
          {
            props.landingPage ? (
              <a href={props.landingPage} className='more'>More {props.title} </a>
            ) : null
          }
        </div>
      </div>
    </div>
  )
}

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]),
  title: PropTypes.string.isRequired,
  landingPage: PropTypes.string,
  id: PropTypes.string,
}

export default Menu
