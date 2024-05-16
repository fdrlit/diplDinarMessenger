import React, { useEffect } from 'react';
import { isLink } from '../../../../searchDomains';
import { formatDateToHours } from '../../../../middleware/dateFormat';
import { PiCheckBold, PiChecksBold } from "react-icons/pi";
import { FaRegFileLines } from "react-icons/fa6";
import config from '../../../../config';

const MessageListItem = ({ messageData, handleContextMenu, setReplyMessage, leftMouseButtonPressed }) => {
    const FileURL = config.fileServerUrl;
    const scrollIntoView = (messageId) => {
        const element = document.getElementById(`message-${messageId}`);
        if (!element) return;
        element.classList.add('has-menu-open');
        const elementRect = element.getBoundingClientRect();
        const isVisible =
            elementRect.top >= 0 &&
            elementRect.left >= 0 &&
            elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            elementRect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (!isVisible) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setTimeout(() => element.classList.remove('has-menu-open'), 3500);
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const byteToNormal = (size) => {
        const sizes = ['B', 'KB', 'MB'];
        if (size/1024 < 1) return size + ' B';
        if (size/1024/1024 < 1) return Math.round(size/1024, 2) + ' KB';
        return Math.round(size/1024/1024, 2) + ' MB';
    }
    return (
        <div id={`message-${messageData.Id}`} onDoubleClick={() => setReplyMessage(messageData.Id)} onContextMenu={handleContextMenu(messageData.Id)} className={"Message message-list-item allow-selection open shown " + (messageData.SentByUser ? "own" : "")}>
            <div className='bottom-marker' data-message-id={messageData.Id}>
            </div>
            <div className='message-select-control'>
            </div>
            <div className="message-content-wrapper can-select-text">
                <div className={'message-content ' + (messageData.SentByUser ? "peer-color-1" : "peer-color-count-0") + ' text-has-shadow has-solid-background'} dir="auto">
                    {messageData.ReplyMessage[0] && <div onClick={() => scrollIntoView(messageData.ReplyMessage[0].MessageId)} className='message-subheader'>
                        <div className={`EmbeddedMessage ${messageData.SentByUser ? "" : "peer-color-0"}`}>
                            <div className='message-text'>
                                <p className='embedded-text-wrapper'>
                                    <span>{messageData.ReplyMessage[0].MessageData}</span>
                                </p>
                                <div className='message-title'>
                                    <span className='embedded-sender'>
                                        {messageData.ReplyMessage[0].UserName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>}
                <div className="content-inner" dir='auto'>
                    {
                        !!messageData.Files && messageData.Files.map(file => (
                            <a href={`${FileURL}/getFile?fileHash=${file.hash}`}>
                                <div className='File interactive'>
                                    <div className='file-icon-container'>
                                        <FaRegFileLines className='file-icon default'/>
                                    </div>
                                    <div className='file-info'>
                                        <div className='file-title' dir='auto' title={file.fileName}>
                                                {file.fileName}
                                        </div>
                                        <div className='file-subtitle' dir='auto'>
                                            <span>{byteToNormal(file.fileSize)}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                    
                    <div className='text-content clearfix with-meta' dir="auto">
                        <text id={`message-${messageData.Id}-inner`}>
                        {
                            messageData.Text.map(str => (
                                (urlRegex.test(str) ? (<a href={str} target="_blank">{str}</a>) : isLink(str) ? (<a href={`https://${str}`} target="_blank">{str}</a>) : str)
                            ))
                        }
                        </text>
                        <span className="MessageMeta" dir="ltr">
                            <span className="message-time">{formatDateToHours(new Date(Date.parse(messageData.CreateDate)))}</span>
                            {messageData.SentByUser && <div className='MessageOutgoingStatus'>
                                <div  className='Transition'>
                                <div className='Transition_slide Transition_slide-active'>
                                    {messageData.ReadStatus ? <PiChecksBold className='icon icon-message-read' /> : <PiCheckBold className='icon icon-message-read' />}
                                </div>
                                </div>
                            </div>}
                        </span>
                    </div>
                    
                </div>
                
            </div>
            </div>
            </div>
    );
}
export default MessageListItem;