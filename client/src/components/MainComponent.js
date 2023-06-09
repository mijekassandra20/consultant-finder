import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

//import components
import Buttons from './Buttons'
import FilterComponent from './FilterComponent'
import Sort from './Sort'
import Limit from './Limit'
import SelectColumn from './SelectColumn'

//css 
import '../css/main-component.css'
import '../css/dropdown.css'
import '../css/component-styles.css'

//import icons
import { IoBookmarkOutline } from 'react-icons/io5'
import CreateBookmark from './CreateBookmark';


const MainComponent = () => {

    //tables
    const [getTables, setGetTables] = useState([])
    const {
        selectedTable, setSelectedTable, selectedColumns, setSelectedColumns,
        outerConditionState, setOuterConditionState,
        filterValues, setFilterValues,
        setRecords,
        setSaveQuery,
        order, setOrder,
        sortedColumn, setSortedColumn,
        limit, setLimit,
        errorMessage, setErrorMessage
    } = useContext(AppContext);

    //toggle
    const [toggleFilter, setToggleFilter] = useState(false)
    const [toggleSort, setToggleSort] = useState(false)
    const [toggleLimit, setToggleLimit] = useState(false)

    //reset columns if new table is selected
    const [selectAllChecked, setSelectAllChecked] = useState(false)

    //toggle bookmark
    const [openModal, setOpenModal] = useState(false)

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // const handleClear = () => {
    //     setFilterValues([{
    //         id: uuidv4(),
    //         innerFilters: [{
    //             innerID: uuidv4(),
    //             selectedFilterTable: '',
    //             selectedColumn: '',
    //             operator: '',
    //             inputValue: ''
    //         }],
    //         condition: ['AND']
    //     }]);
    //     setOuterConditionState(['AND']);
    //     setRecords([]);
    //     setOrder('ASC');
    //     setSortedColumn("")
    //     setLimit("")
    //     setToggleFilter(false)
    //     setToggleSort(false)
    //     setToggleLimit(false)
    // }

    const handleFilterClose = () => {
        setToggleFilter(false);
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
        setOuterConditionState(['AND'])
    }

    const handleCloseSort = () => {
        setOrder('ASC')
        setSortedColumn('')
        setToggleSort(false);
    }
    const handleCloseLimit = () => {
        setLimit('')
        setToggleLimit(false);
    }

    //get table
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/record/tables');
                const tableNames = response.data.tables
                const tableOptions = tableNames.map(tableName => ({ value: tableName, label: tableName }));
                setGetTables(tableOptions);

            }
            catch (error) {
                console.log(error);
            }
        }

        fetchTables();
    }, [])

    const handleSelectTable = async (selectedTable) => {
        setSelectedTable(selectedTable)
        setSelectedColumns([])
        setSelectAllChecked(false)
        // console.log('columns are: ', selectedColumns)
    }

    // send values in the backend to create query
    const sendQueryToBackend = async () => {

        try {

            const response = await axios.post('http://localhost:5000/api/record/query', {
                selectedTable: selectedTable.value,
                selectedColumns: selectedColumns,
                filterValues: filterValues,
                outerConditionState: outerConditionState,
                order: order,
                sortedColumn: sortedColumn,
                limit: limit
            });

            setRecords(response.data[0]) // data
            setSaveQuery(response.data[1]) // save the query
            // console.table(response.data[0])
            // console.log('filterValues: ', filterValues)
            // console.log(saveQuery)


        } catch (error) {
            setErrorMessage(error.response.data.message)
            console.log('error: ', error.response.data.message)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage("");
        }, 3000)
    }, [errorMessage, setErrorMessage])

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'white',
            borderColor: state.isFocused ? '#0d7270' : '#ccc',
            boxShadow: state.isFocused ? '0 0 0 1px #0d7270' : 'null',
            '&:hover': {
                borderColor: state.isFocused ? '#0d7270' : 'null',
            },
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'white',
            fontSize: '14px',
            zIndex: '999'
        }),

        option: (provided, state) => {
            const isSelectedColor = '#0d7270';
            const selectedBackgroundColor = state.isSelected ? isSelectedColor : null;

            return {
                ...provided,
                padding: state.isSelected ? '10px 15px' : '7px 15px',
                backgroundColor: selectedBackgroundColor,
                ':hover': {
                    backgroundColor: state.isSelected ? selectedBackgroundColor : '#0d72702e',
                },

            };
        },
    };

    return (
        <div className='main-component-container'>
            <div className='main-component-wrapper query'>

                <div className='query-wrapper'>
                    <div className='child-container'>
                        <div className='column1'>
                            Select Table:
                        </div>
                        <div className='value-table'>
                            <Select
                                placeholder='Please Select'
                                className='select-value'
                                options={getTables}
                                value={selectedTable}
                                onChange={handleSelectTable}
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className='child-container'>
                        <div className='column1'>
                            Columns:
                        </div>
                        <div className='value-table'>
                            <SelectColumn
                                selectAllChecked={selectAllChecked}
                                setSelectAllChecked={setSelectAllChecked}
                            />
                        </div>
                    </div>

                    <Buttons
                        onFilterClick={() => setToggleFilter(true)}
                        onSortClick={() => setToggleSort(true)}
                        onLimitClick={() => setToggleLimit(true)}
                    />

                    {toggleFilter &&
                        <FilterComponent
                            onClose={handleFilterClose}
                            customStyles={customStyles} />}
                    {toggleSort &&
                        <Sort
                            onClose={handleCloseSort}
                            customStyles={customStyles} />}
                    {toggleLimit &&
                        <Limit
                            onClose={handleCloseLimit} />}

                    {errorMessage && (
                        <p className='error-message'>*{errorMessage}</p>
                    )}

                    <div className='submit-container'>
                        <div
                            className='submit-btn'
                            onClick={() => sendQueryToBackend()}
                        >
                            FIND
                        </div>
                    </div>

                </div>

                <div className='icons-wrapper'>

                    {/* <div className='clear-icon' onClick={handleClear}>
                        <p>CLEAR</p>
                    </div> */}

                    <div className='bookmark-icon' onClick={handleOpenModal}>
                        <IoBookmarkOutline />
                        <p>Bookmark</p>
                    </div>



                </div>



                {openModal === true && (
                    <CreateBookmark
                        setOpenModal={setOpenModal}
                        handleCloseModal={handleCloseModal}
                    />
                )}
            </div>


        </div>
    )
}

export default MainComponent