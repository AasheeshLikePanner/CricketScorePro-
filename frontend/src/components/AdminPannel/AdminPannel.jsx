import { useEffect, useState } from "react";
import ScoreCard from "../ScoreCard/ScoreCard";
import { useLocation } from 'react-router-dom';
import axios from "axios";

export default function AdminPannel(){
    const location = useLocation();
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [lastWicket, setLastWicket] = useState({batsman: 'Batsman 3',mode: 'Caught',fielder: 'Fielder 1',bowler: 'Bowler 1',runsAtFall: 112,over: '14.3'});
    const fetchBatsmen = location.state?.batsmen;
    const fetchBowlers = location.state?.bowlers;
    const [batsmen, setBatsmen] = useState(fetchBatsmen);
    const [bowlers, setBowlers] = useState(fetchBowlers);
    const [extras, setExtras] = useState({ wide: 0, noBall: 0, bye: 0, legBye: 0 });
    const [teamRuns, setTeamRuns] = useState(0);
    const [index, setIndex] = useState(0);
    const [matchId, setmatchId] = useState("");

    useEffect(()=>{
        console.log('batsmen',batsmen);
        console.log("bowlers",bowlers);
        
        async function init(){
            console.log('functions runs');
            
            const createMatch = await axios.post("http://localhost:8000/match/create-match",{matchName:"Something", battingTeam: batsmen[0].teamName, bowlerTeam:bowlers[0].teamName})
            setmatchId(createMatch.data.data._id)
            console.log("createdMatch",createMatch);
            console.log(createMatch.data.data._id);
            console.log('End Point');
            
               
        }
        init()
    },[])


    const handleToggle = (buttonLabel) => {
      setSelectedButtons((prevSelected) =>
        prevSelected.includes(buttonLabel)
          ? prevSelected.filter((label) => label !== buttonLabel)
          : [...prevSelected, buttonLabel]
      );
    };
  
    const isSelected = (buttonLabel) => selectedButtons.includes(buttonLabel);
  
    
  
    const handleBall = async () => {
        const runs = selectedButtons.find((e) => Number.isInteger(parseInt(e))) || 0; // Default to 0 if runs is not found
        const runsValue = parseInt(runs) || 0; // Convert runs to number and default to 0
      
        const isWide = isSelected('Wide');
        const isNoBall = isSelected('No Ball');
        const isBye = isSelected('Bye');
        const isLegBye = isSelected('Leg Bye');
        const isOverthrow = isSelected('Overthrow');
      
        const wicketType = selectedButtons.find((e) => ['Caught Out', 'Bowled Out', 'Lbw', 'Hit Wicket', 'Run Out', 'Stumped'].includes(e));
        
        try {
          if (wicketType) {
            updateBatsmanBalls();
            updateBowlerStats('wickets', 1);
            setLastWicket({
              bowlerName: bowlers[index].name,
              wicketMode: wicketType,
              batsmanName: batsmen[0].name
            });
            await axios.post("http://localhost:8000/match/update-match", {
              matchId,
              ballNumber: bowlers[0].ball,
              batsman: batsmen[index].name,
              bowler: bowlers[0].name,
              runs: 0,
              ballType: "normal",
              isWicket: true
            });
            setIndex((i) => i + 1);
      
          } else if (isWide) {
            setExtras((prevExtras) => ({
              ...prevExtras,
              wide: (prevExtras.wide || 0) + 1
            }));
            setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue + 1);
            updateBowlerStats('wide', runsValue + 1);
            await axios.post("http://localhost:8000/match/update-match", {
              matchId,
              ballNumber: bowlers[0].ball,
              batsman: batsmen[index].name,
              bowler: bowlers[0].name,
              runs: 0,
              ballType: "Wide",
              isWicket: false,
              extras: { wide: 1 }
            });
      
          } else if (isNoBall) {
            updateBatsmanBalls();
            
            if (isBye) {
              setExtras((prevExtras) => ({
                ...prevExtras,
                noBall: (prevExtras.noBall || 0) + 1,
                bye: (prevExtras.bye || 0) + runsValue
              }));
              setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue + 1);
              updateBowlerStats('noball-bye', runsValue + 1);
              await axios.post("http://localhost:8000/match/update-match", {
                matchId,
                ballNumber: bowlers[0].ball,
                batsman: batsmen[index].name,
                bowler: bowlers[0].name,
                runs: 0,
                ballType: "normal",
                isWicket: false,
                extras: { noBall: 1, bye: runsValue }
              });
      
            } else if (isLegBye) {
              setExtras((prevExtras) => ({
                ...prevExtras,
                noBall: (prevExtras.noBall || 0) + 1,
                legBye: (prevExtras.legBye || 0) + runsValue
              }));
              setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue + 1);
              updateBowlerStats('noball-legbye', runsValue + 1);
              await axios.post("http://localhost:8000/match/update-match", {
                matchId,
                ballNumber: bowlers[0].ball,
                batsman: batsmen[index].name,
                bowler: bowlers[0].name,
                runs: runsValue + 1,
                ballType: "Leg Bye",
                isWicket: false,
                extras: { noBall: 1, legBye: runsValue }
              });
      
            } else {
              setExtras((prevExtras) => ({
                ...prevExtras,
                noBall: (prevExtras.noBall || 0) + 1
              }));
              setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue);
              updateBowlerStats('noball-runs', runsValue);
              await axios.post("http://localhost:8000/match/update-match", {
                matchId,
                ballNumber: bowlers[0].ball,
                batsman: batsmen[index].name,
                bowler: bowlers[0].name,
                runs: runsValue,
                ballType: "No Ball",
                isWicket: false,
                extras: { noBall: 1 }
              });
            }
      
          } else if ((isBye || isLegBye) && isOverthrow) {
            setExtras((prevExtras) => ({
              ...prevExtras,
              [isBye ? 'bye' : 'legBye']: (prevExtras[isBye ? 'bye' : 'legBye'] || 0) + runsValue
            }));
            setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue);
            updateBowlerStats('overthrow', runsValue);
            await axios.post("http://localhost:8000/match/update-match", {
              matchId,
              ballNumber: bowlers[0].ball,
              batsman: batsmen[index].name,
              bowler: bowlers[0].name,
              runs: runsValue,
              ballType: "Overthrow",
              isWicket: false,
              extras: { [isBye ? 'bye' : 'legBye']: runsValue }
            });
      
          } else if (isOverthrow) {
            updateBatsmanRuns(runsValue);
            setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue);
            updateBowlerStats('runs-ot', runsValue);
            await axios.post("http://localhost:8000/match/update-match", {
              matchId,
              ballNumber: bowlers[0].ball,
              batsman: batsmen[index].name,
              bowler: bowlers[0].name,
              runs: runsValue,
              ballType: "Overthrow",
              isWicket: false
            });
      
          } else {
            updateBatsmanRuns(runsValue);
            setTeamRuns((prevRuns) => (prevRuns || 0) + runsValue);
            updateBowlerStats('normal', runsValue);
            updateBatsmanBalls();
            await axios.post("http://localhost:8000/match/update-match", {
              matchId,
              ballNumber: bowlers[0].ball,
              batsman: batsmen[index].name,
              bowler: bowlers[0].name,
              runs: runsValue,
              ballType: "Normal",
              isWicket: false
            });
          }
      
        } catch (error) {
          console.error('Error updating match score:', error);
        }
      };
  
    const updateBatsmanBalls = () => {
      setBatsmen((prevBatsmen) => {
        const updated = prevBatsmen.map((batsman, i) =>
          index === i ? { ...batsman, balls: (batsman.balls || 0) + 1 } : batsman
        );
        return updated;
      });
    };
  
    const updateBatsmanRuns = (runs) => {
      setBatsmen((prevBatsmen) =>
        prevBatsmen.map((batsman, i) =>
          i === index ? { ...batsman, runs: (batsman.runs || 0) + runs } : batsman
        )
      );
    };
  
    const updateBowlerStats = (type, runs) => {
        setBowlers((prevBowlers) =>
          prevBowlers.map((bowler, index) =>
            index === 0
              ? {
                  ...bowler,
                  runs: (bowler.runs || 0) + runs,
                  noBalls: type.includes('noball') ? (bowler.noBalls || 0) + 1 : bowler.noBalls,
                  wides: type === 'wide' ? (bowler.wides || 0) + 1 : bowler.wides,
                  wickets: type === 'wickets' ? (bowler.wickets || 0) + 1 : bowler.wickets,
                  ball: (bowler.ball || 0) + 1,
                  overs: Math.floor((bowler.ball || 0) / 6),
                }
              : bowler
          )
        );
      };

    return(
        <div className="w-screen h-screen p-2 flex">
            <div className="w-4/6 h-full "> 
                <div className="w-full h-full p-2 rounded-md border-2">
                    <h1 className="font-bold">Extra:</h1>
                    <div className="w-full flex flex-col">
                        <div className="flex flex-row min-w-0 min-h-0">
                            <div className="flex flex-col ">
                                <button  onClick={() => handleToggle('Wide')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-green-700 h-16 text-white">{isSelected('Wide') ? '✓ Wide' : 'Wide'}</button>
                                <button  onClick={() => handleToggle('No Ball')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-yellow-700 h-16 text-white">{isSelected('No Ball') ? '✓ No Ball' : 'No Ball'}</button>
                                <button  onClick={() => handleToggle('Leg Bye')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-blue-800 h-14 text-white">{isSelected('Leg Bye') ? '✓ Leg Bye' : 'Leg Bye'}</button>
                            </div>
                            <div className="flex flex-col ">
                                <button onClick={() => handleToggle('0')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-red-700 h-24 text-white">{isSelected('0') ? '✓ 0' : '0'}</button>
                                <button onClick={() => handleToggle('1')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-blue-500 h-24 text-white">{isSelected('1') ? '✓ 1' : '1'}</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => handleToggle('2')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-pink-600 h-24 text-white">{isSelected('2') ? '✓ 2' : '2'}</button>
                                <button onClick={() => handleToggle('3')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-green-400 h-24 text-white">{isSelected('3') ? '✓ 3' : '3'}</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => handleToggle('Bye')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-purple-700 h-24 text-white">{isSelected('Bye') ? '✓ Bye' : 'Bye'}</button>
                                <button onClick={() => handleToggle('OverThrow')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-yellow-500 h-24 text-white">{isSelected('OverThrow') ? '✓ OverThrow' : 'OverThrow'}</button>
                            </div>
                        </div>
                        <div className="w-full flex flex-row">
                            <div className="flex flex-col">
                                <button onClick={() => handleToggle('Caught Out')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-pink-700 h-16 text-white">{isSelected('Caught Out') ? '✓ Caught Out' : 'Caught Out'}</button>
                                <button onClick={() => handleToggle('Bowled Out')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-red-700 h-16 text-white">{isSelected('Bowled Out') ? '✓ Bowled Out' : 'Bowled Out'}</button>
                                <button onClick={() => handleToggle('Lbw')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-blue-800 h-16 text-white">{isSelected('Lbw') ? '✓ Lbw' : 'Lbw'}</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => handleToggle('Hit Wicket')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-purple-700 h-16 text-white">{isSelected('Hit Wicket') ? '✓ Hit Wicket' : 'Hit Wicket'}</button>
                                <button onClick={() => handleToggle('Run Out')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-yellow-700 h-16 text-white">{isSelected('Run Out') ? '✓ Run Out' : 'Run Out'}</button>
                                <button onClick={() => handleToggle('Stumped')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-green-800 h-16 text-white">{isSelected('Stumped') ? '✓ Stumped' : 'Stumped'}</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => handleToggle('4')} className="m-1 rounded-md font-semibold hover:shadow-md w-60  bg-red-800 h-1/2 text-white">{isSelected('4') ? '✓ 4' : '4'}</button>
                                <button onClick={() => handleToggle('6')} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-yellow-400 h-24 text-white">{isSelected('6') ? '✓ 6' : '6'}</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={handleBall} className="m-1 rounded-md font-semibold hover:shadow-md w-60 bg-green-600 h-52 text-white">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-2/6 h-full p-2 bg-yellow-300 ">
                <ScoreCard teamRun={teamRuns} extra={extras} batsmen={batsmen} bowler={bowlers} lastWicket={lastWicket} />
            </div>
        </div>
    )
}