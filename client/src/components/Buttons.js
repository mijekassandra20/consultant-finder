import React from 'react'

const Buttons = (props) => {

    return (
        <div className='buttons-container'>

            <div
                className='filter-button'
                onClick={props.onFilterClick}
            >
                FILTER
            </div>

            <div
                className='sort-button'
                onClick={props.onSortClick}
            >
                SORT
            </div>
            <div
                className='limit-button'
                onClick={props.onLimitClick}
            >
                LIMIT
            </div>
        </div>
    )
}

export default Buttons