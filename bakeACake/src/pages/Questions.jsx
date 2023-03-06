import React, { useLayoutEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Questions = () => {
  const [qNo, setQNo] = useState(0);
  const [points, setPoints] = useState(0);
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState('NA');
  const [answer, setAnswer] = useState('');
  const [enroll, setEnroll] = useState(0);
  const [disable, setDisable] = useState(false);

  const submitAnswer = async (e) => {
    e.preventDefault();
    try
    {
      const response = await axios.post('http://127.0.0.1:4000/matchAnswer', {
        access_token: import.meta.env.VITE_ACCESS_TOKEN,
        qNo: qNo,
        answer: `${answer}`.toLowerCase()
      });
      const result = await response.data;
      if(result.verified == true)
      {
        toast.success('Correct answer');
        const response2 = await axios.post('http://127.0.0.1:4000/updateLeaderboard',{
          access_token: import.meta.env.VITE_ACCESS_TOKEN,
          qNo: qNo,
          enrollment: enroll
        });
        const result2 = await response2.data;
        if(result2.success)
        {
          toast.success('Updated leaderboard');
          setTimeout(() => {
            window.location.href = '/leaderboard';
          }, 1000);
        }
      }
      else if (result.verified == false)
      {
        toast.error('Wrong answer!');
      }
      else
      {
        console.log(result.error);
        toast.error('Access Denied');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
    catch(err)
    {
      console.log(err);
      toast.error('Wrong answer');
      window.location.reload();
    }
  }

  useLayoutEffect(() => {
    (async ()=>{
      if(Cookies.get('loggedIn') == "true")
      {
        const enrollment = Cookies.get('enrollment');
        setEnroll(parseInt(enrollment));
        try
        {
          const response = await axios.post('http://127.0.0.1:4000/fetchUserProgress', {
            access_token: import.meta.env.VITE_ACCESS_TOKEN,
            enrollment: enrollment
          });
          var progress = await response.data;
          if(progress.error)
          {
            console.log(progress.error);      
          }
          else
          {
            setQNo(parseInt(progress.qNo)+1);
            setPoints(parseInt(progress.points));
            try{
              const response2 = await axios.post('http://127.0.0.1:4000/returnQuestion', {
                access_token: import.meta.env.VITE_ACCESS_TOKEN,
                qNo: `${parseInt(progress.qNo)+1}`
              });
              const question = await response2.data;
              if(question.error)
              {
                console.log(error);
                toast.error('Question does not exist!');
                setTimeout(() => {
                  window.location.href = '/logout';
                }, 1000);
              }
              else
              {
                setQuestion(question.question);
                setFile(question.file);
              }
            }
            catch(err)
            {
              console.log(err);
              toast.error('Question has not been uploaded yet!');
              setDisable(true);
            }
          }
        }
        catch(err)
        {
          console.log(err);
              toast.error('Something went wrong');
              setTimeout(() => {
                window.location.href = '/logout';
              }, 1000);
        }
      }
      else
      {
        window.location.href = "/logout";
      }
    })();
  }, []);

  return (
    <section>
    <Navbar />
    <div className='py-10 lg:grid lg:grid-cols-3'>
        <div className=''>
          <div className='px-5'>
            <span className='text-3xl font-Satisfy font-bold'>Current points - {points}</span>
          </div>
          <div className='flex justify-center'>
            <span className='font-TiltPrism text-[22em]'>
              {qNo}
            </span>
          </div>
        </div>
        <div className='px-5 py-10 col-span-2'>
          <span className='text-4xl font-bold font-Satisfy'>Question - </span> <br />
          <br />
          <p className='pl-5 text-xl font-bold font-Rajdhani'>{question}</p>
          <br />
          {file != 'NA' && (
            <>
            <span className='text-4xl font-bold font-Satisfy'>File - </span> <br />
            <br />
            <p className='pl-5 text-xl font-bold font-Rajdhani'>{file}</p> 
            </>
          )}

          <div className='my-5 font-Rajdhani text-xl'>
            <span className='text-4xl font-bold font-Satisfy'>Answer here - </span>
            <form className='my-5 pl-5' onSubmit={submitAnswer}>
              <div className='form-control lg:w-[30vw]'>
                <input type="text" name="answer" className='input input-bordered' placeholder='Enter your answer' onChange={(e) => setAnswer(e.target.value)}/>
              </div>
              <div className='form-control lg:w-[10vw] py-5'>
                <button className='btn btn-danger' type='submit' disabled={disable}>Submit</button>
              </div>
            </form>
          </div>
        </div>
    </div>
    <Footer />
  </section>
  )
}

export default Questions