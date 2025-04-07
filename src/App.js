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
  });

  const handleChange=(field,value)=>{
    setCurrentBall({...currentBall,[field]:value});
  };
  

  const startBall=()=>{
    console.log("Ball Started", currentBall);
    setCurrentBall({
      runs:0,
      extra:false,
      extraType:"",
      wagonWheel:"",
      dismissal:false,
      dismissalType:"",
    });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Cricket Scorer</h1>

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
          <label className="block text-sm font-medium">Extra</label>
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
          <label className="block text-sm font-medium">Dismissal</label>
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

        <button
          onClick={startBall}
          className="w-full bg-blue-600 text-white rounded py-2 mt-4 hover:bg-blue-700"
        >
          Start Ball
        </button>
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
