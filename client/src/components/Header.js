import React, { useContext } from 'react'
import { v4 as uuidv4 } from 'uuid';

// css
import '../css/main-component.css'

// icons
import { HiHome, HiCog6Tooth } from 'react-icons/hi2';
import { AppContext } from '../App';

const Header = () => {

    const {
        toggleSettings, setToggleSettings,
        setToggleMainComponent, toggleMainComponent,
        setRecords, setFilterValues, setOuterConditionState, setOrder, setSortedColumn, setLimit
    } = useContext(AppContext)

    const handleMainComponent = () => {
        setToggleMainComponent(true)
        setToggleSettings(false)
    }

    const handleSettings = () => {
        setToggleSettings(true)
        setToggleMainComponent(false)
        setRecords([])
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
        }])
        setOuterConditionState(['AND'])
        setOrder('ASC')
        setSortedColumn("")
        setLimit("")
    }

    return (
        <div className='header'>
            <div className='app-title-container'>
                <div to="/">
                    <img src="logo-qb.png" alt="QB-logo" className='logo' />
                </div>
                <h3>CONSULTANT FINDER</h3>
            </div>
            <div className='settings-container'>
                <HiHome
                    className={`header-icon ${toggleMainComponent ? 'active-header' : ''}`}
                    onClick={handleMainComponent}
                />
                <HiCog6Tooth
                    className={`header-icon ${toggleSettings ? 'active-header' : ''}`}
                    onClick={handleSettings}
                />
            </div>

        </div>
    )
}

export default Header