import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg1 from '../img/bg1.png';

const Home = () => {
  return (
    <section>
      <Navbar />
      <div className='lg:grid lg:grid-cols-3'>
        <div className='hidden lg:block lg:p-[10%]'>
          <img src={bg1} alt='bg1' className='h-[50vh] rounded-lg' />
        </div>
        <div className='p-[10%] col-span-2'>
          <div className='py-5'>
            <span className='text-7xl font-bold font-Satisfy text-black'> - Bake A Cake -</span>
          </div>
          <div className='py-5'>
            <span className='text-2xl font-semibold font-Rajdhani'>
              Hello Chefs, <br />
              Welcome to the GDSC Bake-A-Cake Competition! <br /><br />

              In this unique and exciting event, we combine the fun of baking with the thrill of solving cryptic challenges. As participants, you'll have the opportunity to showcase your skills in cybersecurity while creating your very own delicious cake. <br /><br />

              The theme of the competition is Bake-A-Cake, where you'll be unlocking ingredients for your cake by solving a series of challenges. Each challenge will require you to use your expertise in different areas of computer science to obtain a key that unlocks the next ingredient for your cake. <br /><br />

              But this is not your ordinary cake baking contest. You'll need to keep your eyes peeled for hidden clues and solve complex puzzles that will put your knowledge and creativity to the test. With every challenge you solve, you'll move one step closer to unlocking all the ingredients for your cake and achieving the ultimate victory.
              <br /><br />
              So, grab your apron, preheat your oven, and get ready to bake your way to the top. The Bake-A-Cake Competition is about to begin, and we can't wait to see what you'll create! <br /><br />
              <a href="/howToBake" className='underline'>Click here</a> to know how to play
            </span>
          </div>
          <div className='mt-10 pb-2 text-center'>
            <span className='text-4xl font-bold font-Satisfy text-black'>Available recipes</span>
          </div>
          <div className='py-5 grid grid-cols-1 md:flex md:justify-center' onClick={(e) => {e.preventDefault(); window.location.href = '/register'}}>

              <div className='bg-red-600 text-white mx-auto p-5 text-center rounded-lg hover:bg-red-200 my-2'>
                <div className='py-2'>
                  <span className='text-3xl font-semibold font-Satisfy'>Red velvet</span>
                </div>
                <div className='py-2'>
                  <span className='text-2xl font-bold font-Satisfy'>Rs. 2500/-</span>
                </div>
              </div>

              <div className='bg-stone-700 text-white mx-auto p-5 text-center rounded-lg hover:bg-stone-200 my-2'>
                <div className='py-2'>
                  <span className='text-3xl font-semibold font-Satisfy'>Chocolate Truffle</span>
                </div>
                <div className='py-2'>
                  <span className='text-2xl font-bold font-Satisfy'>Rs. 1500/-</span>
                </div>
              </div>

              <div className='bg-amber-500 text-white mx-auto p-5 text-center rounded-lg hover:bg-amber-100 my-2'>
                <div className='py-2'>
                  <span className='text-3xl font-semibold font-Satisfy'>Butterscotch</span>
                </div>
                <div className='py-2'>
                  <span className='text-2xl font-bold font-Satisfy'>Rs. 1000/-</span>
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