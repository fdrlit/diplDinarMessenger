import axios from 'axios';
import Cookies from 'js-cookie';
import React, { Component, useEffect, useRef, useState } from 'react';
import { BiSolidSend } from "react-icons/bi";
import config from '../../../config';
import { RxCross2 } from "react-icons/rx";
import './MiddleColumnFooter.scss'
import { BsReply } from "react-icons/bs";
import { BiWinkSmile } from "react-icons/bi";
import AttachFile from '../AttachFile/AttachFile';
import { FaRegFileLines } from "react-icons/fa6";

const MiddleColumnFooter = ({ receiveMessages, replyMessage, setReplyMessage, setUpdateList, updateList, selectedConversationId, scrollToBottom, scrollButtonVisible, addedFiles }) => {
    const [scrollVisible, setScrollVisible] = useState(false);
    const handleTextInputChange = (event) => {
        setTextMessage(event.target.value);
    }
    const inputMessageRef = useRef(null);
    const URL = config.apiUrl;
    const inputMessageContainerRef = useRef(null);
    const token = Cookies.get('login-token');
    const [textMessage, setTextMessage] = useState();
    const [replyMessageData, setReplyMessageData] = useState();
    const [files, setFiles] = useState([]);
    useEffect(() => {
        selectFile(addedFiles);
    }, [addedFiles]);

    const sendMessage = async () => {
        if ((!textMessage || !textMessage.trim()) && files.length === 0) return;
        var textMsg = textMessage.trim();
        if (!textMessage)
            textMsg = " ";
        try {
            let formData = new FormData();

            if (files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file.file);
                });
            }

            // Append other data to FormData object
            formData.append('RecipientId', selectedConversationId);
            formData.append('Message', textMsg);
            formData.append('RecipientType', 'User');
            formData.append('ReplyMessageId', replyMessage);
            let response = await axios.post(URL + '/api/message/send', 
                formData,
                {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                    }
                }
            );
          setTextMessage('');
          setScrollVisible(false);
          receiveMessages(0, 90);
          setUpdateList(!updateList);
          setReplyMessageData(null); 
          setReplyMessage(null)
          setFiles([]);
          // setUpdateList(false);
        } catch (error) {
          console.error(error)
        }
    }
    useEffect(() => {
        setTextMessage('');
    }, [selectedConversationId]);
    const handleKeyPress = (event) => {
        if (event.keyCode == 13 && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
    }
    useEffect(() => {
        if (!replyMessage) return;
        axios.get(URL + '/api/message/getMessageData?messageId='+replyMessage, 
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
          ).then(response => {
            console.log(response.data);
            setReplyMessageData(response.data);
          })
          .catch(e => console.error(e));
    }, [replyMessage]);
    useEffect(() => {
        if (inputMessageRef.current) {
            inputMessageRef.current.style.height = "0px";
            
            let scrollHeight = inputMessageRef.current.scrollHeight;
            if (scrollHeight >= 342) {
                scrollHeight = Math.min(scrollHeight, 342);
                setScrollVisible(true);
            } else {
                setScrollVisible(false);
            }
            
            if (!scrollButtonVisible) scrollToBottom();

            inputMessageRef.current.style.height = scrollHeight + "px";
            if (inputMessageContainerRef.current)
            inputMessageContainerRef.current.style.height = scrollHeight + "px";
        }
    }, [inputMessageRef, textMessage]);
    // useEffect(() => {
        
    //     const textarea = document.getElementById('editable-message-text');
    //     const otherInput = document.getElementById('input-search');

    //     function handleDocumentKeydown(event) {
    //         // Если нажата любая клавиша и textarea не в фокусе
    //         if (!textarea.contains(document.activeElement)) {
    //             if (event.target !== otherInput && !otherInput.contains(event.target)) {
    //                 // Если это не клавиша в otherInput, и textarea не в фокусе
    //                 if (!textarea.contains(document.activeElement)) {
    //                     // Фокусируемся на textarea
    //                     textarea.focus();
    //                 }
    //             }
    //         }
    //     }
    
    //     // Добавляем обработчик события keydown к документу
    //     document.addEventListener('keydown', handleDocumentKeydown);
    // }, []);
    
        // const formData = new FormData();
        // formData.append('file', selectedFile);
    
        // axios.post('http://your-backend-url/upload', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })
        // .then(response => {
        //   // Handle success, e.g. show a success message
        //   console.log('File uploaded successfully');
        // })
        // .catch(error => {
        //   // Handle error, e.g. show an error message
        //   console.error('Error uploading file:', error);
        // });
    const handlePaste = (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;

        // Проверяем, есть ли среди вставленных элементов изображение
        let hasImage = false;
        let imageIndex = -1;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            hasImage = true;
            imageIndex = i;
            break;
          }
        }
    
        // Если есть изображение, обрабатываем его
        if (hasImage) {
          const blob = items[imageIndex].getAsFile();
        //   setFile(blob);
        }
    }
    const byteToNormal = (size) => {
        const sizes = ['B', 'KB', 'MB'];
        if (size/1024 < 1) return size + ' B';
        if (size/1024/1024 < 1) return Math.round(size/1024, 2) + ' KB';
        return Math.round(size/1024/1024, 2) + ' MB';
    }
    const selectFile = (files_input) => {
        if (!Array.isArray(files_input[0])) {
            files_input = [files_input];
        }
        files_input = files_input[0]
        let selectedFiles = JSON.parse(JSON.stringify(files));
        for (let i = 0; i < files_input.length; i++) {
            let file = files_input[i];
            if (file.size/1024/1024 > 40) {
                alert('TOO LARGE');
                return;
            }
            if (files.find(x => x.fileName == file.name && x.fileSize == byteToNormal(file.size))) {

            }
            
            selectedFiles.push({
                'fileName': file.name,
                'fileSize': byteToNormal(file.size),
                'file': file
            })
        }
        setFiles(selectedFiles);
    }
    const removeFile = (file) => {
        let selectedFiles = JSON.parse(JSON.stringify(files));
        setFiles(selectedFiles.filter(item => item.fileName !== file.fileName && item.fileSize !== file.fileSize));
    }
    return (
        <div className='middle-column-footer'>
            <div  className='Composer mounted'>
                <div className='composer-wrapper'>
                    {replyMessageData && <div class="ComposerEmbeddedMessage opacity-transition fast open shown">
                        <div class="ComposerEmbeddedMessage_inner peer-color-4">
                            <div class="embedded-left-icon"><BsReply class="icon icon-reply" aria-hidden="true" /></div>
                            <div class="EmbeddedMessage inside-input peer-color-4">
                                <div class="message-text">
                                    <p class="embedded-text-wrapper"><span>{replyMessageData.messageData}</span></p>
                                    <div class="message-title"><span class="embedded-sender">{replyMessageData.senderUsername}</span></div>
                                </div>
                            </div><button onClick={() => { setReplyMessageData(null); setReplyMessage(null) }} type="button" class="Button embedded-cancel default translucent round faded" aria-label="Cancel"
                                title="Cancel"><RxCross2 class="icon icon-close" /></button>
                        </div>
                    </div>}
                    <div className='message-input-wrapper peer-color-0'>
                        <button type='button' className='Button symbol-menu-button default translucent round' title='Choose emoji'>
                            <BiWinkSmile className='icon icon-smile' />
                        </button>
                        
                        <div id="message-input-text">
                            <div className='files-container'>
                                {
                                    !!files && files.map((x, index) => (
                                        <div className='file'>
                                            <div className='fileIcon-container'>
                                                <FaRegFileLines className='icon icon-file'/>
                                            </div>
                                            <div className='fileName' dir='auto'>
                                                <p className='fileName-text' title={x.fileName}>
                                                    {x.fileName}
                                                </p></div>
                                            <div className='fileSize'>{x.fileSize}</div>
                                            <div className='separator'></div>
                                            <div className='fileRemove-container' onClick={() => removeFile(x)}>
                                                <RxCross2 className='icon icon-remove'/>
                                            </div>
                                        </div>
                                    ))
                                }    
                            </div>
                            <div ref={inputMessageContainerRef} style={{height: 56 + 'px'}} className={'custom-scroll input-scroller'}>
                                <div className='input-scroller-content'>
                                    <textarea  
                                        style={{height: 56 + 'px'}} 
                                        wrap="hard" 
                                        placeholder='Message' 
                                        ref={inputMessageRef} 
                                        id="editable-message-text" 
                                        value={textMessage} 
                                        autoComplete="off" 
                                        onKeyDown={handleKeyPress} 
                                        className={'form-control allow-selection' + (scrollVisible ? ' overflown' : '')} 
                                        onChange={handleTextInputChange} 
                                        role='textbox' 
                                        dir='auto' 
                                        tabIndex={0} 
                                        aria-label='Message'
                                        onPasteCapture={handlePaste}
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <AttachFile selectFile={selectFile} />
                    </div>
                </div>
                <button onClick={sendMessage} type="button" className="Button send main-button default secondary round click-allowed" aria-label="Send message" title="Send Message">
                    <BiSolidSend  className="icon icon-send"/>
                </button>
            </div>
        </div>
    );
}
export default MiddleColumnFooter;