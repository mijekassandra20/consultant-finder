import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../App';
import axios from 'axios';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

// import component
import AddFilter from './AddFilter';

//import css
import '../../css/filter-component.css'

//import icons
import { MdOutlineAdd, MdClose } from 'react-icons/md'

const MainFilter = (props) => {

    const {
        outerFilterCount, filterValues,
        setFilterValues, outerConditionState, setOuterConditionState
    } = useContext(AppContext);

    const [getFilterTable, setGetFilterTable] = useState([])
    const [selectedFilterTable, setSelectedFilterTable] = useState([])

    //select table inside filter
    useEffect(() => {
        const fetchFilterTables = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/record/tables');
                const tableNames = response.data.tables
                const tableOptions = tableNames.map(tableName => ({ value: tableName, label: tableName }));
                setGetFilterTable(tableOptions)

            } catch (error) {
                console.log(error)
            }
        }
        fetchFilterTables();
    }, [])

    const handleSelectTable = async (selectedFilterTable) => {
        setSelectedFilterTable(selectedFilterTable)
    }

    const addCondition = () => {
        const newInnerFilter = {
            innerID: uuidv4(),
            selectedFilterTable: '',
            selectedColumn: '',
            operator: '',
            inputValue: ''
        };

        const innerConditions = 'AND';

        setFilterValues(prevFilterValues => {
            return prevFilterValues.map(filter => {
                if (filter.id === props.id) {
                    return {
                        ...filter,
                        innerFilters: [...filter.innerFilters, newInnerFilter],
                        condition: [...filter.condition, innerConditions]
                    };
                }
                return filter;
            })
        })
    }

    const removeOuterCondition = () => {
        const indexToRemove = filterValues.findIndex(filterValue =>
            filterValue.id === props.id
        );
        const newOuterConditions = outerConditionState.filter((value, index) => index !== indexToRemove);

        setOuterConditionState(newOuterConditions);

        const filtered = filterValues.filter(filterValue =>
            filterValue.id !== props.id
        )

        setFilterValues(filtered)

    }

    const handleConditionChange = (index) => {
        const newConditionState = [...props.condition];
        newConditionState[index] = newConditionState[index] === "AND" ? "OR" : "AND";

        setFilterValues(prevFilterValues => {
            return prevFilterValues.map(mainID => {
                if (mainID.id === props.id) {
                    return {
                        ...mainID,
                        condition: newConditionState
                    }
                }
                return mainID
            })
        })

    }

    // useEffect(() => {
    //     console.log('Filters:', filterValues);
    //     console.log('OuterConditionState', outerConditionState)
    // }, [filterValues]);

    return (
        <>
            <div className='child-filter-container' id='filter-component'>
                {/* ------------------- SELECT  TABLE ------------------- */}
                <div className='main-filter-container'>
                    <div className='child-filter-wrapper'>
                        <div className='column1'>
                            Select Table:
                        </div>
                        <div className='value-table'>
                            <Select
                                placeholder='Please Select'
                                className='select-value'
                                options={getFilterTable}
                                value={selectedFilterTable}
                                onChange={handleSelectTable}
                                styles={props.customStyles}
                            />
                        </div>
                    </div>

                    {/* ------------------- INNER FILTER PART ------------------- */}

                    {props.filterValues.map((filter, index) => (
                        <div className='main-filter' key={`filter-${filter.innerID}`}>
                            <AddFilter
                                key={`filter-${filter.innerID}`}
                                id={filter.innerID}
                                filterValues={props.filterValues}
                                selectedFilterTable={selectedFilterTable}
                                setSelectedFilterTable={setSelectedFilterTable}
                                customStyles={props.customStyles}
                            />

                            {index !== props.condition.length - 1 && (
                                <div key={`condition-container-${filter.innerID}`} className='condition-container'
                                >

                                    <p onClick={() => {
                                        handleConditionChange(index, filter)
                                    }}>{props.condition[index]}</p>
                                    <div className='line-1'></div>
                                </div>
                            )}
                        </div>
                    ))}


                    {/* ------------------- INNER ADD/OR ------------------- */}
                    <div className='child-filter-wrapper'>
                        <div className='default-add-button' onClick={addCondition}>
                            <div className='add-icon'>
                                <MdOutlineAdd />
                            </div>
                            <p className='add-word'>
                                ADD
                            </p>
                        </div>
                    </div>
                </div >
                <div className='remove-filter'>
                    {outerFilterCount !== 1 && (
                        <div className='delete-icon close-entire-filter'>
                            <MdClose
                                onClick={removeOuterCondition}
                            />
                        </div>
                    )}
                </div>


            </div >
        </>
    )
}

export default MainFilter