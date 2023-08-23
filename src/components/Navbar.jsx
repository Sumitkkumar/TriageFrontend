import React from 'react'
import logo from './images/ACN_BIG.svg'
import * as colors from './colors'

const Navbar = () => {
  return (
    <nav>
        <div className="nav--wrapper">
          <img src={logo} alt="Accenture Logo"  className='accenture--logo'/>
          <h1>Triage System</h1>
          <h1 style={{color: colors.neutral50}}>Nav Links</h1>
        </div>
    </nav>
        
  )
}

export default Navbar