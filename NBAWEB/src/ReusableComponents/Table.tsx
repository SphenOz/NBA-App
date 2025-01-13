import { Key, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState, useEffect } from 'react'
import './Table.css'

export default function Card (prop : any) {
    const columns = prop.columns
    var rows = [...prop.rows]
    const [sortedRows, setSortedRows] = useState([...prop.rows].reverse())
    const [index, setIndex] = useState<number | null>();

    useEffect(() => { setSortedRows([...prop.rows].reverse()) }, [prop.rows])


    useEffect(() => {
        if(index){
            console.log(" This is the index: " + index + " and the value! " + sortedRows[0][index]) 
            for(let i = 0; i< rows.length; i++){
                for(let j = 0; j< rows.length - i - 1; j++){
                    console.log("Comparing Season " + rows[j][0] + " " +  rows[j][index] + " and " + rows[j][0] + " " + rows[j+1][index])
                    if(rows[j][index] > rows[j+1][index]){
                        let temp = rows[j]
                        rows[j] = rows[j+1]
                        rows[j+1] = temp
                    }
                }
            }
        }    
        setSortedRows(rows.reverse())
        rows = [...prop.rows]
        console.log("Sorted Rows: " + sortedRows)
    }, [index])

    const sortBy = (column: string) => {
        setIndex(columns.indexOf(column))
    }
    return(
        <>
            <div className='t-table'>
                <table>
                    {/* Table Header */}
                    <thead>
                        <tr>
                            {columns.map((column: any) => (
                                <th onClick={() => sortBy(column)} className = 't-head' key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                            {sortedRows.map((sorted_rows: any) => (
                                <tr className='t-row'>
                                    {sorted_rows.map((cell: any) => (
                                        <td>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}