import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';

const Profile = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState(0);

  useEffect(() => {
    if(Cookies.get('loggedIn')=='true' && Cookies.get('sessionToken') != '')
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
      <div className="card bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="https://picsum.photos/300/200" alt="Avatar" className="rounded-xl" />
        </figure>
        <div className="card-body lg:text-center lg:items-center">
          <h2 className="card-title font-bold text-3xl font-Satisfy">{name}</h2>
          <table className='text-left font-Merriweather mt-5'>
            <tbody>
            <tr>
              <td className='font-bold'>Enrollment</td>
              <td className='pl-5'>{enrollment}</td>
            </tr>
            <tr>
              <td className='font-bold'>Email Address</td>
              <td className='pl-5'>{email}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer />
  </section>
  )
}

export default Profile