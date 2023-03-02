import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';

const Profile = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState(0);

  useEffect(() => {
    if(Cookies.get('loggedIn')=='true')
    {
      setName(Cookies.get('name'));
      setEmail(Cookies.get('email'));
      setEnrollment(Cookies.get('enrollment'));
    }
    else
    {
      window.location.href = '/logout';
    }
  }, [])
  

  return (
    <section>
    <Navbar />
    <div className='p-10 flex justify-center lg:mb-28'>
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="https://picsum.photos/300/200" alt="Avatar" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{name}</h2>
          <p>Enrollment Number - {enrollment}</p>
          <p>Email Address - {email}</p>
        </div>
      </div>
    </div>
    <Footer />
  </section>
  )
}

export default Profile