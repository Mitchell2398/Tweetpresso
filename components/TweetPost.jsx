import React, { useState, useEffect } from "react";
import { db } from "../src/firebase";
import { auth } from "../src/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import TweetComment from "./TweetComment";

export default function TweetPost(props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [tweetCommentVis, setTweetCommentVis] = useState(false);
  const [comment, setComment] = useState("");
  const [commentArr, setCommentArr] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const tweetRef = doc(db, "tweets", props.tweetId);
  const userId = auth.currentUser.uid;

  

  const handleLikeCount = async () => {
    try {
      const tweetSnapshot = await getDoc(tweetRef);
      if (tweetSnapshot.exists()) {
        const tweetData = tweetSnapshot.data();
        const updatedLikes = tweetData.likes || {};

        if (liked) {
          delete updatedLikes[userId];
        } else {
          updatedLikes[userId] = true;
        }

        await updateDoc(tweetRef, {
          likes: updatedLikes,
        });

        setLikeCount(Object.keys(updatedLikes).length);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

// Fetch like data without dependency on handleLikeCount
useEffect(() => {
  async function fetchLikeData() {
    const tweetSnapshot = await getDoc(tweetRef);
    if (tweetSnapshot.exists()) {
      const tweetData = tweetSnapshot.data();
      if (tweetData.likes) {
        setLikeCount(Object.keys(tweetData.likes).length);
        setLiked(!!tweetData.likes[userId]);
        console.log("like data fetched");
      }
    }
  }
  fetchLikeData();
}, []);

// Update like count and state when liked state changes
useEffect(() => {
  async function updateLikeData() {
    const tweetSnapshot = await getDoc(tweetRef);
    if (tweetSnapshot.exists()) {
      const tweetData = tweetSnapshot.data();
      setLikeCount(Object.keys(tweetData.likes || {}).length);
    }
  }
  updateLikeData();
}, [liked]);

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  try {
    const tweetSnapshot = await getDoc(tweetRef);
    if (tweetSnapshot.exists()) {
      const tweetData = tweetSnapshot.data();
      const updatedComments = tweetData.comments || [];
      updatedComments.push({
        userName: props.userName,
        comment: comment,
      });

      await updateDoc(tweetRef, {
        comments: updatedComments,
      });

      setComment(""); // Clear the comment input after submission
      setTweetCommentVis(false);
      console.log("comment data uploaded");
    }
  } catch (error) {
    console.error("Error updating comments:", error);
  }
};

// Fetches comment data in real-time when comments change
useEffect(() => {
  const unsubscribe = onSnapshot(tweetRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const tweetData = docSnapshot.data();
      if (tweetData.comments) {
        setCommentCount(Object.keys(tweetData.comments).length);
        setCommentArr(tweetData.comments);
        console.log("comment data fetched in real-time");
      }
    }
  });

  // Unsubscribe from real-time updates when the component unmounts
  return () => {
    unsubscribe();
  };
}, []); 

  function handleCommentClick() {
    setTweetCommentVis(true);
  }

  function closeComment() {
    setTweetCommentVis(false);
  }

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  const date = props.timestamp ? props.timestamp.toDate() : null;

  const renderComments = commentArr.map((comment, index) => (
    <div className="comment" key={index}>
        <strong>{comment.userName}:</strong> {comment.comment}
    </div>
  ));

  return (
    <div className="tweetPostContainer">
      <div className="TopRowContainerTp">
        <img className="profileImgTp" src={props.profileImg}></img>
        <div className="textContainer">
          <p className="userName">
            {props.tweetAuthor} •{" "}
            <span className="date">{date && date.toLocaleDateString()}</span>
          </p>
          <div className="tweetPostText">{props.tweetData}</div>{" "}
        </div>
      </div>
      {props.tweetGif || props.imageUrl ? (
        <div className="uploadImgContainer">
          {props.tweetGif && (
            <img
              className="uploadImg"
              src={props.tweetGif}
              alt="Uploaded GIF"
            />
          )}
          {props.imageUrl && (
            <img
              className="uploadImg"
              src={props.imageUrl}
              alt="Uploaded Image"
            />
          )}
        </div>
      ) : null}
      {!tweetCommentVis ? (
        <div className="buttonContainerTp">
          <div className="likeContainer">
            <img
              src={
                liked ? "./src/assets/likedHeart.png" : "./src/assets/heart.png"
              }
              className="likeBtn"
              onClick={handleLikeCount}
            ></img>
            <p className="likeCount">{likeCount}</p>
          </div>
          <div className="commentBtnContainer">
          <img
            src="./src/assets/comment.png"
            onClick={handleCommentClick}
            className="commentBtn"
          ></img>
          <p className="commentCount">{commentCount}</p>
          </div>
        </div>
      ) : (
        <TweetComment
          closeComment={closeComment}
          handleCommentChange={handleCommentChange}
          comment={comment}
          handleCommentSubmit={handleCommentSubmit}
        />
      )}
      <div className="commentDisplay">{renderComments}</div>
    </div>
  );
}
