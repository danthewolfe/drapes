import React, { Component } from 'react'
import config from '../configuration'
import fetch from 'isomorphic-fetch'
import BaseNav from './base'

export const MOBILE_MENU = 'MOBILE_MENU'

export class Navigation extends Component {
  constructor (props) {
    super(props)

    this.handleData = this.handleData.bind(this)
    this.handleError = this.handleError.bind(this)
    this.state = {
      dropDowns: [],
      pageClick: false,
      // todo: use this
      extraNav: this.props.links ? this.props.links.map((link, index) => {
        return <li className="menu-link" key={'extra_' + index}><a href={link.href} className='m'>{link.title}</a></li>
      }) : [],
      subtitles: this.props.titles ? this.props.titles.map((title, index) => {
        return <div key={'sub_' + index}><a href={title.href}>{title.title}</a></div>
      }) : [],
      menuId: null,
    }

    this.closeMenus = this.closeMenus.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.openMobile = this.openMobile.bind(this)

    document.querySelector('.hesburgh-wrapped').onclick = this.pageClick
  }

  pageClick (e) {
    this.setState({ pageClick: true })
  }

  closeMenus (e) {
    this.setState({ menuId: null, pageClick: false })
  }

  openMenu (id, e) {
    this.setState({ menuId: id, pageClick: false })
  }

  openMobile (e) {
    this.setState({ menuId: MOBILE_MENU, pageClick: false})
  }

  keyDown (e) {
    // key = esc
    if (e.keyCode === 27) {
      this.closeMenus(e)
    }
  }

  onDropClick (slug, e) {
    this.state.menuId == slug ? this.closeMenus(e) : this.openMenu(slug, e)
  }

  handleData (data) {
    let dropDowns = []

    data.fields.columns.forEach(menu => {
      let current = menu.fields
      dropDowns.push({
        title: current.title,
        landingPage: current.landingPage ? 'https://library.nd.edu/' + current.landingPage.fields.slug : null,
        menuId: current.slug,
        menuData: current.columns,
        onClick: this.onDropClick.bind(this, current.slug),
        keyDown: this.keyDown,
      })
    })

    this.setState({dropDowns: dropDowns})
  }

  handleError (data) {
    console.log(data)
  }

  componentWillMount () {
    const url = `${config.contentfulAPI}/entry?locale=en-US&slug=navigation%2froot&resolveLinks=false&preview=false`
    fetch(url)
      .then(response => response.ok ? response.json() : { errorStatus: response.status })
      .then(json => this.handleData(json))
      .catch(response => this.handleError(response))
  }

  render () {
    let menuId = this.state.pageClick ? null : this.state.menuId
    return (
      <div className='top'>
        <div>
          <header id='banner' title='Website Home'>
            <div className='container-fluid'>
              <a href='https://library.nd.edu' title='Hesburgh Library Home' className='hlhome'>Hesburgh <em>Libraries</em></a>
              <div className='subtitle'>
              {this.state.subtitles}
              </div>
            </div>
          </header>
        </div>
        <div className='nav-search'>
          <BaseNav
            dropDowns={this.state.dropDowns}
            menuId={menuId}
            extraNav={this.state.extraNav}
            handleMobileClick={menuId === MOBILE_MENU ? this.closeMenus : this.openMobile}
          />
        </div>
      </div>
    )
  }
}

export default Navigation