import { Key, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react'
import './Table.css'

export default function Card (prop : any) {
    const a = prop.player
    return(
        <>
            <div className='t-table'>
                <table>
                    <thead>
                        <tr className='thead_row'>
                            <th className='table_header'>SEASON </th>
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
                        {a.map((stats: (string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined)[], season: Key | null | undefined) => (
                            <tr key={season} className='row'>
                                <td>{stats[1]} </td>
                                <td>{stats[4]} </td>
                                <td>{stats[6]} </td>
                                <td>{(Number(stats[8])/Number(stats[6])).toFixed(0)} </td>
                                <td>{(Number(stats[26])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[20])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[21])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[11])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[14])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[17])*100).toFixed(1)}%</td>
                                <td>{(Number(stats[22])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[23])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[24])/Number(stats[6])).toFixed(2)} </td>
                                <td>{(Number(stats[25])/Number(stats[6])).toFixed(2)} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}