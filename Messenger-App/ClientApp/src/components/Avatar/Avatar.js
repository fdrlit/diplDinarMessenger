import React from "react";
import './Avatar.scss';

const Avatar = ({img_url, userName}) => {
  return (
    <div className={`Avatar size-large ${!img_url ? ' no-photo' : ''}`}>
        <div className="inner">
            {img_url && <img src={img_url} className="Avatar__media avatar-media opacity-transition slow open shown" draggable="false" />}
            {!img_url && userName[0].toUpperCase() }
        </div>
    </div>
  );
}
export default Avatar;