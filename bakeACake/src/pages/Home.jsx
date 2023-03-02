import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg1 from '../img/bg1.png'
const Home = () => {
  return (
    <section>
      <Navbar />
      <div className='lg:grid lg:grid-cols-2'>
        <div className='hidden lg:block lg:p-[10%]'>
          <img src={bg1} alt='bg1' className='h-[70vh] rounded-lg' />
        </div>
        <div className='p-[10%]'>
          <div className='py-5'>
            <span className='text-7xl font-bold font-Satisfy text-black'> - Bake A Cake -</span>
          </div>
          <div className='py-5'>
            <span className='text-2xl font-semibold font-Rajdhani'>
              Welcome to the digital bakery. <br /> Find all ingredients to bake your delicious cake!
            </span>
          </div>
          <div className='mt-10 pb-2 text-center'>
            <span className='text-4xl font-bold font-Satisfy text-black'>Available recipes</span>
          </div>
          <div className='py-5 grid grid-cols-1 md:flex md:justify-center'>
            <div className='bg-red-600 text-white mx-auto p-5 text-center rounded-lg hover:bg-red-200 my-2'>
              <div className='py-2'>
                <span className='text-3xl font-semibold font-Lobster'>Red velvet</span>
              </div>
              <div className='py-2'>
                <span className='text-2xl font-bold font-Lobster'>Rs. 2500/-</span>
              </div>
            </div>

            <div className='bg-stone-700 text-white mx-auto p-5 text-center rounded-lg hover:bg-stone-200 my-2'>
              <div className='py-2'>
                <span className='text-3xl font-semibold font-Lobster'>Chocolate Truffle</span>
              </div>
              <div className='py-2'>
                <span className='text-2xl font-bold font-Lobster'>Rs. 1500/-</span>
              </div>
            </div>

            <div className='bg-amber-500 text-white mx-auto p-5 text-center rounded-lg hover:bg-amber-100 my-2'>
              <div className='py-2'>
                <span className='text-3xl font-semibold font-Lobster'>Butterscotch</span>
              </div>
              <div className='py-2'>
                <span className='text-2xl font-bold font-Lobster'>Rs. 1000/-</span>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
      </section>
  )
}

export default Home