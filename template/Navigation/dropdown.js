import React from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'
import MenuColumn from './MenuColumn'
import MenuList from './MenuColumn/MenuList'

const DropDown = (props) => {
  const columns = props.menuData.map(
    (column, index) => {
      return column.fields.sections.map(
        (section) => {
          return (
            <MenuColumn
              title={section.fields.title}
              key={index}
            >
              <MenuList items={section.fields.links} tabIndexable={props.open} />
            </MenuColumn>
          )
        }
      )
    })
  if (props.open) {
    return (
      <Menu
        title={props.title}
        landingPage={props.landingPage}
        menuData={props.menuData}
        id={props.id}
        >
        {columns}
      </Menu>
    )
  }
  return null
}

DropDown.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  landingPage: PropTypes.string,
  menuData: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
}

DropDown.defatultProps = {
  open: false,
}

export default DropDown
