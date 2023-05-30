import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../App';
import axios from 'axios';
import Select from 'react-select';

//import css
import { FaRegTrashAlt } from 'react-icons/fa'

const AddFilter = (props) => {

  const { filterValues, setFilterValues } = useContext(AppContext); // where the values in filter are stored

  const [filterColumns, setFilterColumns] = useState([]); // select columns
  const [metaValues, setMetaValues] = useState([]); // select values
  const [selectedColumn, setSelectedColumn] = useState(''); // select values

  // operators

  const filterOperators = [
    { value: '=', label: '= (equal)' },
    { value: '<>', label: '<> (not equal)' },
    { value: '>=', label: '>= (greater or equal)' },
    { value: '<=', label: '<= (less or equal)' },
    { value: '>', label: '> (is greater)' },
    { value: '<', label: '<  (is less)' }
  ]

  const findColumn = props.filterValues.find((childFilter) => childFilter['innerID'] === props.id)
  const columnFilter = findColumn?.selectedColumn;

  // table selected inside the filter
  const tableFilter = props.selectedFilterTable.value

  //get the table name to use as parameter
  useEffect(() => {
    const fetchFilterColumns = async () => {
      try {
        if (tableFilter) {
          const response = await axios.get(`http://localhost:5000/api/record/columns/${tableFilter}/metadata`);

          const columnOptions = response.data.columnNames.map(columnName => ({
            value: columnName,
            label: columnName
          }))

          setFilterColumns(columnOptions)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchFilterColumns();
  }, [tableFilter, props.filterValues.selectedColumn, filterValues.operator, filterValues.inputValue])

  // get metadatas to display
  useEffect(() => {

    const fetchMetadata = async () => {
      try {
        if (columnFilter) {
          const response = await axios.get(`http://localhost:5000/api/record/columns/${tableFilter}/metadata/${columnFilter}`);

          const metaOptions = response.data.metadatas.map((metadata) => {
            return {
              value: metadata.value,
              label: metadata.label
            };
          });

          setSelectedColumn(columnFilter)
          setMetaValues(metaOptions)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchMetadata();
  }, [columnFilter, tableFilter, props.selectedFilterTable.value, filterValues.selectedColumn, filterValues.operator, filterValues.inputValue])


  const removeCondition = () => {
    setFilterValues((prevFilters) => {
      const newFilters = prevFilters.map((filter) => {
        const innerIndex = filter.innerFilters.findIndex((condition) => condition.innerID === props.id);
        if (innerIndex >= 0) {
          const newInnerFilters = [...filter.innerFilters];
          newInnerFilters.splice(innerIndex, 1);

          const newConditions = [...filter.condition];
          newConditions.splice(innerIndex, 1);

          return {
            ...filter,
            innerFilters: newInnerFilters,
            condition: newConditions
          };
        } else {
          return filter;
        }
      });
      return newFilters;
    });
  };

  const handleChange = (id, field, value) => {
    // console.log('field: ', field)
    // console.log('value: ', value)
    // console.log('id: ', props.id)

    const table = props.selectedFilterTable

    setFilterValues((prevFilters) => {
      const newFilters = prevFilters.map((filter) => {
        const newInnerFilters = filter.innerFilters.map((condition) => {
          if (condition.innerID === id) {
            return {
              ...condition,
              [field]: value,
              selectedFilterTable: table.value
            }
          }
          return condition;
        });
        return {
          ...filter,
          innerFilters: newInnerFilters
        };
      });
      return newFilters;
    });

  }

  return (
    <div className='child-filter-wrapper'>
      <div className='select-filter-container'>
        <div className='dropdown-container'>
          <div className='value-table'>
            <Select
              placeholder='SELECT COLUMN'
              className='select-value'
              options={filterColumns}
              value={props.filterValues.selectedColumn}
              onChange={(selectedOption) =>
                handleChange(props.id, "selectedColumn", selectedOption.value)
              }
              styles={props.customStyles}
            />
          </div>
          <div className='value-table'>
            <Select
              placeholder='SELECT OPERATORS'
              className='select-value'
              options={filterOperators}
              value={props.filterValues.operator}
              onChange={(selectedOption) =>
                handleChange(props.id, "operator", selectedOption.value)
              }
              styles={props.customStyles}
            />
          </div>

          {selectedColumn === "YearsITExperience" ? (
            <div className='value-table'>
              <input
                type='number'
                placeholder='VALUE'
                name="value"
                className='input-container'
                value={filterValues.inputValue}
                onChange={(e) => handleChange(props.id, "inputValue", e.target.value)}
              />
            </div>

          ) : (
            <div className='value-table'>
              <Select
                placeholder='SELECT VALUES'
                className='select-value'
                options={metaValues}
                value={props.filterValues.inputValue}
                onChange={(selectedOption) =>
                  handleChange(props.id, "inputValue", selectedOption.value)
                }
                styles={props.customStyles}

              />
            </div>
          )}
        </div>

        <div className='delete-icon'>
          <FaRegTrashAlt
            onClick={removeCondition}
          />
        </div>
      </div>
    </div>
  )
}

export default AddFilter