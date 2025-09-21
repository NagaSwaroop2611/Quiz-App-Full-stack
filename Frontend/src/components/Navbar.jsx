import React from 'react'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">WSA Quiz App</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a>Register</a></li>
          <li>
            <button className='btn btn-accent'>
              {" "}
              <a>Get Started</a>
            </button>
          </li>
          
        </ul>
      </div>
    </div>
  )
}

export default Navbar
