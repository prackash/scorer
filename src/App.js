// import logo from './logo.svg';
// import './App.css';
import React, {useState} from "react"

export default function CricketScorer(){
  const[currentBall, setCurrentBall] = useState({
    runs:0,
      extra:false,
      extraType:"",
      wagonWheel:"",
      dismissal:false,
      dismissalType:"",
      shotType:"",
      batsman:"",
      bowler:"",
      over:"",
      lineandlength:"",
      ballType:"",
  });
  const [balls,setBalls]=useState([]);
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBatsman, setCurrentBatsman] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [currentLineAndLength, setCurrentLineAndLength] = useState("");
  const [currentBallType, setCurrentBallType] = useState("");
  const [currentShotType, setCurrentShotType] = useState("");

  const handleChange=(field,value)=>{
    setCurrentBall({...currentBall,[field]:value});
  };
  

  const nextBall=()=>{
    setBalls([...balls,{...currentBall,ballNumber:balls.length+1}]);
    setCurrentBall({
      runs:0,
      extra:false,
      extraType:"",
      wagonWheel:"",
      dismissal:false,
      dismissalType:"",
      shotType:"",
      batsman:"",
      bowler:"",
      over:"",
      lineandlength:"",
      ballType:"",
    });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 space-y-4">
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
            <label className="block text-sm font-medium">Batsman</label>
            <input
              type="text"
              value={currentBall.batsman}
              onChange={(e) => handleChange("batsman", e.target.value)}
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
            <label className="block text-sm font-medium">Line and Length</label>
            <input
              type="text"
              value={currentBall.lineLength}
              onChange={(e) => handleChange("lineLength", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
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
                <th className="border p-2">Ball</th>
                <th className="border p-2">Shot Type</th>
                <th className="border p-2">Batsman</th>
                <th className="border p-2">Bowler</th>
                <th className="border p-2">Line & Length</th>
                <th className="border p-2">Ball Landed</th>
                <th className="border p-2">Extras</th>
                <th className="border p-2">Dismissal</th>
              </tr>
            </thead>
            <tbody>
              {balls.map((ball, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{ball.ballNumber}</td>
                  <td className="border p-2">{ball.shotType}</td>
                  <td className="border p-2">{ball.batsman}</td>
                  <td className="border p-2">{ball.bowler}</td>
                  <td className="border p-2">{ball.lineLength}</td>
                  <td className="border p-2">{ball.wagonWheel}</td>
                  <td className="border p-2">{ball.extraType}</td>
                  <td className="border p-2">{ball.dismissalType}</td>
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
