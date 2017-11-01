import React from 'react'
import PropTypes from 'prop-types'

const MenuColumn = (props) => {
  return (
    <div className='col-md-offset-2 col-md-3'>
      <h4>{props.title}</h4>
      {props.children}
    </div>
  )
}

MenuColumn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  title: PropTypes.string,
}
export default MenuColumn
