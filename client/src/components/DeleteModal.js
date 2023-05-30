import React from 'react'
import axios from 'axios'

// import css
import '../css/modal.css'

//import icons
import { IoWarning } from 'react-icons/io5'


const DeleteModal = ({ setConfirmModal, closeConfirmPopUp, selectedBookmark, fetchBookmarks }) => {

    const deleteBookmarked = async () => {

        try {

            await axios.post('http://localhost:5000/api/record/delete-bookmark', {
                selectedBookmark: selectedBookmark,
            });

            setConfirmModal(false)

            fetchBookmarks()


        } catch (error) {
            console.error('Error sending query:', error);
        }
    }

    return (
        <div className='modal-overlay'>
            <div className="modal-content">
                <div className='modal-header delete'>
                    <IoWarning className='delete-warning-icon' />
                    <h3 className='delete-warning'>Delete bookmark?</h3>

                </div>
                <div className='modal-container delete'>
                    <div className='delete-message'>
                        Are you sure you want to delete this bookmark? You can't undo this action.

                    </div>
                </div>

                <hr />
                <div className='modal-buttons-container'>
                    <p className='cancel-button delete'
                        onClick={() => closeConfirmPopUp()}
                    >CANCEL</p>
                    <p className='delete-button'
                        onClick={() => deleteBookmarked()}
                    >DELETE</p>

                </div>
            </div>
        </div>
    )
}

export default DeleteModal