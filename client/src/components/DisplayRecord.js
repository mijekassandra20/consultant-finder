import React, { useContext } from 'react'
import { AppContext } from '../App'

//import css
import '../css/component-styles.css'

const DisplayRecord = () => {

    const { records } = useContext(AppContext)

    const data = records

    return (

        <div className='main-component-container'>
            {/* <div className='main-component-wrapper display-bookmark' id='table-wrapper'> */}
            {/* <h4 className='record-table-title'>CONSULTANT RECORDS</h4> */}

            {/* --------------- TABLE RECORDS --------------- */}

            {data.length === 0 ? (
                <div className='main-component-wrapper display-bookmark'>

                    <div className='empty-record'>
                        <p> There are no records to display.</p>
                    </div>
                </div>

            ) : (
                <div className='main-component-wrapper display-bookmark' id='table-wrapper'>

                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr className='field-name'>
                                    <th className='count-head'>#</th>
                                    {data.length > 0 && Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((record, index) => (
                                    <tr className={index % 2 === 0 ? 'record-values-even' : 'record-values-odd'} key={index}>
                                        <td className={index % 2 === 0 ? 'record-count-even' : 'record-count-odd'}>{index + 1}</td>
                                        {Object.entries(record).map(([key, value]) => (
                                            <td key={key}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        // </div >

    )
}

export default DisplayRecord