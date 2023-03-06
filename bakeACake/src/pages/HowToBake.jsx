import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowToBake = () => {
  return (
    <section>
    <Navbar />
    <div className='lg:h-[80vh]'>
      <div className='p-10 lg:grid lg:grid-cols-3'>
        <div className='col-span-3 text-center mb-20'>
          <span className='text-4xl font-Lobster underline-offset-10 underline'>How to bake</span>
        </div>
        <div className='card bg-base-100 shadow-xl mx-3 my-2'>
          <div className='card-body'>
            <h2 className='card-title font-Satisfy text-2xl'>Step - 1</h2> <br />
            <p className='font-Merriweather'>Register at our platform. Ensure you fill out the correct details in order to receive a cake.</p>
          </div>
        </div>
        <div className='card bg-base-100 shadow-xl mx-3 my-2'>
          <div className='card-body'>
            <h2 className='card-title font-Satisfy text-2xl'>Step - 2</h2> <br />
            <p className='font-Merriweather'>Log in and head to questions section of the website. Solve the questions there to climb the leaderboard.</p>
          </div>
        </div>
        <div className='card bg-base-100 shadow-xl mx-3 my-2'>
          <div className='card-body'>
            <h2 className='card-title font-Satisfy text-2xl'>Step - 3</h2> <br />
            <p className='font-Merriweather'>Keep an eye out for hints on GDSC JIIT instagram page. After accomplishment of the event, top 3 in the leaderboard are entitled to a cake.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </section>
  )
}

export default HowToBake