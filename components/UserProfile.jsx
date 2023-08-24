import { React, useState, useEffect } from "react";
import { auth } from "../src/firebase";
import { signOut } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";



export default function UserProfile(props) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`userProfilePuContainer ${
        props.isProfileVisable ? "active" : ""
      }`}
    >
      <div className="puWrapper" >
      
        <div className="popUpHeader">
          <div onClick={props.handleClosePu} className="arrow"></div>
          <button className="backButton" onClick={props.handleClosePu}>
            Back to brewing
          </button>
        </div>
        <h2>Account details</h2>
        {props.isLoading && (
        <ClipLoader
          className="loader"
          color="gray"
          loading={props.isLoading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
        <img src={props.profileData.profileImg} className="profileImgPu" />
        <label>
          <p className="changeProfileImg">Change profile Image</p>
          <input
            className="fileUpload"
            type="file"
            accept="image/*"
            onChange={props.handleImgChangeAndSubmit}
            hidden
          />
        </label>
        <p className="profileInfo name">
          <strong>Username: </strong>
          {props.profileData.userName}
        </p>
        <p className="profileInfo email">
          <strong>Email: </strong>
          {props.profileData.email}
        </p>
        <p className="profileInfo password">
          <strong>Password: </strong>
          {props.profileData.password}
        </p>
        <button className="signOutBtn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
