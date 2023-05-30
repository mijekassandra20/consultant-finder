import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import axios from 'axios';

// import components
import DisplayRecord from './DisplayRecord';

// import css
import { IoMdTrash } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import DeleteModal from './DeleteModal';

const DisplayBookmarks = () => {

    const [bookmarkData, setBookmarkData] = useState([]);
    const [bookmarkModal, setBookmarkModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedBookmark, setSelectedBookmark] = useState('')
    const [findBookmark, setFindBookmark] = useState([])

    const {
        setRecords
    } = useContext(AppContext);


    const fetchBookmarks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/record/bookmark');
            setBookmarkData(response.data);

        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBookmarks();
    }, [])

    const confirmPopUp = async (selectedIndex) => {
        setConfirmModal(true)
        setSelectedBookmark(selectedIndex)
    }

    const closeConfirmPopUp = () => {
        setConfirmModal(false)

    }

    const findBookmarked = async (selectedIndex) => {
        const selectedBookmark = bookmarkData[selectedIndex];

        if (selectedBookmark) {
            const selectedQuery = selectedBookmark.Query;
            try {
                const response = await axios.post('http://localhost:5000/api/record/retrieve-bookmark', {
                    selectedQuery: selectedQuery
                });
                setRecords(response.data.getRecords) // data
                setBookmarkModal(true)
                setFindBookmark(selectedBookmark)

            } catch (error) {
                console.error('Error sending query:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setBookmarkModal(false);
        setRecords([])
    };

    return (
        <div className='bookmark-container'>
            {bookmarkData.length === 0 ? (
                <div className='empty-record'>
                    <p>There are no records to display.</p>
                </div>
            ) : (
                <div className='mapped-bookmarks'>
                    {bookmarkData.map((bookmark, index) => (
                        <div className='bookmark-wrapper' key={index}>
                            <div className='bookmark-content'>
                                <h3>{bookmark.Title}</h3>
                                <p className='bookmark-description'>{bookmark.Description}</p>
                                <p className='date'>{bookmark.Timestamp}</p>
                            </div>
                            <div className='bookmark-option'>
                                <IoMdTrash
                                    className='delete-icon'
                                    onClick={() => confirmPopUp(bookmark.Timestamp)}

                                />
                                <p
                                    className='find-button'
                                    onClick={() => findBookmarked(index)}
                                >
                                    FIND
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


            )}
            {bookmarkModal === true && (
                <div className='modal-overlay'>
                    <div className='modal-bookmark-container display-bookmark'>
                        <div className='modal-header'>
                            <div className='modal-details'>
                                <h3>{findBookmark.Title}</h3>
                                <p>{findBookmark.Description}</p>
                            </div>
                            <div className='modal-close-container'>
                                <MdClose className='modal-close-btn' onClick={handleCloseModal} />
                            </div>
                        </div>
                        <DisplayRecord
                        />
                    </div>
                </div>
            )}

            {confirmModal === true && (
                <DeleteModal
                    fetchBookmarks={fetchBookmarks}
                    closeConfirmPopUp={closeConfirmPopUp}
                    setConfirmModal={setConfirmModal}
                    selectedBookmark={selectedBookmark}
                    setSelectedBookmark={setSelectedBookmark}
                />
            )}

        </div>
    )
}

export default DisplayBookmarks