import React, { useState, useEffect } from 'react'
import axios from 'axios'

// import files
import DisplayBookmarks from './DisplayBookmarks'

// import css
import '../css/settings.css'

// import icons
import { HiOutlineArrowDownTray } from 'react-icons/hi2'

const Settings = () => {

    const [importErrorMessage, setImportErrorMessage] = useState("")
    const [databaseErrorMessage, setDatabaseErrorMessage] = useState("")

    const [activeSetting, setActiveSetting] = useState('Bookmark');

    const handleSettingClick = (setting) => {
        setActiveSetting((prevSetting) => (prevSetting === setting ? prevSetting : setting));
    };

    useEffect(() => {
        setTimeout(() => {
            setImportErrorMessage("");
            setDatabaseErrorMessage("");
        }, 10000)
    }, [importErrorMessage, setImportErrorMessage, databaseErrorMessage, setDatabaseErrorMessage])

    // UPLOAD NEW DATABASE
    const handleFileUpload = (event) => {
        const formData = new FormData();
        const files = event.target.files[0];
        formData.append('file', files);

        axios.post('http://localhost:5000/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                alert('File uploaded successfully!');
                setDatabaseErrorMessage(false)

            })
            .catch(error => {
                setDatabaseErrorMessage(error.response.data.message)
                console.log(error);
            });
    }

    // DOWNLOAD DATABASE
    const handleDownload = () => {
        const fileName = 'Consultants_DB.accdb'
        const downloadUrl = 'http://localhost:5000/api/record/download';

        axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'blob', // Response type is set to blob to receive binary data
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            alert('File downloaded successfully!');
        });
    }

    // STEP 2.1 IMPORT FILE IN THE SERVER
    const importFile = (event) => {
        const formData = new FormData();
        const files = event.target.files[0];
        formData.append('file', files);

        axios.post('http://localhost:5000/import-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                alert('File imported successfully!');
                setImportErrorMessage(false)

            })
            .catch(error => {
                setImportErrorMessage(error.response.data.message)
                console.log(error);
            });
    }

    // STEP 2.2 INSERT THE DATA IN ACCESS FILE
    const handleImport = async () => {
        try {
            await axios.get('http://localhost:5000/api/record/insert-newData')
                .then(response => {
                    console.log(response.data);
                    alert('Data imported successfully into the database!');
                    setImportErrorMessage(false)

                })
                .catch(error => {
                    setImportErrorMessage(error.response.data.message)
                    console.log(error);
                });

            await axios.delete('http://localhost:5000/api/record/delete-import');

        } catch (error) {
            // setErrorMessage(error.response.data.message)
            console.log('error: ', error)
        }


    }

    return (
        <div className='main-component-container'>
            <div className='main-component-wrapper settings'>
                <div className='column1'>
                    <div className='setting-title'>
                        <h3>SETTINGS</h3>
                    </div>
                    <hr />
                    <div className='setting-options'>
                        <p
                            className={activeSetting === 'Bookmark' ? 'active-setting' : 'inactive-setting'}
                            onClick={() => handleSettingClick('Bookmark')}>Bookmark
                        </p>
                        <p
                            className={activeSetting === 'ImportExcel' ? 'active-setting' : 'inactive-setting'}
                            onClick={() => handleSettingClick('ImportExcel')}>Import Excel
                        </p>
                        <p
                            className={activeSetting === 'Database' ? 'active-setting' : 'inactive-setting'}
                            onClick={() => handleSettingClick('Database')}>Database
                        </p>


                    </div>
                </div>
                <div className='column2'>
                    <div className='settings-container'>
                        {/* ------------------------ */}

                        {activeSetting === 'Bookmark' &&
                            <div>
                                <div className='setting-title'>
                                    <h3>Bookmarks</h3>
                                </div>
                                <DisplayBookmarks />
                            </div>
                        }

                        {activeSetting === 'ImportExcel' &&
                            <div>
                                <div className='setting-title'>
                                    <h3>Import Excel to Access Database</h3>
                                </div>
                                <hr />
                                <div className=''>
                                    <div className='upload'>
                                        <div className='settings-title'>
                                            <b>Step 1:</b> Select the ".xlsx" file:
                                        </div>
                                        <div className='settings-value'>
                                            <input className='upload-btn' type="file" onChange={importFile} />
                                        </div>
                                        <div className='settings-title'>
                                            <b>Step 2:</b> Click the button to import data:
                                        </div>
                                        <div className='settings-value'>
                                            <div className='value-btn download' onClick={handleImport}>
                                                <HiOutlineArrowDownTray />
                                                <p>Import Data</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {importErrorMessage && (
                                    <p className='error-message settings'>*{importErrorMessage}</p>
                                )}
                            </div>

                        }

                        {activeSetting === 'Database' &&
                            <div>
                                <div className='setting-title'>
                                    <h3>Import new Database / Export Database</h3>
                                </div>
                                <hr />
                                <div className='database-container'>
                                    <div className='download'>
                                        <div className='settings-title'>
                                            Download Database:
                                        </div>
                                        <div className='settings-value'>
                                            <div className='value-btn download' onClick={handleDownload}>
                                                <HiOutlineArrowDownTray />
                                                <p>Download</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='upload'>
                                        <div className='settings-title'>
                                            Upload New Database:
                                        </div>
                                        <div className='settings-value'>
                                            <input type="file" onChange={handleFileUpload} />
                                        </div>
                                    </div>
                                </div>
                                {databaseErrorMessage && (
                                    <p className='error-message settings'>*{databaseErrorMessage}</p>
                                )}
                            </div>
                        }



                    </div>
                </div>
            </div>
        </div>

    )
}

export default Settings