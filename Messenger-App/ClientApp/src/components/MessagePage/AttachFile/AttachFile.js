import React, { Component, useEffect, useRef, useState } from 'react';
import { IoIosAttach } from "react-icons/io";

const AttachFile = ({ file, selectFile }) => {
    const fileInputRef = useRef(null);
    const handleAttachFile = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
            selectFile(event.target.files);
    };

    useEffect(() => {
        if (file)
            console.log(file);
    }, [file])
    
    return (
        <div className='AttachMenu'>
            <button 
                id="attach-menu-button" 
                type="button" 
                className="Button AttachMenu--button default translucent round" 
                aria-label="Add an attachment" 
                aria-controls="attach-menu-controls" 
                aria-haspopup="true" 
                title="Add an attachment"
                onClick={handleAttachFile}
            >
                <IoIosAttach class="icon icon-attach" aria-hidden="true" />
            </button>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
export default AttachFile;