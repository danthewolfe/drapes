import React from 'react'
import PropTypes from 'prop-types'

const MenuListItem = (props) => {
  return (
    <li><a href={props.url}>{props.title}</a></li>
  )
}

MenuListItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}
export default MenuListItem
