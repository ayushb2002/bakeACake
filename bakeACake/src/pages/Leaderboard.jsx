import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const Leaderboard = () => {

  const [lb, setLb] = useState([]);

  useEffect(() => {
    (async () => {
      toast('It usually takes a few seconds to load the leaderboard');
      try
      {
        const response = await axios.post('https://bakeacake.onrender.com/fetchLeaderboard', {
        access_token: import.meta.env.VITE_ACCESS_TOKEN
      });
      const leaderboard = await response.data.data;
      var lbArr = [];
      for(var i=0;i<Object.keys(leaderboard).length;i++){
        var temp = [];
        var dt = new Date(leaderboard[i].lastAccepted);
        temp.push(i+1, leaderboard[i].user, leaderboard[i].points, leaderboard[i].lastAttempt, dt.toLocaleString("en-US", {timeZone: 'Asia/Kolkata'}));
        lbArr.push(temp);
      }

      setLb(lbArr);
      }
      catch(err)
      {
        console.log(err);
        toast.error('Server error, please try again later');
      }
    })();
  }, [])
  

  return (
    <section>
    <Navbar />
      <div className='py-10 px-5 lg:px-36 lg:h-[80vh] overflow-x-auto min-h-screen'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Points</th>
              <th>Questions Solved</th>
              <th>Last successful submission</th>
            </tr>
          </thead>
          <tbody>
            {lb.map((item) => {
              return (
                <tr key={item[0]} className='hover'>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>{item[4]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    <Footer />
  </section>
  )
}

export default Leaderboard