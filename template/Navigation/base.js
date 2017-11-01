import React from 'react'
import DropDown from './dropdown'
import MobileMenu from './mobileMenu'

import { MOBILE_MENU } from './index'

const Menu = (props) => {
  const dropDowns = props.dropDowns.map((menu, index) => {
    return (
      <li className='menu-link' key={index}>
        <a
          id={menu.title.toLowerCase()}
          onClick={menu.onClick}
          onKeyDown={menu.keyDown}
          aria-label={menu.title}
          aria-haspopup='true'
          aria-owns={menu.id}
          aria-controls={menu.id}
          aria-expanded={props.menuId === menu.menuId}
          tabIndex='0'
          href='#'
        >{menu.title}</a>
        <DropDown
          title={menu.title}
          landingPage={menu.landingPage}
          open={props.menuId === menu.menuId}
          menuData={menu.menuData}
          id={menu.menuId}
        />
      </li>
    )
  })

  return (
    <div className='uNavigation'>
      <nav className='container-fluid' role='navigation' aria-label='Main Navigation'>
        <ul className='menu-list'>
          <li className='menu-link'>
            <a href='https://library.nd.edu'>Home</a>
          </li>
          {dropDowns}
          {props.extraNav}
          <li className='menu-link hours-m right'>
            <a href='https://library.nd.edu/hours' className='m'>Hours</a>
          </li>
        </ul>
        <div className='menu-icon'>
          <a onClick={props.handleMobileClick}>☰</a>
          <MobileMenu open={props.menuId === MOBILE_MENU} />
        </div>
      </nav>
    </div>
  )
}

export default Menu
