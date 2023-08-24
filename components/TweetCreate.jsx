import { React, useState, useEffect } from "react";
import GifPopup from "/components/GifPopup.jsx";
import ClipLoader from "react-spinners/ClipLoader";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function TweetCreate(props) {
  const [wordCount, setWordCount] = useState(150);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // managaing wordcount
  useEffect(() => {
    setWordCount(150 - props.tweetText.length);
  }, [props.handleChange]);

  // managing emojis
  const handleEmojiClick = (emoji) => {
    props.setTweetText(props.tweetText + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="tweetCreateContainer">
      <div className="topRowContainer">
        <div className="leftContainer">
          <img className="profileImg" src={props.profileImg}></img>
        </div>
        <textarea
          type="text"
          wrap="soft"
          maxLength="150"
          resize="none"
          placeholder="What's brewing?"
          className="tweetText"
          value={props.tweetText}
          onChange={props.handleChange}
        />

        {props.isGifPopupVisible && (
          <GifPopup onSelectGif={(gifUrl) => props.handleGifSelect(gifUrl)} />
        )}

        {showEmojiPicker && (
          <Picker data={data} onEmojiSelect={handleEmojiClick} />
        )}

        <div className="rightContainer">
          <p
            className="charLimit"
            style={{ color: wordCount <= 0 ? "red" : "lightgrey" }}
          >
            {wordCount}
          </p>
        </div>
      </div>
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
      {props.preview || props.tweetGif ? (
        <div className="uploadImgContainer">
          <div className="flexColContainer">
            <button className="closeImgBtn" onClick={props.deleteUpload}>
              X
            </button>

            {props.preview && (
              <img
                className="uploadImg"
                src={props.preview}
                alt="Uploaded Image"
              />
            )}

            {props.tweetGif && (
              <img
                className="uploadImg"
                src={props.tweetGif}
                alt="Uploaded GIF"
              />
            )}
          </div>
        </div>
      ) : null}
      <div className="bottomRowContainer">
        <div className="leftContainer">
          <label>
            <img className="tweetIcon postImg" src="./src/assets/img.png"></img>
            <input
              className="fileUpload"
              type="file"
              accept="image/*"
              onChange={props.handleImgChange}
              hidden
            />
          </label>
          <img
            className="tweetIcon postGif"
            src="./src/assets/gif.png"
            onClick={props.handlePostGifClick}
          ></img>
          <img
            className="tweetIcon postEmoji"
            src="./src/assets/smiley.png"
            onClick={() => setShowEmojiPicker((prevState) => !prevState)}
          ></img>
        </div>
        <button className="postBtn" onClick={props.handleSubmit}>
          Post
        </button>
      </div>
    </div>
  );
}
