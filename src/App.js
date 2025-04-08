// import logo from './logo.svg';
// import './App.css';
import React, {useState} from "react"

export default function CricketScorer(){
  const [currentBall, setCurrentBall] = useState({
    runs: 0,
    extraType: "",
    wagonWheel: "",
    dismissalType: "",
    shotType: "",
    batsman: "",
    bowler: "",
    line: "",
    Length: "",
  });
  const [balls,setBalls]=useState([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [over,setOver]=useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [skipNextBallCount, setSkipNextBallCount] = useState(false);
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");

  const handleChange=(field,value)=>{
    setCurrentBall({...currentBall,[field]:value});
    if (field === "batsman") setStriker(value);
    if (field === "nonStriker") setNonStriker(value);
  };
  const endOfOver = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
    setBallCount(0);
    setCurrentBall(prev => ({ ...prev, bowler: "" }));
    setOver(prev => prev + 1);
  };
  

  const nextBall=()=>{
    let extraRuns=0;
    if(currentBall.extraType==="Wide" || currentBall.extraType==="No Ball"){
      extraRuns=1;
    }
    else if (currentBall.extraType ==="No Ball + Free Hit"){
      extraRuns=1;
      setSkipNextBallCount(true);
    }

    const isValidBall = !currentBall.extraType.includes("Wide") && !currentBall.extraType.includes("No Ball");
    const thisBallNumber = skipNextBallCount ? ballCount : ballCount + (isValidBall ? 1 : 0);
    if(!skipNextBallCount && isValidBall) setBallCount(thisBallNumber);
    if(skipNextBallCount) setSkipNextBallCount(false);
    const totalForBall = currentBall.runs + extraRuns;
    const updatedTotalRuns = totalRuns + totalForBall;
    setTotalRuns(updatedTotalRuns);

    setBalls(prevBalls => [
      {
        ...currentBall,
        ballNumber: thisBallNumber,
        runsThisBall: totalForBall,
        cumulativeRuns: updatedTotalRuns,
        cOver: over,
      },
      ...prevBalls,
    ]);

    if (isValidBall && ((thisBallNumber) % 6 === 0)) {
      endOfOver();
    }

    setCurrentBall(prev => ({
      ...prev,
      runs: 0,
      extraType: "",
      wagonWheel: "",
      dismissalType: "",
      shotType: "",
      line: "",
      Length: "",
    }));
    
  };
   return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Cricket Scorer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Runs</label>
            <input
              type="number"
              value={currentBall.runs}
              onChange={(e) => handleChange("runs", parseInt(e.target.value))}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Extras</label>
            <select
              value={currentBall.extraType}
              onChange={(e) => handleChange("extraType", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">No Extra</option>
              <option value="Wide">Wide</option>
              <option value="No Ball">No Ball</option>
              <option value="Bye">Bye</option>
              <option value="Leg Bye">Leg Bye</option>
              <option value="No Ball + Free Hit">No Ball + Free Hit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Ball Landing (Wagon Wheel Zone)</label>
            <select
              value={currentBall.wagonWheel}
              onChange={(e) => handleChange("wagonWheel", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select Zone</option>
              <option value="Cover">Cover</option>
              <option value="Midwicket">Midwicket</option>
              <option value="Straight">Straight</option>
              <option value="Fine Leg">Fine Leg</option>
              <option value="Third Man">Third Man</option>
              <option value="Point">Point</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Dismissal Type</label>
            <select
              value={currentBall.dismissalType}
              onChange={(e) => handleChange("dismissalType", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">No Dismissal</option>
              <option value="Bowled">Bowled</option>
              <option value="Caught">Caught</option>
              <option value="LBW">LBW</option>
              <option value="Run Out">Run Out</option>
              <option value="Stumped">Stumped</option>
              <option value="Hit Wicket">Hit Wicket</option>
              <option value="Obstructing the Field">Obstructing the Field</option>
              <option value="Handled the Ball">Handled the Ball</option>
              <option value="Timed Out">Timed Out</option>
              <option value="Retired Hurt">Retired Hurt</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Shot Type</label>
            <input
              type="text"
              value={currentBall.shotType}
              onChange={(e) => handleChange("shotType", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Batsman-OnStike</label>
            <input
              type="text"
              value={striker}
              onChange={(e) => handleChange("batsman", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Batsman-NonStike</label>
            <input
              type="text"
              value={nonStriker}
              onChange={(e) => setNonStriker(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bowler</label>
            <input
              type="text"
              value={currentBall.bowler}
              onChange={(e) => handleChange("bowler", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Line</label>
            <select
              value={currentBall.line}
              onChange={(e) => handleChange("line", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select line</option>
              <option value="LegSide">Legside</option>
              <option value="On-Line">On-Line</option>
              <option value="OffSide">Offside</option>
              <option value="Outside-OffSide">Outside-Offside</option>
              <option value="Wide-OffSide">Wide-Offside</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Length</label>
            <select
              value={currentBall.Length}
              onChange={(e) => handleChange("Length", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select Length</option>
              <option value="Full-Toss">Full-Toss</option>
              <option value="Yorker">Yorker</option>
              <option value="Full-Length">Full-Length</option>
              <option value="Back-of-Length">Back-of-Length</option>
              <option value="Bouncer">Bouncer</option>
            </select>
          </div>
        </div>
        

        <button
          onClick={nextBall}
          className="w-full bg-blue-600 text-white rounded py-2 mt-4 hover:bg-blue-700"
        >
          Next Ball
        </button>

        {balls.length > 0 && (
          <table className="w-full mt-6 border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Over</th>
                <th className="border p-2">Ball</th>
                <th className="border p-2">Shot Type</th>
                <th className="border p-2">Batsman</th>
                <th className="border p-2">Bowler</th>
                <th className="border p-2">Line</th>
                <th className="border p-2">Length</th>
                <th className="border p-2">Ball Landed</th>
                <th className="border p-2">Extras</th>
                <th className="border p-2">Dismissal</th>
                <th className="border p-2">Runs</th>
                <th className="border p-2">Total Runs</th>
              </tr>
            </thead>
            <tbody>
            {balls.map((ball, index) => (
                <tr key={index}>
                  <td className="border p-2">{balls.length - index}</td>
                  <td className="border p-2">{ball.cOver}</td>
                  <td className="border p-2">{ball.ballNumber}</td>
                  <td className="border p-2">{ball.shotType}</td>
                  <td className="border p-2">{ball.batsman}</td>
                  <td className="border p-2">{ball.bowler}</td>
                  <td className="border p-2">{ball.line}</td>
                  <td className="border p-2">{ball.Length}</td>
                  <td className="border p-2">{ball.wagonWheel}</td>
                  <td className="border p-2">{ball.extraType}</td>
                  <td className="border p-2">{ball.dismissalType}</td>
                  <td className="border p-2">{ball.runsThisBall}</td>
                  <td className="border p-2">{ball.cumulativeRuns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
