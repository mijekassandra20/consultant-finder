import React, { useContext, useState } from 'react'
import axios from 'axios'

import { AppContext } from '../App';

// import css
import '../css/modal.css'

const CreateBookmark = ({ setOpenModal, handleCloseModal }) => {

    const {
        saveQuery, records
    } = useContext(AppContext);

    const [bookmarkTitle, setBookmarkTitle] = useState('')
    const [bookmarkDes, setBookmarkDes] = useState('')
    const [modalErrorMessage, setModalErrorMessage] = useState('')

    // post to backend
    const saveBookmark = async () => {
        try {

            if (bookmarkTitle.trim() === '') {
                setModalErrorMessage('Bookmark title is required.')
                return;
            }

            if (records.length === 0) {
                setModalErrorMessage(`No records were saved. Make sure to click 'FIND'`)
            } else {
                await axios.post('http://localhost:5000/api/record/bookmark', {
                    saveQuery: saveQuery,
                    bookmarkTitle: bookmarkTitle,
                    bookmarkDes: bookmarkDes
                });

                setOpenModal(false)
            }



        } catch (error) {
            setModalErrorMessage(error.response.data.message)
            console.log('error: ', error.response.data.message)
        }
    }

    const handleTitleChange = (event) => {
        setBookmarkTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setBookmarkDes(event.target.value);
    };


    return (
        <div className='modal-overlay'>
            <div className="modal-content">
                <h3>Add Bookmark</h3>
                <div className='modal-container'>
                    <div className='modal-input-container'>
                        <div className='modal-title'>
                            Title:
                        </div>
                        <input
                            className='input-container modal'
                            value={bookmarkTitle}
                            onChange={handleTitleChange}
                            required
                        />

                    </div>
                    <div className='modal-input-container'>
                        <div className='modal-title'>
                            Description:
                        </div>
                        <input
                            className='input-container modal'
                            value={bookmarkDes}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </div>

                <hr />
                {modalErrorMessage && (
                    <p className='error-message modal'>*{modalErrorMessage}</p>
                )}
                <div className='modal-buttons-container'>
                    <p className='cancel-button' onClick={handleCloseModal}>CANCEL</p>
                    <p className='save-button' onClick={() => saveBookmark()}
                    >SAVE</p>

                </div>

            </div>
        </div>
    )
}

export default CreateBookmark