
import React, {useEffect, useState} from "react"
import wagonwheel from "./assets/wagonwheel.jpg"
import "./styles/CricketScorer.css"
import * as XLSX from "xlsx";
import imageMapResize from "image-map-resizer";
export default function CricketScorer(){
  const [currentBall, setCurrentBall] = useState({
    runs: 0,
    extraType: "None",
    nbat:"Valid Contact", 
    wagonWheel: "",
    dismissalType: "None",
    shotType: "No Shot",
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
  const [currentTossWonBy, setCurrentTossWonBy] = useState('');
  const [currentTossDecision, setCurrentTossDecision] = useState('');
  const [refresh,setRefresh]=useState(false);
  const [showMatchInfo, setShowMatchInfo] = useState(true);


  const toggleMatchInfo=() => {
    setShowMatchInfo(!showMatchInfo);
  };

  const getTeamNames=()=>{
    const teamA = document.getElementById('teamA')?.value||"Team A";
    const teamB = document.getElementById('teamB')?.value||"Team B";
    return [teamA, teamB];
  };
  useEffect(() => {
    imageMapResize();
  },[]);

  const [teamA, teamB] = getTeamNames();

  const tossDecisionOptions = ['Bat', 'Bowl'];

  const extraOptions = ["None","Wide","No Ball","Free Hit"];
  const noBat=["Valid Contact","Bye","Leg Bye"];
  const dismissalOptions = ["None","Bowled","Caught","LBW","Run Out","Stumped","Hit Wicket","Obstructing the Field","Handled the Ball","Timed Out","Hit Ball Twice","Retired Hurt","Other"];
  const bowlerEndOptions = ["Pavillion","Far End"];
  const lineOptions = ["LegSide","Middle","OffSide","Outside-OffSide","Wide-OffSide"];
  const lengthOptions = ["Full-Toss","Yorker","Full-Length","Back-of-Length","Bouncer"];
  // const aroundTheWicketOptions = ["No","Yes"];
  // const deadBallOptions = ["No","Yes"];


  const [exceptionalFielding, setExceptionalFielding] = useState("");
  const [misfielding, setMisfielding] = useState("");
  const [fieldingNotes, setFieldingNotes] = useState([]);

  
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
  
    const aroundTheWicketOptions = ["No","Yes"];
    const deadBallOptions = ["No","Yes"];
  
    
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
  
  const handleTossWonByChange = (team) => {
    setCurrentTossWonBy(team);
  };

  // Handle Toss Decision Button Click
  const handleTossDecisionChange = (decision) => {
    setCurrentTossDecision(decision);
  };

  const handleInputChange = () => {
    setRefresh(prev => !prev);};


  const handleWagonWheelClick = (zone) => {
    zone.preventDefault();
    const selectedZone = zone.target.getAttribute("data-value")?.trim();
    if(selectedZone){
      handleChange("wagonWheel", selectedZone);
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
      "Bowler End",
      "Around the Wicket",
      "Ball Type",
      "Ball Speed (km/h)",
      "Ball Landed",
      "Extras",
      "No Bat Contact",
      "Dead Ball",
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
      `"${ball.end}"`,
      `"${ball.aroundTheWicket}"`,
      `"${ball.ballType}"`,
      `"${ball.ballSpeed}"`,
      `"${ball.wagonWheel}"`,
      `"${ball.extraType}"`,
      `"${ball.nbat}"`,
      `"${ball.deadBall}"`,
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
  const downloadFieldingNotesCSV = () => {
    if (fieldingNotes.length === 0) return;
  
    const headers = ["Over", "Ball", "Exceptional", "Misfielding"];
    const rows = fieldingNotes.map(note => [
      `${note.over}`,
      `${note.ball}`,
      `"${note.exceptional || ""}"`,
      `"${note.misfielding || ""}"`
    ]);
  
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fielding_notes.csv");
    link.click();
  };


  const downloadBattingStats = () => {
    const headers = ['Batsman', 'Runs', 'Fours', 'Sixes', 'Balls', 'Strike Rate'];
    const rows = battingOrder.map(player => {
      const strikeRate = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(2) : 0;
      return [
        player.name,
        player.runs,
        player.fours,
        player.sixes,
        player.balls,
        strikeRate
      ];
    });
  
    // Convert rows to CSV
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'batting_stats.csv';
    link.click();
  };
  

  
  // Function to download bowling stats as CSV
  const downloadBowlingStats = () => {
    const headers = ['Bowler', 'Overs', 'Runs', 'Wickets', 'Extras', 'Economy'];
    const rows = Object.entries(bowlingStats).map(([bowler, stats]) => {
      const overs = Math.floor(stats.balls / 6) + '.' + (stats.balls % 6);
      const economy = (stats.runs / (stats.balls / 6)).toFixed(2);
      return [
        bowler,
        overs,
        stats.runs,
        stats.wickets,
        stats.extras,
        economy
      ];
    });
  
    // Convert rows to CSV
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bowling_stats.csv';
    link.click();
  };


  const downloadFullReport = () => {
    const venue = document.getElementById('venue').value;
    const teamA = document.getElementById('teamA').value;
    const teamB = document.getElementById('teamB').value;
    const tossWonBy = currentTossWonBy;
    const tossDecision = currentTossDecision;
    const umpire1 = document.getElementById('umpire1').value;
    const umpire2 = document.getElementById('umpire2').value;
    const scorer1 = document.getElementById('scorer1').value;
    const scorer2 = document.getElementById('scorer2').value;
    const windSpeed = document.getElementById('windSpeed').value || 'N/A'; // Default to 'N/A' if empty
    const windDirection = document.getElementById('windDirection').value || 'N/A'; // Default to 'N/A' if empty
  
  // --- Match Information Sheet ---
  const mainInfoData = [
    {
      'Date': new Date().toLocaleDateString(),
      'Venue': venue,
      'Team A': teamA,
      'Team B': teamB,
      'Toss Won By': tossWonBy,
      'Toss Decision': tossDecision,
      'Umpire 1': umpire1,
      'Umpire 2': umpire2,
      'Scorer 1': scorer1,
      'Scorer 2': scorer2,
      'Wind Speed': windSpeed,
      'Wind Direction': windDirection
    }
  ];
    // --- Batting Sheet ---
    const battingHeaders = ['Batsman', 'Runs', 'Fours', 'Sixes', 'Balls', 'Strike Rate'];
    const battingData = battingOrder.map(player => {
      const strikeRate = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(2) : 0;
      return {
        Batsman: player.name,
        Runs: player.runs,
        Fours: player.fours,
        Sixes: player.sixes,
        Balls: player.balls,
        'Strike Rate': strikeRate
      };
    });
  
    // --- Bowling Sheet ---
    const bowlingData = Object.entries(bowlingStats).map(([bowler, stats]) => {
      const overs = Math.floor(stats.balls / 6) + '.' + (stats.balls % 6);
      const economy = (stats.balls > 0 ? (stats.runs / (stats.balls / 6)).toFixed(2) : '0.00');
      return {
        Bowler: bowler,
        Overs: overs,
        Runs: stats.runs,
        Wickets: stats.wickets,
        Extras: stats.extras,
        Economy: economy
      };
    });
    // -- Fielding Notes Sheet --
    const fieldingNotesData = fieldingNotes.map(note => {
      return{
      Over: note.over,
      Ball: note.ball,
      Exceptional: note.exceptional || "",
      Misfielding: note.misfielding || ""
      };
    });

    //-- Fielder Alignment Sheet --
    const fielderAlignmentData = fielderSnapshots.map(snapshot => {
      const row = {
        Over: snapshot.over,
        Ball: snapshot.ball
      };
      snapshot.fielderAlignment.forEach(fielder => {
        row[fielder.name] = fielder.zone;
      });
      return row;
    });

    //-- Ball Data--
    const ballData = balls.map(ball => {
      return {
        Over: ball.cOver,
        Ball: ball.ballNumber,
        ShotType: ball.shotType,
        Batsman: ball.batsman,
        Bowler: ball.bowler,
        Line: ball.line,
        Length: ball.Length,
        BowlerEnd: ball.end,
        AroundTheWicket: ball.aroundTheWicket,
        BallType: ball.ballType,
        BallSpeed: ball.ballSpeed,
        BallLanded: ball.wagonWheel,
        Extras: ball.extraType,
        NoBatContact: ball.nbat,
        DeadBall: ball.deadBall,
        Dismissal: ball.dismissalType,
        Runs: ball.runsThisBall,
        TotalRuns: ball.cumulativeRuns
      };
    });
  
    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    
    const wsBatting = XLSX.utils.json_to_sheet(battingData, { header: battingHeaders });
    const wsBowling = XLSX.utils.json_to_sheet(bowlingData);
    const wsFieldingNotes = XLSX.utils.json_to_sheet(fieldingNotesData);
    const wsFielderAlignment = XLSX.utils.json_to_sheet(fielderAlignmentData);
    const wsBallData = XLSX.utils.json_to_sheet(ballData);
  
    
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mainInfoData), 'Match Information');
    XLSX.utils.book_append_sheet(wb, wsBatting, 'Batting Stats');
    XLSX.utils.book_append_sheet(wb, wsBowling, 'Bowling Stats');
    XLSX.utils.book_append_sheet(wb, wsFieldingNotes, 'Fielding Notes');
    XLSX.utils.book_append_sheet(wb, wsFielderAlignment, 'Fielder Alignment');
    XLSX.utils.book_append_sheet(wb, wsBallData, 'Ball Data');

  
    // Download
    XLSX.writeFile(wb, 'match_report.xlsx');
  };

  

 

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
    if (exceptionalFielding || misfielding) {
      setFieldingNotes(prev => [
        ...prev,
        {
          over: over,
          ball: ballCount + 1,
          exceptional: exceptionalFielding,
          misfielding: misfielding
        }
      ]);
      setExceptionalFielding("");
      setMisfielding("");
    }
    
  };
  
   return (
    <div className="layout">

      <div className="side-section">
      <div className="batting-order">
        <div className="batting-table">
          <h2 className="heading">Batting Stats</h2>
          <div className = "scrollable-table-container">
          <table  id="battingStatsTable" className="battable">
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
          <button className="download-button" onClick={downloadBattingStats}>
          Download Batting Stats
          </button>
        </div>
      </div>
      <div className="Bowling">
        <h2 className="heading">Bowling Stats</h2>
        <div className = "scrollable-table-container">
          <table  id="bowlingStatsTable" className="Bowling" >
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
        <button className="download-button" onClick={downloadBowlingStats}>
          Download Bowling Stats
        </button>
      </div>
      </div>
      <div className="scorer-container">


<div className = "match-info"  style={{ display: showMatchInfo ? 'block' : 'none' }}>      
<div className="wind-info">

        <div className="input-group">
          <label htmlFor="venue">Venue:</label>
          <input
            type="text"
            id="venue"
            placeholder="Enter Venue"
            className="input-field"
          />
        </div>

  <div className="input-group">
    <label for="windSpeed">Wind Speed</label>
    <input
      id="windSpeed"
      type="text"
      placeholder="e.g. 10 km/h"
      className="input-field"
    />
  </div>
  

  <div className="input-group">
    <label for="windDirection">Wind Direction (°)</label>
    <input
      id="windDirection"
      type="number"
      min="0"
      max="360"
      placeholder="0–360"
      className="input-field"
    />
  </div>
  
</div>
<div className="wind-info">

        <div className="input-group">
          <label htmlFor="teamA">Team A:</label>
          <input
            type="text"
            id="teamA"
            placeholder="Enter Team A"
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="teamB">Team B:</label>
          <input
            type="text"
            id="teamB"
            placeholder="Enter Team B"
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
      </div>
  <div className="wind-info">
  <div className="input-group">
          <label>Toss Won By:</label>
          <div className="button-group">
            {[teamA,teamB].map((team) => (
              <button
                key={team}
                className={`toggle-button ${currentTossWonBy === team ? 'active' : ''}`}
                onClick={() => handleTossWonByChange(team)}
                type="button"
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Toss Decision */}
        <div className="input-group">
          <label>Toss Decision:</label>
          <div className="button-group">
            {tossDecisionOptions.map((option) => (
              <button
                key={option}
                className={`toggle-button ${currentTossDecision === option ? 'active' : ''}`}
                onClick={() => handleTossDecisionChange(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
 
  </div>

    <div className="wind-info"> 

        <div className="input-group">
          <label htmlFor="umpire1">Umpire 1:</label>
          <input
            type="text"
            id="umpire1"
            placeholder="Enter Umpire 1"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="umpire2">Umpire 2:</label>
          <input
            type="text"
            id="umpire2"
            placeholder="Enter Umpire 2"
            className="input-field"
          />
        </div>
        

        <div className="input-group">
          <label htmlFor="scorer1">Scorer 1:</label>
          <input
            type="text"
            id="scorer1"
            placeholder="Enter Scorer 1"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="scorer2">Scorer 2:</label>
          <input
            type="text"
            id="scorer2"
            placeholder="Enter Scorer 2"
            className="input-field"
          />
        </div>
      </div>
      </div>
{/* Set button once active it should make all the wind info div invisible */}
{/* Innings 1 and Innings 2 toggle */}
      <div>
        <button className="toggle-button" onClick={toggleMatchInfo}>
          {showMatchInfo ? "Hide Match Info" : "Show Match Info"}
          </button>
      </div>

<button className="download-button" onClick={downloadFullReport}>
  Download Full Report
</button>

      <div className="scorer-card">
        <h1 className="heading">Cricket Scorer</h1>
        <div className="form-grid">
        <div className="input-grid">
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
            <label className="block text-sm font-medium">Around the Wicket<br /></label>
            <div className="button-group">
              {aroundTheWicketOptions.map((atw) => (
                <button
                  key={atw}
                  className={`toggle-button ${currentBall.aroundTheWicket === atw ? 'active' : ''}`}
                  onClick={() => handleChange("aroundTheWicket", atw)}
                  type="button"
                >
                  {atw}
                </button>
              ))}
            </div>
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

          <div className="col-span-2">
            <label className="block text-sm font-medium">Ball Type <br /></label>
            <div className="button-group">
              {ballTypes.map((ba) => (
                <button
                  key={ba}
                  className={`toggle-button ${currentBall.ballType === ba ? 'active' : ''}`}
                  onClick={() => handleChange("ballType", ba)}
                  type="button"
                >
                  {ba}
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
            <label className="block text-sm font-medium">Dead Ball<br /></label>
            <div className="button-group">
              {deadBallOptions.map((db) => (
                <button
                  key={db}
                  className={`toggle-button ${currentBall.deadBall === db ? 'active' : ''}`}
                  onClick={() => handleChange("deadBall", db)}
                  type="button"
                >
                  {db}
                </button>
              ))}
            </div>
          </div>


        </div>
        <div className="image-wrapper">
          <img
            src={wagonwheel}
            alt="Wagon Wheel"
            useMap="#image-map-wagon"
            className="max-w-full h-auto rounded-lg shadow"
          ></img>
          <map name="image-map-wagon">
          <area target="" alt="LongStop" title="LongStop" href="#" data-value="LongStop " id="wagon-LongStop " coords="203,10,223,26" shape="rect" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="FIneThirdMan" title="FIneThirdMan" href="#" data-value="FIneThirdMan " id="wagon-FIneThirdMan  " coords="139,27,160,45" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepThirdMan" title="DeepThirdMan" href="#" data-value="DeepThirdMan " id="wagon-DeepThirdMan " coords="98,44,113,59" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SquareThirdMan" title="SquareThirdMan" href="#" data-value="SquareThirdMan " id="wagon-SquareThirdMan " coords="72,87,89,114" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepBackwardPoint" title="DeepBackwardPoint" href="#" data-value="DeepBackwardPoint " id="wagon-DeepBackwardPoint " coords="25,138,36,160" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepPoint" title="DeepPoint" href="#" data-value="DeepPoint " id="wagon-DeepPoint " coords="13,189,25,203" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepCoverPoint" title="DeepCoverPoint" href="#" data-value="DeepCoverPoint " id="wagon-DeepCoverPoint " coords="10,237,23,252" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepCover" title="DeepCover" href="#" data-value="DeepCover " id="wagon-DeepCover " coords="19,299,37,315" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepExtraCover" title="DeepExtraCover" href="#" data-value="DeepExtraCover " id="wagon-DeepExtraCover " coords="40,349,63,371" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="WideLongOff" title="WideLongOff" href="#" data-value="WideLongOff " id="wagon-WideLongOff " coords="87,397,107,417" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="LongOff" title="LongOff" href="#" data-value="LongOff " id="wagon-LongOff " coords="127,418,145,441" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="StraightLongOff" title="StraightLongOff" href="#" data-value="StraightLongOff " id="wagon-StraightLongOff " coords="159,430,182,454" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="StraightHit" title="StraightHit" href="#" data-value="StraightHit " id="wagon-StraightHit " coords="204,439,223,458" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="StraightLongOn" title="StraightLongOn" href="#" data-value="StraightLongOn " id="wagon-StraightLongOn " coords="247,434,265,453" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="LongOn" title="LongOn" href="#" data-value="LongOn " id="wagon-LongOn " coords="282,418,307,440" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="WideLongOn" title="WideLongOn" href="#" data-value="WideLongOn " id="wagon-WideLongOn " coords="319,399,338,416" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepForwardMidwicket" title="DeepForwardMidwicket" href="#" data-value="DeepForwardMidwicket " id="wagon-DeepForwardMidwicket " coords="361,352,381,367" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="CowCorner" title="CowCorner" href="#" data-value="CowCorner " id="wagon-CowCorner " coords="377,322,394,340" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepMidwicket" title="DeepMidwicket" href="#" data-value="DeepMidwicket " id="wagon-DeepMidwicket " coords="391,290,405,307" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepForwardSquareLeg" title="DeepForwardSquareLeg" href="#" data-value="DeepForwardSquareLeg " id="wagon-DeepForwardSquareLeg " coords="397,233,418,254" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepSquareLeg" title="DeepSquareLeg" href="#" data-value="DeepSquareLeg " id="wagon-DeepSquareLeg " coords="394,189,417,214" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepBackwardSquareLeg" title="DeepBackwardSquareLeg" href="#" data-value="DeepBackwardSquareLeg " id="wagon-DeepBackwardSquareLeg " coords="383,146,408,166" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SquareFineLeg" title="SquareFineLeg" href="#" data-value="SquareFineLeg " id="wagon-SquareFineLeg " coords="354,109,373,123" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepFineLeg" title="DeepFineLeg" href="#" data-value="DeepFineLeg " id="wagon-DeepFineLeg " coords="318,48,336,71" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="LongLeg" title="LongLeg" href="#" data-value="LongLeg " id="wagon-LongLeg " coords="280,24,293,41" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="FineLeg" title="FineLeg" href="#" data-value="FineLeg " id="wagon-FineLeg " coords="305,71,317,91" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="StraightFineLeg" title="StraightFineLeg" href="#" data-value="StraightFineLeg " id="wagon-StraightFineLeg " coords="248,48,261,67" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ThirdMan" title="ThirdMan" href="#" data-value="ThirdMan " id="wagon-ThirdMan " coords="121,63,136,77" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortThirdMan" title="ShortThirdMan" href="#" data-value="ShortThirdMan " id="wagon-ShortThirdMan " coords="128,94,142,114" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="BackwardPoint" title="BackwardPoint" href="#" data-value="BackwardPoint " id="wagon-BackwardPoint " coords="105,171,117,188" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="Point" title="Point" href="#" data-value="Point " id="wagon-Point " coords="105,192,117,205" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ForwardPoint" title="ForwardPoint" href="#" data-value="ForwardPoint " id="wagon-ForwardPoint " coords="105,217,115,227" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="CoverPoint" title="CoverPoint" href="#" data-value="CoverPoint " id="wagon-CoverPoint " coords="104,236,117,247" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="Cover" title="Cover" href="#" data-value="Cover " id="wagon-Cover " coords="105,261,116,272" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ExtraCover" title="ExtraCover" href="#" data-value="ExtraCover " id="wagon-ExtraCover " coords="111,302,123,315" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepMidOff" title="DeepMidOff" href="#" data-value="DeepMidOff " id="wagon-DeepMidOff " coords="158,349,172,361" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="DeepMidOn" title="DeepMidOn" href="#" data-value="DeepMidOn " id="wagon-DeepMidOn " coords="252,350,267,363" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="MidWicket" title="MidWicket" href="#" data-value="MidWicket " id="wagon-MidWicket " coords="308,261,320,275" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ForwardSquareLeg" title="ForwardSquareLeg" href="#" data-value="ForwardSquareLeg " id="wagon-ForwardSquareLeg " coords="306,217,319,232" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SquareLeg" title="SquareLeg" href="#" data-value="SquareLeg " id="wagon-SquareLeg " coords="308,192,320,206" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="BackwardSquareLeg" title="BackwardSquareLeg" href="#" data-value="BackwardSquareLeg " id="wagon-BackwardSquareLeg " coords="307,174,320,188" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortFineLeg" title="ShortFineLeg" href="#" data-value="ShortFineLeg " id="wagon-ShortFineLeg " coords="282,104,297,118" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="MidOff" title="MidOff" href="#" data-value="MidOff " id="wagon-MidOff " coords="163,307,177,323" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="MidOn" title="MidOn" href="#" data-value="MidOn " id="wagon-MidOn " coords="242,309,259,322" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="Bowler" title="Bowler" href="#" data-value="Bowler " id="wagon-Bowler " coords="197,277,213,293" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="WK" title="WK" href="#" data-value="WK " id="wagon-WK " coords="206,166,217,178" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="1st" title="1st" href="#" data-value="1st " id="wagon-1st " coords="195,156,205,166" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="2nd" title="2nd" href="#" data-value="2nd " id="wagon-2nd " coords="189,166,5" shape="circle" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="3rd" title="3rd" href="#" data-value="3rd " id="wagon-3rd " coords="180,171,5" shape="circle" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="4th" title="4th" href="#" data-value="4th " id="wagon-4th " coords="172,177,4" shape="circle" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="5th" title="5th" href="#" data-value="5th " id="wagon-5th " coords="163,183,5" shape="circle" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="Gully" title="Gully" href="#" data-value="Gully " id="wagon-Gully " coords="137,177,150,190" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="FlySlip" title="FlySlip" href="#" data-value="FlySlip " id="wagon-FlySlip " coords="164,137,174,151" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="BackwardShortLeg" title="BackwardShortLeg" href="#" data-value="BackwardShortLeg " id="wagon-BackwardShortLeg " coords="270,136,281,149" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="LegGully" title="LegGully" href="#" data-value="LegGully " id="wagon-LegGully " coords="270,168,283,181" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="LegSlip" title="LegSlip" href="#" data-value="LegSlip " id="wagon-LegSlip " coords="232,172,244,186" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortLeg" title="ShortLeg" href="#" data-value="ShortLeg " id="wagon-ShortLeg " coords="228,193,241,204" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SillyPoint" title="SillyPoint" href="#" data-value="SillyPoint " id="wagon-SillyPoint " coords="183,192,194,204" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SillyMidOff" title="SillyMidOff" href="#" data-value="SillyMidOff " id="wagon-SillyMidOff " coords="185,215,196,227" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortCover" title="ShortCover" href="#" data-value="ShortCover " id="wagon-ShortCover " coords="148,233,160,245" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortMidOff" title="ShortMidOff" href="#" data-value="ShortMidOff " id="wagon-ShortMidOff " coords="170,251,181,262" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortMidWicket" title="ShortMidWicket" href="#" data-value="ShortMidWicket " id="wagon-ShortMidWicket " coords="262,233,274,244" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="SillyMidOn" title="SillyMidOn" href="#" data-value="SillyMidOn " id="wagon-SillyMidOn " coords="227,215,238,227" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          <area target="" alt="ShortMidOn" title="ShortMidOn" href="#" data-value="ShortMidOn " id="wagon-ShortMidOn " coords="242,250,252,261" shape="0" onClick={(zone)=>handleWagonWheelClick(zone)}></area>
          </map>
          
        </div>
        </div>
            
        <div className="input-grid-below">

        <div className="input-span-2">
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
          </div>
        
            
          

          <div>
          {/* <div> */}
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
          
          <div className="input-span-2">
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
          <div className="text-center mt-2">
            <p className="text-sm font-medium">
            Selected Wagon Wheel Position: <strong>{currentBall.wagonWheel || 'None'}</strong>
            </p>
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
          Download Ball by Ball Data
        </button>
        <div className="scorer-table-container">
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
                <th className="border p-2">Bowler End</th>
                <th className="border p-2">Around the Wicket</th>
                <th className="border p-2">Ball Type</th>
                <th className="border p-2">Ball Speed (km/h)</th>
                <th className="border p-2">Ball Landed</th>
                <th className="border p-2">Extras</th>
                <th className="border p-2">No Bat Contact</th>
                <th className="border p-2">Dead Ball</th>
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
                  <td className="border p-2">{ball.end}</td>
                  <td className="border p-2">{ball.aroundTheWicket}</td>
                  <td className="border p-2">{ball.ballType}</td>
                  <td className="border p-2">{ball.ballSpeed}</td>
                  <td className="border p-2">{ball.wagonWheel}</td>
                  <td className="border p-2">{ball.extraType}</td>
                  <td className="border p-2">{ball.nbat}</td>
                  <td className="border p-2">{ball.deadBall}</td>
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
        <div className = "scrollable-table-container">
          
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
        </div>
        <button
          onClick={downloadFielderSnapshotCSV}
          className="download-button"
        >
          Download Fielder Alignment CSV
        </button>

      </div>
      <div className="fielder-misc-section right-align">
  <h2 className="heading">Exceptional and Misfielding</h2>

  <div className="input-group">
    <label className="block text-sm font-medium">Exceptional Fielding: </label>
    <select
      value={exceptionalFielding}
      onChange={(e) => setExceptionalFielding(e.target.value)}
      className="w-full border rounded p-2 mt-1"
    >
      <option value="">Select Player</option>
      {fielderAlignment.map(f => (
        <option key={f.name} value={f.name}>{f.name}</option>
      ))}
    </select>
  </div>

  <div className="input-group mt-4">
    <label className="block text-sm font-medium">Misfielding: </label>
    <select
      value={misfielding}
      onChange={(e) => setMisfielding(e.target.value)}
      className="w-full border rounded p-2 mt-1"
    >
      <option value="">Select Player</option>
      {fielderAlignment.map(f => (
        <option key={f.name} value={f.name}>{f.name}</option>
      ))}
    </select>
  </div>
</div>

{fieldingNotes.length > 0 && (
  <div className="mt-4">
    <button
      onClick={downloadFieldingNotesCSV}
      className="download-button"
    >
      Download Fielding Notes CSV
    </button>
  </div>
)}

      </div>
    </div>
  );
}

