import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import axios from "axios";

const Leaderboard = () => {
  const [lb, setLb] = useState([]);
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(10);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    (async () => {
      toast('It usually takes a few seconds to load the leaderboard');
      try
      {
        const response = await axios.post('http://localhost:4000/fetchLeaderboard', {
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
      setLimit(Object.keys(leaderboard).length);
      setLb(lbArr);
      }
      catch(err)
      {
        console.log(err);
        toast.error("Server error, please try again later");
      }
    })();
  }, []);

  return (
    <section>
      <Navbar />
      <div className="py-10 px-5 lg:px-36 lg:mh-[80vh] overflow-x-auto min-h-screen">
        <div className="my-5 w-100 grid grid-cols-3">
          <div className="flex justify-start">
            <button
              className="text-3xl font-bold font-TiltPrism"
              onClick={(e) => {
                e.preventDefault();
                setLower(lower - 10);
                setUpper(upper - 10);
              }}
              disabled={lower <= 0 ? true : false}
            >
              {"<"}
            </button>
          </div>
          <div className="flex justify-center">
            <span className="text-4xl font-Lobster">Leaderboards</span>
          </div>
          <div className="flex justify-end">
            <button
              className="text-3xl font-bold font-TiltPrism"
              onClick={(e) => {
                e.preventDefault();
                setLower(lower + 10);
                setUpper(upper + 10);
              }}
              disabled={upper <= limit ? false : true}
            >
              {">"}
            </button>
          </div>
        </div>
        <table className="table w-full">
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
            {lb.slice(lower, upper).map((item) => {
              return (
                <tr key={item[0]} className="hover">
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>{item[4]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </section>
  );
};

export default Leaderboard;
