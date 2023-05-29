import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App';
import axios from 'axios';
import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";

//css
import '../css/checkbox.css'

const SelectColumn = ({ selectAllChecked, setSelectAllChecked }) => {

    const [columns, setColumns] = useState([]);
    const { selectedTable, selectedColumns, setSelectedColumns } = useContext(AppContext);

    const selectAll = { value: '*', label: 'SELECT ALL' }

    //select columns to display
    useEffect(() => {
        const fetchColumns = async () => {

            try {
                if (selectedTable.value) {
                    const response = await axios.get(`http://localhost:5000/api/record/columns/${selectedTable.value}`);

                    const columnOptions = response.data.columnNames.map(columnName => ({
                        value: columnName,
                        label: columnName
                    }))
                    setColumns(columnOptions)

                }
            } catch (error) {
                console.log(error)
            }

        }

        fetchColumns();
    }, [selectedTable])

    //get selected columns
    const handleSelectColumns = (value, isChecked) => {
        if (value === "*") {
            setSelectAllChecked(isChecked);

            if (isChecked) {
                setSelectedColumns(columns.map((column) => column.value));

            } else {
                setSelectedColumns([]);

            }
        } else {
            setSelectedColumns((prevState) => {
                if (isChecked) {
                    return [...prevState, value];
                } else {
                    return prevState.filter((column) => column !== value);
                }
            });
            if (selectAllChecked) {
                setSelectAllChecked(false);
            }
            console.log('Selected Columns is:', value)

        }
    };

    return (

        <div className='select-column-container'>
            {selectedTable.value && (
                <div className='columns-checkbox-container'>
                    {selectAll && (
                        <Checkbox
                            key={selectAll.value}
                            icon={<Icon.FiCheck color="#174A41" size={15} />}
                            name={selectAll.value}
                            checked={selectAllChecked}
                            borderColor="#333"
                            style={{ cursor: "pointer" }}
                            labelStyle={{ marginLeft: 5, userSelect: "none" }}
                            label={selectAll.label}
                            onChange={(isChecked) => handleSelectColumns(selectAll.value, isChecked)}

                        />
                    )}
                    {columns.map((column) => (
                        <Checkbox
                            key={column.value}
                            icon={<Icon.FiCheck color="#174A41" size={15} />}
                            name={column.value}
                            checked={selectAllChecked || selectedColumns.includes(column.value)}
                            borderColor="#333"
                            style={{ cursor: "pointer" }}
                            labelStyle={{ marginLeft: 5, userSelect: "none" }}
                            label={column.label}
                            onChange={(isChecked) => handleSelectColumns(column.value, isChecked)}
                        />
                    ))}
                </div>
            )}
        </div>

    );
};


export default SelectColumn