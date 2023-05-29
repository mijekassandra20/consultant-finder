import React, { useContext, } from 'react'
import Select from 'react-select'
import { AppContext } from '../App'

//import css
import '../css/component-styles.css'

//import icons
import { FaMinusCircle } from 'react-icons/fa'

const Sort = (props) => {

    const { order, setOrder, records, sortedColumn, setSortedColumn } = useContext(AppContext)

    // toggleSwitch
    const toggleOrder = () => {
        setOrder((prevOrder) => prevOrder === 'ASC' ? 'DESC' : 'ASC');
    };

    const options = () => {
        if (!records || records.length === 0) {
            return [{ value: "", label: "No options" }];
        }
        return Object.keys(records[0]).map((key) => ({
            value: key,
            label: key,
        }));
    };

    const handleSelectChange = (sortedColumn) => {
        setSortedColumn(sortedColumn);
        console.log('selectedOptions is: ', sortedColumn)
    };

    return (
        <div className='sort-table-wrapper' id='component-border'>
            <div className='child-container-2'>
                <div className='select-container'>
                    <div className='title-wrapper'>SORT</div>

                    <div className='sort-dropdown'>
                        <Select
                            className='select-value'
                            options={options()}
                            onChange={handleSelectChange}
                            value={sortedColumn}
                            styles={props.customStyles}
                        />

                        <div className="toggle-order-button-container">
                            <div>
                                <button
                                    className={`toggle-order-button ${order === 'ASC' ? 'active' : ''}`}
                                    onClick={toggleOrder}
                                >
                                    ASC
                                </button>
                                <button
                                    className={`toggle-order-button ${order === 'DESC' ? 'active' : ''}`}
                                    onClick={toggleOrder}
                                >
                                    DESC
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
                <div className='delete-icon'>
                    <FaMinusCircle
                        onClick={props.onClose} />
                </div>
            </div>
        </div >
    )
}

export default Sort