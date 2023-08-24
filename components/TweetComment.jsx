import React from "react";

export default function TweetComment(props) {
  return (
    <div className="commentContainer">
      <textarea
        className="commentBox"
        placeholder="Add comment..."
        onChange={props.handleCommentChange}
        value={props.comment}
      ></textarea>
      <div className="btnCommentContainer">
        <button className="commentSubmitBtn" onClick={props.handleCommentSubmit}>Submit</button>
        <button className="commentCloseBtn" onClick={props.closeComment}>
          x
        </button>
      </div>
    </div>
  );
}
