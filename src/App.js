
import React, {useState} from "react"
import wagonwheel from "./assets/wagonwheel.jpg"
import "./styles/CricketScorer.css"

export default function CricketScorer(){
  const [currentBall, setCurrentBall] = useState({
    runs: 0,
    extraType: "",
    nbat:"",
    wagonWheel: "",
    dismissalType: "",
    shotType: "",
    batsman: "",
    bowler: "",
    line: "",
    Length: "",
    switchStrikers: 0,
    ballType: "",
    ballSpeed:0,
    aroundTheWicket: "No",
    deadBall:"No",
    end:"",
  });
  const runOptions = [0,1,2,3,4,5,6];
  const extraOptions = ["","Wide","No Ball","Free Hit"];
  const noBat=["","Bye","Leg Bye"];
  const dismissalOptions = ["","Bowled","Caught","LBW","Run Out","Stumped","Hit Wicket","Obstructing the Field","Handled the Ball","Timed Out","Hit Ball Twice","Retired Hurt","Other"];
  const bowlerEndOptions = ["Pavillion","Far End"];
  const lineOptions = ["LegSide","Middle","OffSide","Outside-OffSide","Wide-OffSide"];
  const lengthOptions = ["Full-Toss","Yorker","Full-Length","Back-of-Length","Bouncer"];
  // const aroundTheWicketOptions = ["No","Yes"];
  // const deadBallOptions = ["No","Yes"];



  const [balls,setBalls]=useState([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [over,setOver]=useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [battingOrder, setBattingOrder] = useState([]);
  const [bowlingStats, setBowlingStats] = useState({});
  const wagonWheelZones = ["1stSlip","2ndSlip","3rdSlip","4thSlip","5thSlip",
    "BackwardPoint","BackwardShortLeg","BackwardSquareLeg",
    "Bowler","CowCorner","DeepBackwardPoint","DeepBackwardSquareLeg","DeepCover",
    "DeepCoverPoint","DeepExtraCover","DeepFineLeg","DeepForwardMidwicket",
    "DeepForwardSquareLeg","DeepMidOff","DeepMidOn","DeepPoint","ExtraCover",
    "FineLeg","FineThirdMan","FlySlip","ForwardPoint","ForwardSquareLeg","Gully",
    "LegGully","LegSlip","LongOn","LongStop","MidOff","MidOn","MidWicket",
    "ShortCover","ShortFineLeg","ShortLeg","ShortMidOff","ShortMidOn",
    "ShortMidWicket","ShortThirdMan","SillyMidOff","SillyMidOn","SillyPoint",
    "SquareFineLeg","SquareThirdMan","StraightFineLeg","StraightHit",
    "StraightLongOff","StraightLongOn","WideLongOff","WideLongOn","WK"
  ]

  const fielderZones =["Yet to be Placed",...wagonWheelZones,"Injured"]
  const [fielderAlignment, setFielderAlignment] = useState([]);
  const [newFielder, setNewFielder] = useState("");
  const [newFielderZone, setNewFielderZone] = useState("");
  const [fielderSnapshots, setFielderSnapshots] = useState([]);


  const shots = ["No Shot","Backfoot Defence","Cover Drive","Flick","Frontfoot Defence","Hook",
    "Innovative Shot","Late Cut","Left","Leg Glance","Off Drive","Ondrive",
    "Pull","Reverse Sweep","Scoop","Slog","Slog Sweep","Square Cut","Straight Drive",
    "Sweep"]

  const ballTypes = ["ArmBall","Bouncer","CarromBall","Doosra","FlickerBall",
    "Flipper","Googly","Inswinger","KnuckleBall","LegBreak","LegCutter",
    "OffBreak","OffCutter","OutSwinger","ReverseSwing","Slider","SlowerBall",
    "Teesra","TopSpinner","Yorker"]
  const handleChange=(field,value)=>{
    setCurrentBall(prev => ({
      ...prev,
      [field]: value
    }));
  if (field === "batsman") setStriker(value);
  if (field === "nonStriker") setNonStriker(value);
  if (field === "bowler") {
    setFielderAlignment(prev => {
      if(value.trim()==="") return prev;
      
      return prev.map(f => {
        if (f.name === value) {
          return { ...f, zone: "Bowler" }; // update zone if player already exists
        } else if (f.zone === "Bowler") {
          return { ...f, zone: "Yet to be Placed" }; // clear previous bowler's zone
        }
        return f;
      }).concat(
        // If player wasn't in the list at all, add them
        prev.some(f => f.name === value) ? [] : [{ name: value, zone: "Bowler" }]
      );
    });
  }
  };


    
  const switchStrikers=()=>{
    if(currentBall.switchStrikers===1){
      console.log("Switching Strikers");
      setStriker(prev => {
        setNonStriker(prev);
        return nonStriker;
      });
      handleChange("batsman", nonStriker);
    }
    
  };

  const updateFielder=()=>{
    if(!newFielder||!newFielderZone) return;
    const allowedDuplicates=[
      fielderZones[0],
      fielderZones[fielderZones.length - 1],
    ];
    setFielderAlignment(prev => {
      const updated = prev.map(f => {
        // Step 1: If someone else already has the desired zone (and it's not allowed to duplicate it),
        // move them to "Yet to place"
        if (
          f.zone === newFielderZone &&
          f.name !== newFielder &&
          !allowedDuplicates.includes(newFielderZone)
        ) {
          return { ...f, zone: fielderZones[0] }; // move to "Yet to place"
        }
  
        // Step 2: If this is the fielder we're updating, assign them the new zone
        if (f.name === newFielder) {
          return { ...f, zone: newFielderZone };
        }
  
        return f;
      });
  
      // Step 3: If the fielder doesn't exist, add them
      const exists = updated.some(f => f.name === newFielder);
      if (!exists) {
        updated.push({ name: newFielder, zone: newFielderZone });
      }
  
      return updated;
    });
  
    // Sync with bowler field if applicable
    if (newFielderZone === "Bowler") {
      handleChange("bowler", newFielder);
    }
  
    setNewFielder("");
    setNewFielderZone("");
};
  const endOfOver = () => {
    console.log("End of Over");
    setBallCount(0);
    // setCurrentBall(prev => ({ ...prev, bowler: "" }));
    setOver(prev => prev + 1);
    handleChange("bowler", "");
    setFielderAlignment(prev => 
      prev.map(fielder => 
        fielder.zone === "Bowler" ? { ...fielder, zone: fielderZones[0] } : fielder
      )
    )
  };
  const downloadCSV = () => {
    const headers = [
      "Over",
      "Ball",
      "Shot Type",
      "Batsman",
      "Bowler",
      "Line",
      "Length",
      "Ball Type",
      "Ball Speed (km/h)",
      "Ball Landed",
      "Extras",
      "Dismissal",
      "Runs",
      "Total Runs"
    ];
  
    const rows = balls.map((ball,index) => [
      `"${ball.cOver}"`,
      `"${ball.ballNumber}"`,
      `"${ball.shotType}"`,
      `"${ball.batsman}"`,
      `"${ball.bowler}"`,
      `"${ball.line}"`,
      `"${ball.Length}"`,
      `"${ball.ballType}"`,
      `"${ball.ballSpeed}"`,
      `"${ball.wagonWheel}"`,
      `"${ball.extraType}"`,
      `"${ball.dismissalType}"`,
      `"${ball.runsThisBall}"`,
      `"${ball.cumulativeRuns}"`
    ]);
    
    
  
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cricket_score.csv");
    link.click();
  };

  const downloadFielderSnapshotCSV=()=>{
    if(fielderSnapshots.length === 0) return;

    const allFielderNames = new Set();
    fielderSnapshots.forEach(snapshot => {
      snapshot.fielderAlignment.forEach(fielder => {
        allFielderNames.add(fielder.name);
      });
    });
    const fielderNames = Array.from(allFielderNames);
    const headers = ["Over/Ball", ...fielderNames];

    const rows = fielderSnapshots.map(({over,ball, fielderAlignment}) => {
      const row = [`${over}/${ball}`];
      const fielderMap = Object.fromEntries(fielderAlignment.map(fielder => [fielder.name, fielder.zone]));
      fielderNames.forEach(name => {
        row.push(fielderMap[name] || "");
      });

      return row;
    });
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fielder_alignment.csv");
    link.click();
  }
  

  // NEED TO HANDLE LOGIC FOR BATTING STATS AND BOWLING STATS REMOVAL AND REVERTING END OF OVER
  const deletePrev = () => {
    if (balls.length === 0) return;
  
    const [latestBall, ...remainingBalls] = balls;
    // 1. Revert bowling stats
setBowlingStats(prevStats => {
  const bowler = latestBall.bowler;
  if (!bowler || !prevStats[bowler]) return prevStats;

  const isWideOrNoBall = latestBall.extraType.includes("Wide") || latestBall.extraType.includes("No Ball")|| latestBall.extraType.includes("Free Hit");
  const isValidBall = !isWideOrNoBall;
  const extras = latestBall.extraType ? 1 : 0;
  const runs = latestBall.runsThisBall;
  const isWicket = latestBall.dismissalType !== "";

  const current = prevStats[bowler];

  return {
    ...prevStats,
    [bowler]: {
      balls: Math.max(0, current.balls - (isValidBall ? 1 : 0)),
      runs: Math.max(0, current.runs - runs),
      wickets: Math.max(0, current.wickets - (isWicket ? 1 : 0)),
      extras: Math.max(0, current.extras - extras),
    },
  };
});

// 3. Revert batting stats
// 3. Revert batting stats
setBattingOrder(prevOrder => {
  const batter = latestBall.batsman;
  if (!batter) return prevOrder;

  const isLegit = !latestBall.extraType.includes("Wide") &&
                  !latestBall.extraType.includes("No Ball") &&
                  !latestBall.extraType.includes("Free Hit") &&
                  !latestBall.nbat.includes("Bye") &&
                  !latestBall.nbat.includes("Leg Bye");

  if (!isLegit) return prevOrder;

  const runs = latestBall.runs;
  const isFour = runs === 4;
  const isSix = runs === 6;

  return prevOrder.map(player => {
    if (player.name !== batter) return player;

    return {
      ...player,
      runs: Math.max(0, player.runs - runs),
      balls: Math.max(0, player.balls - 1),
      fours: Math.max(0, player.fours - (isFour ? 1 : 0)),
      sixes: Math.max(0, player.sixes - (isSix ? 1 : 0)),
    };
  });
});





  
    // Adjust ball/over count
    const isValidBall = !latestBall.extraType.includes("Wide") && !latestBall.extraType.includes("No Ball");
    if (isValidBall) {
      setBallCount(prev => (prev > 0 ? prev - 1 : 0));
    }
  
    // Recalculate total runs
    setBalls(remainingBalls);
  setTotalRuns(prev => prev - latestBall.runsThisBall);
  };

  const nextBall=()=>{
    let extraRuns=0;
    if(currentBall.extraType==="Wide" || currentBall.extraType==="No Ball"){
      extraRuns=1;
    }
    
    if(currentBall.runs%2===1){
      currentBall.switchStrikers+=1;
    }

    const isValidBall = !(
      currentBall.extraType.includes("Wide") ||
      currentBall.extraType.includes("No Ball") ||
      currentBall.extraType.includes("Free Hit")
    );
    const thisBallNumber = ballCount + (isValidBall ? 1 : 0);
    if(isValidBall) setBallCount(thisBallNumber);
    
    const totalForBall = currentBall.runs + extraRuns;
    const updatedTotalRuns = totalRuns + totalForBall;
    setTotalRuns(updatedTotalRuns);

    setBowlingStats(prevStats => {
      const bowler = currentBall.bowler;
      if(!bowler) return prevStats;
      const isWideOrNoBall = currentBall.extraType.includes("Wide") || currentBall.extraType.includes("No Ball")|| currentBall.extraType.includes("Free Hit");
      const isValidBall = !isWideOrNoBall;
      const extras = currentBall.extraType ? 1 : 0;
      const runs = currentBall.runs + extras;
      const isWicket = currentBall.dismissalType !== "";

      const exisiting = prevStats[bowler]|| {balls:0,runs:0,wickets:0,extras:0};
      return {
        ...prevStats,
        [bowler]: {
          balls: exisiting.balls + (isValidBall ? 1 : 0),
          runs: exisiting.runs + runs,
          wickets: exisiting.wickets + (isWicket ? 1 : 0),
          extras: exisiting.extras + extras,
        },
      };
    });

    setBattingOrder(prevOrder => {
    const exists = prevOrder.find(player => player.name === striker);
    if(!exists){
      return [...prevOrder, { name: striker, runs: 0, fours: 0, sixes: 0, balls: 0 }];
    }
    return prevOrder
    });

    const dismissalTypesToReset = ["LBW", "Bowled", "Caught", "Stumped"];
    if(dismissalTypesToReset.includes(currentBall.dismissalType)){
      setStriker("");
    }
  
  const isLegit = !currentBall.extraType.includes("Wide") && !currentBall.extraType.includes("No Ball") && !currentBall.extraType.includes("Free Hit") && !currentBall.nbat.includes("Bye") && !currentBall.nbat.includes("Leg Bye");
  const isFreeHit = currentBall.extraType === "Free Hit";
  const isByeOrLegBye = currentBall.nbat === "Bye" || currentBall.nbat === "Leg Bye";
if ((isLegit || isFreeHit) && !isByeOrLegBye) {
    setBattingOrder(prevOrder => {
      const runs = currentBall.runs;
      const name = striker;
      return prevOrder.map(player=> {
        if(player.name!==name) 
          {return player};
        
          const isFour = runs === 4;
          const isSix = runs === 6;
          return{
            ...player,
            runs: player.runs + runs,
            balls: player.balls + (isLegit?1:0),
            fours: player.fours + (isFour ? 1 : 0),
            sixes: player.sixes + (isSix ? 1 : 0),
          };
      });
    });
    
  }

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
      currentBall.switchStrikers += 1;
      endOfOver();
    }
    switchStrikers();

    setCurrentBall(prev => ({
      ...prev,
      runs: 0,
      extraType: "",
      nbat:"",
      wagonWheel: "",
      dismissalType: "",
      shotType: "",
      line: "",
      Length: "",
      switchStrikers: 0,
      ballType: "",
      ballSpeed: 0,
      deadBall:"No",

    }));
    setFielderSnapshots(prev => [
      ...prev,
      {
        over: over,
        ball: thisBallNumber,
        fielderAlignment: [...fielderAlignment]
      }  
    ]
    );
  };
  
   return (
    <div className="layout">
      <div className="side-section">
      <div className="batting-order">
        <div className="batting-table">
          <h2 className="heading">Batting Stats</h2>
          {/* <div className="input-group">
            <input
              type="text"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              placeholder="Add Batsman"
              className="input-field"
            />
            <button onClick={addBatsman} className="add-button">Add</button>
          </div> */}
          <table className="battable">
            <thead className="batthead">
              <tr>
                <th className="batthead">Batsman</th>
                <th className="batthead">Runs</th>
                <th className="batthead">Fours</th>
                <th className="batthead">Sixes</th>
                <th className="batthead">Balls</th>
                <th className="batthead">Strike Rate</th>
              </tr>  
            </thead>
            <tbody>
              {battingOrder.map((player, index) => {
                const strikeRate = 
                  player.balls > 0? ((player.runs/player.balls)*100).toFixed(2) : 0;
                  return(
                    <tr key={index}>
                      <td className="battbody">{player.name}</td>
                      <td className="battbody">{player.runs}</td>
                      <td className="battbody">{player.fours}</td>
                      <td className="battbody">{player.sixes}</td>
                      <td className="battbody">{player.balls}</td>
                      <td className="battbody">{strikeRate}</td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="Bowling">
        <h2 className="heading">Bowling Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Bowler</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wickets</th>
              <th>Extras</th>
              <th>Economy</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(bowlingStats).map(([bowler, stats]) => ( 
             <tr key={bowler}>
              <td>{bowler}</td>
              <td>{Math.floor(stats.balls/6)}.{stats.balls%6}</td>
              <td>{stats.runs}</td>
              <td>{stats.wickets}</td>
              <td>{stats.extras}</td>
              <td>{(stats.runs / (stats.balls / 6)).toFixed(2)}</td>
            </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      </div>
      <div className="scorer-container">
        <p> Wind Speed || Wind Direction</p>
      <div className="scorer-card">
        <h1 className="heading">Cricket Scorer</h1>
        <div className="form-grid">
        <div className="input-grid">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Runs<br /></label>
            <div className="button-group">
              {runOptions.map((run) => (
                <button
                  key={run}
                  className={`toggle-button ${currentBall.runs === run ? 'active' : ''}`}
                  onClick={() => handleChange("runs", run)}
                  type="button"
                >
                  {run}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Extras<br /></label>
            <div className="button-group">
              {extraOptions.map((extra) => (
                <button
                  key={extra}
                  className={`toggle-button ${currentBall.extraType === extra ? 'active' : ''}`}
                  onClick={() => handleChange("extraType", extra)}
                  type="button"
                >
                  {extra}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">No Bat Contact<br /></label>
            <div className="button-group">
              {noBat.map((NB) => (
                <button
                  key={NB}
                  className={`toggle-button ${currentBall.nbat === NB ? 'active' : ''}`}
                  onClick={() => handleChange("nbat", NB)}
                  type="button"
                >
                  {NB}
                </button>
              ))}
            </div>
          </div>
          

          <div className="col-span-2">
            <label className="block text-sm font-medium">Wagon Wheel Zone<br/></label>
            <select
              value={currentBall.wagonWheel}
              onChange={(e) => handleChange("wagonWheel", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select Zone</option>
              {wagonWheelZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Dismissal Type<br /></label>
            <div className="button-group">
              {dismissalOptions.map((dis) => (
                <button
                  key={dis}
                  className={`toggle-button ${currentBall.dismissalType === dis ? 'active' : ''}`}
                  onClick={() => handleChange("dismissalType", dis)}
                  type="button"
                >
                  {dis}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Batsman-OnStike<br/></label>
            <input
              type="text"
              value={striker}
              onChange={(e) => handleChange("batsman", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          

          <div>
            <label className="block text-sm font-medium">Batsman-NonStike<br/></label>
            <input
              type="text"
              value={nonStriker}
              onChange={(e) => setNonStriker(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          
          <div className="col-span-2">
            <label className="block text-sm font-medium">Line<br /></label>
            <div className="button-group">
              {lineOptions.map((line) => (
                <button
                  key={line}
                  className={`toggle-button ${currentBall.line === line ? 'active' : ''}`}
                  onClick={() => handleChange("line", line)}
                  type="button"
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Length<br /></label>
            <div className="button-group">
              {lengthOptions.map((length) => (
                <button
                  key={length}
                  className={`toggle-button ${currentBall.Length === length ? 'active' : ''}`}
                  onClick={() => handleChange("Length", length)}
                  type="button"
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="col-span-2">
            <label className="block text-sm font-medium">Shot Type<br /></label>
            <div className="button-group">
              {shots.map((shot) => (
                <button
                  key={shot}
                  className={`toggle-button ${currentBall.shotType === shot ? 'active' : ''}`}
                  onClick={() => handleChange("shotType", shot)}
                  type="button"
                >
                  {shot}
                </button>
              ))}
            </div>
          </div> */}

          
          <div>
            <label className="block text-sm font-medium">Shot Type<br/></label>
            <select
              value={currentBall.shotType}
              onChange={(e) => handleChange("shotType", e.target.value)}
              className="w-full border rounded p-2 mt-1"
              >
              <option value="">Select Shot</option>
              {shots.map((shot) => (
                <option key={shot} value={shot}>
                  {shot}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="col-span-2">
            <label className="block text-sm font-medium">Ball Type<br /></label>
            <div className="button-group">
              {ballTypes.map((balt) => (
                <button
                  key={balt}
                  className={`toggle-button ${currentBall.ballType === balt ? 'active' : ''}`}
                  onClick={() => handleChange("ballType", balt)}
                  type="button"
                >
                  {balt}
                </button>
              ))}
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium">Ball Type<br/></label>
            <select
              value={currentBall.ballType}
              onChange={(e) => handleChange("ballType", e.target.value)}
              className="w-full border rounded p-2 mt-1"
              >
              <option value="">Select Shot</option>
              {ballTypes.map((balt) => (
                <option key={balt} value={balt}>
                  {balt}
                </option>
              ))}
            </select>
          </div>
          

          <div>
            <label className="block text-sm font-medium">Bowler End<br /></label>
            <div className="button-group">
              {bowlerEndOptions.map((be) => (
                <button
                  key={be}
                  className={`toggle-button ${currentBall.end === be ? 'active' : ''}`}
                  onClick={() => handleChange("end", be)}
                  type="button"
                >
                  {be}
                </button>
              ))}
            </div>
          </div>


          

            

          <div>
            <label className="block text-sm font-medium">Ball Speed (km/h)<br/></label>
            <input
              type="text"
              value={currentBall.ballSpeed}
              onChange={(e) => handleChange("ballSpeed", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          

            <div>
                <label className="block text-sm font-medium">Around the Wicket<br/></label>
                <select
                  value={currentBall.aroundTheWicket}
                  onChange={(e) => handleChange("aroundTheWicket", e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Dead Ball<br/></label>
              <select
                value={currentBall.deadBall}
                onChange={(e) => handleChange("deadBall", e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                
              </select>
            </div>


        </div>
        <div className="image-wrapper">
          <img
            src={wagonwheel}
            alt="Wagon Wheel"
            className="max-w-full h-auto rounded-lg shadow"
          ></img>
        </div>
        </div>
        

        <button
          onClick={nextBall}
          className="submit-button"
        >
          Next Ball
        </button>
        <button className="delete-button" onClick={deletePrev}>
          Delete Prev
        </button> 

        <button onClick={downloadCSV} className="download-button">
          Download CSV
        </button>

        {balls.length > 0 && (
          <table className="table">
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
                <th className="border p-2">Ball Type</th>
                <th className="border p-2">Ball Speed (km/h)</th>
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
                  <td className="border p-2">{ball.ballType}</td>
                  <td className="border p-2">{ball.ballSpeed}</td>
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
      <div className="fielder-stats">
      <div className="fielder-alignment">
        <h2 className="heading">Fielder Alignment</h2>
        <div className="input-group">
          <input
            type="text"
            value={newFielder}
            onChange={(e) => setNewFielder(e.target.value)}
            placeholder="Fielder Name"
            className="input-field"
          />
          <select
            value={newFielderZone}
            onChange={(e) => setNewFielderZone(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="">Select Zone</option>
            {fielderZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <button onClick={updateFielder} className="add-button">Set</button>
        </div>
        <table className="fielder-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fielder</th>
              <th>Zone</th>
            </tr>
          </thead>
          <tbody>
            {fielderAlignment.map((fielder, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fielder.name}</td>
                <td>
                  <select
                    value={fielder.zone}
                    onChange={(e) => {setNewFielder(fielder.name);
                      setNewFielderZone(e.target.value);
                      updateFielder();}}
                    className="w-full p-1 border rounded"
                  >
                    {fielderZones.map((zone, i) => (
                      <option key={i} value={zone}>{zone}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={downloadFielderSnapshotCSV}
          className="download-button"
        >
          Download Fielder Alignment CSV
        </button>

      </div>
      <div>
        <p>Misfielding and expectional fielding section</p>
      </div>
      </div>
    </div>
  );
}

