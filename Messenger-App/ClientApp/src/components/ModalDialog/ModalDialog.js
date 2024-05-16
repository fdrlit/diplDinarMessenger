import React, { useState } from 'react'
import './ModalDialog.scss';
import { RxCross2 } from "react-icons/rx";

const ModalDialog = ({ modalTitle, modalMainContent, buttons, condensed }) => {

  return (
    <div className='Modal opacity-transition fast open shown'>
        <div className='modal-container'>
            <div className='modal-backdrop'></div>
            <div className='modal-dialog'>
                {condensed && 
                    <div className='modal-header-condensed'>
                        <button type='button' className='Button smaller translucent round' aria-label="Cancel attachments" title='Cancel attachments'>
                            <RxCross2 className='icon icon-close'/>
                        </button>
                    </div>
                }
                {!condensed && <div className='modal-header'>
                    <div className='modal-title'>{modalTitle}</div>
                </div>}
                <div className='modal-content custom-scroll'>
                    <p>{modalMainContent}</p>
                    <div className='dialog-buttons-column'>
                        {buttons && buttons.map(x => (
                            <button type='button modal-button' onClick={x.handleClick} className={`Button confirm-dialog-button default ${x.danger ? ' danger' : ''}`}>
                                {x.content}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
export default ModalDialog;