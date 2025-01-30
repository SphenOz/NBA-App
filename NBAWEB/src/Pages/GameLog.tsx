import { useState, useEffect } from "react";
import { useAuth } from "../Auth/authContext";
import axiosInstance from "../Auth/axiosConfig";
import "./GameLog.css"
import Table from "../ReusableComponents/Table";
import { get } from "http";

export default function GameLog() {
    const {team} = useAuth();
    const [gameLogs, setGameLogs] = useState<any>([])
    const [expanded, setExpanded] = useState<any>(null)
    const [boxScore, setBoxScore] = useState<any>(false)
    const [clicked, setClicked] = useState<any>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [currentGame, setCurrentGame] = useState<any>(null)
    const [teamIndex, setTeamIndex] = useState<any>(0)
    const columns = [
        "Player",                
        "Min",                
        "FGM",
        "FGA",       
        "FG%",       
        "3PM",      
        "3PA",    
        "3P%",       
        "FTM",
        "FTA", 
        "FT%", 
        "OREB", 
        "DREB", 
        "REB",       
        "AST",  
        "STL", 
        "BLK",
        "TOV",        
        "PF",        
        "PTS",     
        "+/-",          
    ]

    useEffect(() => {
        if(gameLogs.length > 0){
            setTimeout(() => {
                fetchFullDetails(null,gameLogs[0])
            }, 1000)
        }
    },[gameLogs])

    useEffect(() => {
        let j = 0
        getGames()
        console.log(j)
    },[])
    const getGames = async() => {
        const response = await axiosInstance.get(`/team_games`, {
                params: {
                    team: team
                }
            } 
        )
        setGameLogs(response.data)
    }
    const switchBoxScore = () => {
        if(teamIndex == 0){
            setTeamIndex(1)
        }
        else{
            setTeamIndex(0)
        }
    }
    const fetchFullDetails = async(key: any, game: any) => {
        setExpanded(expanded === key ? null : key)
        setDisabled(true)
        setCurrentGame(game)
        if(game.Game_ID){
            console.log(game.Game_ID)
            const response = await axiosInstance.get(`/boxscore`, {
                params: {
                    game_id: game.Game_ID
                }
            })
            setTimeout(() => {
                setDisabled(false);
                setBoxScore(response.data)
            }, 500)
        }
        
    }

    return(
        <div className="team-games-container">
            <div className="gameLog-container" style={{justifyContent: !clicked ? 'flex-start' : 'flex-start'}}>
                <div className="gameLog" style={{height: clicked ? '80%' : 'auto'}}>
                {!clicked ? <span style={{height: '10px', backgroundColor: 'purple'}}>Show Game Logs</span> :
                    gameLogs.map((game: any, key: any) => (
                        <div>
                            {gameLogs.length > 0 ? (
                                <div className="gameTab" style={{backgroundColor: game.WL == "W" ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,0.5)'}} key={key} onClick={() => setExpanded(expanded === key ? null : key)}>
                                    <span style={{padding: 5, color: "white", textAlign: 'left', fontSize: 15, width: "auto"}}>
                                        {`${game.GAME_DATE} ${game.MATCHUP} | ${game.WL} | ${game.W} - ${game.L}`}
                                    </span>
                                    
                                    {expanded === key && (
                                        <div style={{}}>
                                            <button onClick={() => fetchFullDetails(key, game)} disabled={disabled}>Load</button><span style={{color: "white", fontSize: 15, padding: 5}}>{`PTS: ${game.PTS} | REBS: ${game.REB} | ASTS: ${game.AST}`} </span>
                                        </div>
                                    )}
                                </div>
                    
                            ) : (
                                'hi'
                            )} 
                        </div>
                ))}
                </div>
                <button onClick={() => setClicked(!clicked)}>{clicked ? "Collapse ": "Expand"}</button>
            </div>
        {boxScore[0] && boxScore[0].length > 1 ? 
            <div className="boxscore-container">
                <div className="boxscore-header">
                    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginLeft: '5%'}}>
                        <img src={`https://cdn.nba.com/logos/nba/${currentGame.Team_ID}/primary/L/logo.svg`} style={{width: '100%', height: 200}}/>
                        <span style={{fontSize: "clamp(20px, 3.5vw, 45px)"}}>{currentGame.PTS}</span>
                    </div>
                    
                    <span style={{fontSize: "clamp(20px, 3.5vw, 50px)"}}>{currentGame.MATCHUP}</span>
                    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginRight: '5%'}}>
                        {boxScore[0].at(-1)['points'] != currentGame.PTS ? <span style={{fontSize: "clamp(20px, 3.5vw, 45px)"}}>{boxScore[0].at(-1)['points']}</span> : <span style={{fontSize: "clamp(20px, 3.5vw, 45px)"}}>{boxScore[1].at(-1)['points']}</span>}
                        <img src={`https://cdn.nba.com/logos/nba/${currentGame.OPPONENT_ID}/primary/L/logo.svg`} style={{width: '100%', height: 200}}/>
                    </div>
                </div>
                
                <div className='t-table' style={{width: '75%', backgroundColor: 'rgb(20, 20, 20)'}}><button onClick={() => switchBoxScore()}>Switch Team Boxscore</button>
                    <table>
                        {/* Table Header */}
                        <thead>
                            <tr>
                                {columns.map((column: any) => (
                                    <th className = 't-head' key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                                {boxScore[teamIndex].slice(0,-1).map((home_team: any) => (
                                    <tr className='t-row'>
                                        {home_team.slice(0,-1).map((cell: any) => (
                                            <td>{home_team[0] == cell ?
                                            <div style={{display: 'flex', alignItems: 'flex-start', padding: 0, margin: 0, justifyContent: 'flex-start'}}>
                                                <img width={260/7} height={190/7} style={{marginRight: 10, backgroundColor: 'white', border: '1px solid black', borderRadius: '100%'}} src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${home_team.at(-1)}.png`}/> {cell} 
                                            </div> : cell}
                                            {cell === ''?
                                            <div style={{display: 'flex', alignItems: 'flex-start', padding: 0, margin: 0, justifyContent: 'flex-start'}}>
                                                DNP 
                                            </div> : ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className='t-row'>
                                    <td>TOTALS</td>
                                    <td></td>
                                    <td>{boxScore[teamIndex].at(-1)['fieldGoalsMade']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['fieldGoalsAttempted']}</td>
                                    <td>{(boxScore[teamIndex].at(-1)["fieldGoalsPercentage"]*100).toFixed(1)}</td>
                                    <td>{boxScore[teamIndex].at(-1)['threePointersMade']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['threePointersAttempted']}</td>
                                    <td>{(boxScore[teamIndex].at(-1)['threePointersPercentage']*100).toFixed(1)}</td>
                                    <td>{boxScore[teamIndex].at(-1)['freeThrowsMade']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['freeThrowsAttempted']}</td>
                                    <td>{(boxScore[teamIndex].at(-1)["freeThrowsPercentage"]*100).toFixed(1)}</td>
                                    <td>{boxScore[teamIndex].at(-1)['reboundsOffensive']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['reboundsDefensive']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['reboundsTotal']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['assists']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['steals']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['blocks']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['turnovers']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['foulsPersonal']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['points']}</td>
                                    <td>{boxScore[teamIndex].at(-1)['points']-boxScore[teamIndex^1].at(-1)['points']}</td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div> : <div></div>}
        </div>
    )
}