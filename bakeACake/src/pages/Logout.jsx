import React, { useLayoutEffect } from 'react'
import Cookies from 'js-cookie';

const Logout = () => {
    useLayoutEffect(() => {
      Cookies.remove('enrollment');
      Cookies.remove('email');
      Cookies.remove('name');
      Cookies.remove('loggedIn');
      Cookies.remove('sessionToken');
      window.location.href = '/login';
    }, [])
  return (
    <div>Logout</div>
  )
}

export default Logout