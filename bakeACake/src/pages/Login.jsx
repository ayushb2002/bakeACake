import React, { useLayoutEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg3 from '../img/bg3.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(false);

  useLayoutEffect(() => {
    if(Cookies.get('loggedIn')=='true')
    {
      window.location.href = '/profile';
    }
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    toast('Verifying credentials...');
    setDisable(true);
    try
    {
      const response = await axios.post('http://localhost:4000/login', {
      access_token: import.meta.env.VITE_ACCESS_TOKEN,
      email: email,
      password: password
    });
    if(response.data.success)
    {
      Cookies.set('name', response.data.name);
      Cookies.set('email', email);
      Cookies.set('enrollment', response.data.enrollment);
      Cookies.set('loggedIn', 'true');
      Cookies.set('sessionToken', response.data.token);
      toast.success('Logged in successfully');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    }
    else
    {
      toast.error('Invalid credentials');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    }
    catch(err)
    {
      console.log(err);
      toast.error('Server error');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

  }

  return (
    <section>
      <Navbar />
      <div className='p-[5%] lg:grid lg:grid-cols-2'>
        <div className='p-5'>
          <span className='text-3xl font-bold font-Satisfy'>
            Sign In to continue baking
          </span>
          <div className='p-5'>
            <img src={bg3} alt="bg3" className='w-[35vw] rounded-lg hidden lg:block' />
          </div>
        </div>
        <div className='p-5 font-Merriweather flex justify-center lg:justify-end'>
          <form className='lg:border-2 lg:p-10 lg:w-[30vw] my-auto lg:rounded-lg' onSubmit={signIn}>
            <div className='form-control'>
              <label className='label' htmlFor="email">
                <span className='label-text font-bold'>Email Address</span>
              </label> 
              <input type="email" name="email" placeholder='Enter email address' className='input input-bordered' onChange={(e) => setEmail(e.target.value)} required={true}/>
            </div>
            <div className='form-control mb-5'>
              <label className='label' htmlFor="password">
                <span className='label-text font-bold'>Password</span>
              </label>
              <input type="password" name="password" placeholder='Enter password' className='input input-bordered' onChange={(e) => setPassword(e.target.value)} required={true} />
            </div>
            <div className="form-control mb-5 flex justify-center items-center">
              <HCaptcha
                sitekey={import.meta.env.VITE_SITE_KEY}
                onVerify={(token) => setDisable(false)}
              />
            </div>
            <div className='form-control mt-5'>
              <button type='submit' className='btn btn-neutral' disabled={disable}>Login</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default Login