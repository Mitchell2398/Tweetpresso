import React, { useEffect, useState } from "react";


export default function Header(props) {


  
  return (
    <div className="headerContainer">
      <h1 className="logo">Tweetpresso</h1>
    
        <img
          onClick={props.handleOpenPu}
          src={props.profileData.profileImg}
          className="profileImg"
          alt="Profile"
        ></img>
     
    </div>
  );
}
