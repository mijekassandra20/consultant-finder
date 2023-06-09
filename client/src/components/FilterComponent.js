import React, { useState, useContext } from 'react'
import { AppContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

// import component
import MainFilter from './Filter/MainFilter'

// import css
import '../css/component-styles.css'

// import icons
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'

const FilterComponent = (props) => {

    const [outerFilterCount, setOuterFilterCount] = useState(1);
    const [outerFilters, setOuterFilters] = useState([])
    const { outerConditionState, setOuterConditionState,
        filterValues, setFilterValues } = useContext(AppContext);

    const addOuterCondition = () => {
        setOuterFilterCount(outerFilterCount + 1);
        setOuterFilters([...outerFilters, outerFilterCount]);
        setOuterConditionState([...outerConditionState, "AND"]); // add a new element to the array with the initial value "AND"

        const newMainFilter = {
            id: uuidv4(),
            innerFilters: [{
                innerID: uuidv4(),
                selectedFilterTable: '',
                selectedColumn: '',
                operator: '',
                inputValue: ''
            }],
            condition: ['AND']
        }

        setFilterValues([...filterValues, newMainFilter]);
        // console.log('filterValues: ', filterValues)
    }

    const clearConditions = () => {
        setOuterFilterCount(1);
        setOuterFilters([]);
        setFilterValues([{
            id: uuidv4(),
            innerFilters: [{
                innerID: uuidv4(),
                selectedFilterTable: '',
                selectedColumn: '',
                operator: '',
                inputValue: ''
            }],
            condition: ['AND']
        }]);
        setOuterConditionState(['AND']);
    }

    return (
        <div className='filter-component-wrapper' id='component-border'>
            <div className='child-container-2'>
                <div className='title-wrapper'> FILTER</div>
                <div className='icons-wrapper filter'>
                    <div className='clear-filter' onClick={clearConditions}>
                        <p>CLEAR</p>
                    </div>
                    <p>|</p>
                    <div className='delete-icon filter'>
                        <FaMinusCircle
                            onClick={props.onClose} />
                    </div>
                </div>

            </div>
            {/* ------------------- OUTER FILTER PART ------------------- */}

            {filterValues.map((outerFilter, outerIndex) => (
                <div key={outerFilter.id}>
                    <MainFilter
                        key={outerFilter.id}
                        id={outerFilter.id}
                        filterValues={outerFilter.innerFilters}
                        condition={outerFilter.condition}
                        customStyles={props.customStyles}
                    />
                    {outerIndex !== filterValues.length - 1 && (
                        <div className="condition-container">
                            <div className={`outer-div ${outerConditionState[outerIndex] === 'AND' ? 'and-container' : 'or-container'}`}>
                                <p onClick={() => {
                                    const newConditionState = [...outerConditionState];
                                    newConditionState[outerIndex] = newConditionState[outerIndex] === "AND" ? "OR" : "AND";
                                    setOuterConditionState(newConditionState);
                                }}>{outerConditionState[outerIndex]}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* ------------------- OUTER ADD/OR ------------------- */}

            <div className='outer-default-add' onClick={addOuterCondition}>
                <FaPlusCircle />
            </div>

        </div>
    )
}

export default FilterComponent