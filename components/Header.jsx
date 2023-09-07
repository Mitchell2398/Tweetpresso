import React, { useEffect, useState } from "react";

export default function Header(props) {
  return (
    <div className="headerContainer">
      <h1 className="logo">Tweetpresso</h1>

      <img
        onClick={props.handleOpenPu}
        src={
          props.profileData.profileImg
            ? props.profileData.profileImg
            : "https://firebasestorage.googleapis.com/v0/b/react-chat-app-7171d.appspot.com/o/profile-images%2FDefault_pfp.svg.png?alt=media&token=20dab1a3-1acd-479e-8c99-c76dd0782ff4"
        }
        className="profileImg"
        alt="Profile"
      ></img>
    </div>
  );
}
