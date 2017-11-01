import React from 'react'
import PropTypes from 'prop-types'

const MenuImage = (props) => {

  return (
    <dt>
      <a href={props.url}>
        <img src={props.image} alt={props.title} />
      </a>
    </dt>
  )
}

MenuImage.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
}
export default MenuImage
