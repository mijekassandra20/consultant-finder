import React, { useContext } from 'react'
import { AppContext } from '../App'

//import css
import '../css/component-styles.css'

//import icons
import { FaMinusCircle } from 'react-icons/fa'


const Limit = (props) => {

    const { limit, setLimit } = useContext(AppContext)

    const handleChange = (event) => {
        setLimit(event.target.value);
    }
    // console.log('limit is: ', limit)


    return (
        <div className='limit-table-wrapper' id='component-border'>
            <div className='child-container-2'>
                <div className='select-container'>
                    <div className='title-wrapper'> LIMIT RECORDS</div>
                    <input
                        type='number'
                        placeholder='ENTER VALUE'
                        name="value"
                        className='input-container'
                        value={limit}
                        onChange={handleChange}
                    />
                </div>
                <div className='delete-icon'>
                    <FaMinusCircle
                        onClick={props.onClose} />
                </div>
            </div>
        </div>
    )
}

export default Limit