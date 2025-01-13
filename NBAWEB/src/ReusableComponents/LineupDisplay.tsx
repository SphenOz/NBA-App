import React, { Key } from "react";


interface Player{
    player: any | null
 }
 
export default function Strip ( prop: any ) {
    const player = prop.player
    const setPlayer = prop.setPlayer
    return(
        <>
            <div className='t-table'>
                <table>
                    <thead>
                        <tr className='thead_row'>
                            <th className='table_header'>PLAYER </th>
                            <th className='table_header'>TEAM </th>
                            <th className='table_header'>GP </th>
                            <th className='table_header'>MPG </th>
                            <th className='table_header'>PPG </th>
                            <th className='table_header'>RPG </th>
                            <th className='table_header'>APG </th>
                            <th className='table_header'>FG_PCT </th>
                            <th className='table_header'>FG3_PCT </th>
                            <th className='table_header'>FT_PCT </th>
                            <th className='table_header'>SPG </th>
                            <th className='table_header'>BPG </th>
                            <th className='table_header'>TOV </th>
                            <th className='table_header'>PF </th>
                        </tr>
                    </thead>
                    <tbody>
                        {player.map((stats: any, season: Key | null | undefined) => (
                            <tr key={season} className='row'>
                                <td className="row-name" onClick={() => setPlayer(stats[0])}>{stats[0]} </td>
                                <td>{stats[1][4]} </td>
                                <td>{stats[1][6]} </td>
                                <td>{(Number(stats[1][8])/Number(stats[1][6])).toFixed(0)} </td>
                                <td>{(Number(stats[1][26])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][20])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][21])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][11])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[1][14])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[1][17])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[1][22])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][23])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][24])/Number(stats[1][6])).toFixed(2)} </td>
                                <td>{(Number(stats[1][25])/Number(stats[1][6])).toFixed(2)} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}