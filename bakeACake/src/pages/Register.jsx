import React, { useLayoutEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg2 from '../img/bg2.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Register = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState(0);
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(true);
  const [passphrase, setPassphrase] = useState('');

  useLayoutEffect(() => {
    if(Cookies.get('loggedIn')=='true')
    {
      window.location.href = '/profile';
    }
  }, []);

  const signUp = async (e) => {
    e.preventDefault();
    if(passphrase == import.meta.env.VITE_PASSPHRASE)
    {
      try
      {
        const response = await axios.post('https://bakeacake.onrender.com/register', {
          access_token: import.meta.env.VITE_ACCESS_TOKEN,
          email: email,
          name: `${fname} ${lname}`,
          enrollment: enrollment,
          password: password,
        });
        if (response.data.success) {
          toast.success('Registered successfully!');
          setTimeout(() => {
            window.location.href ='/login';
          }, 1000);
        } else {
          toast.error('Could not register. Kindly check your data and try again!');
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
    else
    {
      toast.error('Incorrect passphrase!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  return (
    <section>
      <Navbar />
      <div className='p-[5%] lg:grid lg:grid-cols-2'>
        <div className='p-5'>
          <span className='text-3xl font-bold font-Satisfy'>
            Sign Up to start baking
          </span>
          <div className='p-5'>
            <img src={bg2} alt="bg2" className='w-[35vw] rounded-lg hidden lg:block' />
          </div>
        </div>
        <div className='p-5 font-Merriweather flex justify-center lg:justify-end'>
          <form className='lg:border-2 lg:p-10 lg:w-[30vw] lg:rounded-lg' onSubmit={signUp}>
            <div className='form-control'>
              <label className='label' htmlFor="first_name">
                <span className='label-text font-bold'>First Name</span>
              </label>
              <input type="text" name='first_name' placeholder='Enter first name' className='input input-bordered' onChange={(e) => setFname(e.target.value)} required={true} />
            </div>
            <div className='form-control'>
              <label className='label' htmlFor="last_name">
                <span className='label-text font-bold'>Last Name</span>
              </label>
              <input type="text" name="last_name" placeholder='Enter last name' className='input input-bordered' onChange={(e) => setLname(e.target.value)} required={true} />
            </div>
            <div className='form-control'>
              <label className='label' htmlFor="enrollment">
                <span className='label-text font-bold'>Enrollment Number</span>
              </label>
              <input type="number" name="enrollment" placeholder='Enter college enrollment number' className='input input-bordered' onChange={(e) => setEnrollment(e.target.value)} required={true} />
            </div>
            <div className='form-control'>
              <label className='label' htmlFor="email">
                <span className='label-text font-bold'>Email Address</span>
              </label> 
              <input type="email" name="email" placeholder='Enter email address' className='input input-bordered' onChange={(e) => setEmail(e.target.value)} required={true} />
            </div>
            <div className='form-control'>
              <label className='label' htmlFor="password">
                <span className='label-text font-bold'>Password</span>
              </label>
              <input type="password" name="password" placeholder='Set a strong password for your profile' className='input input-bordered' onChange={(e) => setPassword(e.target.value)} required={true} />
            </div>
            <div className='form-control'>
              <label className='label' htmlFor="passPhrase">
                <span className='label-text font-bold'>Pass phrase (provided to JIIT students)</span>
              </label>
              <input type="text" name="passPhrase" placeholder='Ask GDSC coordinators for passphrase' className='input input-bordered' onChange={(e) => setPassphrase(e.target.value)} required={true} />
            </div>
            <div className="form-control mt-5 flex justify-center items-center">
              <HCaptcha
                sitekey={import.meta.env.VITE_SITE_KEY}
                onVerify={(token) => setDisable(false)}
              />
            </div>
            <div className='form-control mt-5'>
              <button type='submit' className='btn btn-neutral' disabled={disable}>Register</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default Register