import React, { useContext } from 'react'

// css
import '../css/main-component.css'

// icons
import { HiHome, HiCog6Tooth } from 'react-icons/hi2';
import { AppContext } from '../App';

const Header = () => {

    const {
        toggleSettings, setToggleSettings,
        setToggleMainComponent, toggleMainComponent } = useContext(AppContext)

    const handleMainComponent = () => {
        setToggleMainComponent(true)
        setToggleSettings(false)
    }

    const handleSettings = () => {
        setToggleSettings(true)
        setToggleMainComponent(false)
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
                {/* <p className={`header-icon ${toggleMainComponent ? 'active-header' : ''}`}>
                    HOME
                </p> */}
                <HiHome
                    className={`header-icon ${toggleMainComponent ? 'active-header' : ''}`}
                    onClick={handleMainComponent}
                />

                {/* <p className={`header-icon ${toggleMainComponent ? 'active-header' : ''}`}>
                    SETTINGS
                </p> */}
                <HiCog6Tooth
                    className={`header-icon ${toggleSettings ? 'active-header' : ''}`}
                    onClick={handleSettings}
                />
            </div>

        </div>
    )
}

export default Header