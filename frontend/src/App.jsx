import { useEffect, useState } from 'react'
import './App.css'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function App() {
  const {handleSubmit,  register} = useForm()
  const [players, setPlayers] = useState([{ id: 1 }]);
  const navigate = useNavigate();
  const [AllMatches, setAllMatches] = useState([]);

  useEffect(()=>{
    async function fetchingMatches(){
      const matches = await axios.post('http://localhost:8000/match/all-matches-details')
      setAllMatches(matches.data.data)
      console.log(matches.data.data);
      
    }
    fetchingMatches()
  },[])

  const addPlayer = () => {
    setPlayers([...players, { id: players.length + 1 }]);
  };

  const handleCreateMatch = async (data) => {
    const team1Batsmen = [];
    const team2Bowlers = [];

    Object.entries(data).forEach( async ([key, value]) => {
      
      if (key.includes("Team1-")) {
        
        team1Batsmen.push({teamName:data.teamName1,name:value, runs:0, balls:0});
      }
      else if (key.includes("Team2-")) {
   
        
        team2Bowlers.push({teamName:data.teamName2,name: value, overs: 0, runs: 0, maidens: 0, noBalls: 0, wides: 0, ball: 0});
      }
    });
    navigate('/adminpannel', { state: { batsmen: team1Batsmen, bowlers: team2Bowlers } });
  }

  const handleOldMatch = (e) => {
    console.log('Clicked');
    
    navigate('/userpannel', {state: {e}})
  }

  return (
    <div className='bg-white w-screen h-screen flex '>
      <div className='w-1/2 items-center flex-col flex p-5 justify-center h-full'>
      <div className='outline rounded-md w-1/2'>
  {AllMatches.map((e, i) => {
    return (
      <div className='w-full' key={i}>
        <button
          onClick={() => handleOldMatch(e)}  
          className='hover:bg-black hover:shadow-lg hover:text-white w-full border-b-2 p-5 mb-2 rounded-md'
        >
          {e.battingTeam} vs {e.bowlerTeam}
        </button>
      </div>
    );
  })}
</div>

      </div>
      <div className='flex flex-col justify-center items-center w-1/2 h-full border-l-2'>
          <div className='font-bold text-3xl mb-3 '>Start New Match</div>
          <form onSubmit={handleSubmit(handleCreateMatch)}>
            <div className=' hover:shadow-lg w-full flex flex-row items-center  p-4 outline rounded-xl'>
              <input {...register("teamName1", {required:true})} type="text" className='focus:shadow-lg mr-7 outline-2 outline-black outline p-2 rounded-md font-bold text-gray-600' placeholder='Team 1'/>
              <h1 className=' font-bold text-1xl text-gray-700'>VS</h1>
              <input {...register("teamName2", {required:true})} type="text" placeholder='Team 2' className='outline-black focus:shadow-lg ml-7 outline-2 outline p-2 rounded-md font-bold text-gray-600'/>
            </div>
            <div className='hover:shadow-lg mt-3 outline-gray-700 p-4 outline items-center flex justify-center flex-col rounded-xl'>
              <h1 className='font-semibold text-gray-700 text-2xl mb-6'>Team Player Name</h1>
            {players.map((player, index) => (
                  <div key={player.id} className="flex mb-4">
                    <input
                      {...register(`Team1-${player.id}`, { required: true })}
                      type="text"
                      className="outline-black focus:shadow-lg mr-12 outline-2 outline p-2 rounded-md font-semibold text-gray-600"
                      placeholder={`Team 1 - ${index + 1}`}
                    />
                    <input
                      {...register(`Team2-${player.id}`, { required: true })}
                      type="text"
                      className="outline-black focus:shadow-lg ml-12 outline-2 outline p-2 rounded-md font-semibold text-gray-600"
                      placeholder={`Team 2- ${index + 1}`}
                    />
                  </div>
                ))}
              <div className='items-center flex justify-center p-4'>
                <button onClick={addPlayer} className='outline p-2 rounded-lg hover:bg-black hover:font-bold hover:text-white hover:shadow-lg font-semibold '>Add Player</button>
              </div>
            </div>
            <button type='submit' className='mt-3 w-full h-12 outline p-2 rounded-lg hover:bg-black hover:font-bold hover:text-white hover:shadow-lg font-semibold '>Create match</button>
          </form>
      </div>
    </div>
  )
}

export default App
