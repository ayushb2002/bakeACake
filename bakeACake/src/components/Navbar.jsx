import React, { useLayoutEffect, useState } from 'react'
import Cookies from 'js-cookie';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useLayoutEffect(() => {
    if(Cookies.get('loggedIn')=='true')
    {
      setLoggedIn(true);
    }
    else
    {  
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="navbar bg-base-100">
    <div className="navbar-start">
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li><a href='/'>Home</a></li>
          <li><a href='/howToBake'>How to bake</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          {loggedIn && (
                <li><a href="/questions">Questions</a></li>
              )}
          <li tabIndex={0}>
            <a className="justify-between">
              Bake
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
            </a>
            <ul className="p-2">
              {!loggedIn && (
                <>
                  <li><a href='/login'>Login</a></li>
                  <li><a href='/register'>Register</a></li>
                </>
              )}
              {loggedIn && (
                <>
                  <li><a href='/profile'>Profile</a></li>
                  <li><a href='/logout'>Logout</a></li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </div>
      <a className="btn btn-ghost normal-case text-4xl font-TiltPrism" href='/'>Bake A Cake</a>
    </div>
    <div className="navbar-end hidden lg:flex">
      <ul className="menu menu-horizontal px-1 font-Rajdhani text-xl font-bold">
        <li><a href='/'>Home</a></li>
        <li><a href='/howToBake'>How to bake</a></li>
        <li><a href="/leaderboard">Leaderboard</a></li>
        {loggedIn && (
                <li><a href="/questions">Questions</a></li>
        )}
        <li tabIndex={0}>
          <a>
            Bake
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
          </a>
          <ul className="p-2 z-10">
          {!loggedIn && (
                <>
                  <li><a href='/login'>Login</a></li>
                  <li><a href='/register'>Register</a></li>
                </>
              )}
              {loggedIn && (
                <>
                  <li><a href='/profile'>Profile</a></li>
                  <li><a href='/logout'>Logout</a></li>
                </>
              )}
          </ul>
        </li>
      </ul>
    </div>
  </div>
  )
}

export default Navbar