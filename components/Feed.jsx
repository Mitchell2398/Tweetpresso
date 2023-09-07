import React, { useEffect, useState } from "react";
import TweetCreate from "./TweetCreate";
import TweetPost from "./TweetPost";
import { db } from "../src/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../src/firebase";
import {
  collection,
  serverTimestamp,
  addDoc,
  onSnapshot,
  query,
  doc,
  orderBy,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { v4 } from "uuid";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function Feed(props) {
  const tweetRef = collection(db, "tweets");
  const [tweetText, setTweetText] = useState("");
  const [tweetImg, setTweetImg] = useState("");
  const [preview, setPreview] = useState("");
  const [tweetGif, setTweetGif] = useState("");
  const [tweetsArray, setTweetsArray] = useState([]);
  const [isGifPopupVisible, setGifPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // For handling img preview and storage
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");

      return;
    }
    setTweetImg(file);
    setTweetGif("");
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (tweetImg) {
      setIsLoading(true);
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setPreview(result);
          setTweetGif("");
          setIsLoading(false);
        }
      };
      fileReader.readAsDataURL(tweetImg);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [tweetImg]);

  // Setting tweetGif state
  const handleGifSelect = (gifUrl) => {
    setTweetGif(gifUrl);
    setPreview("");
    setGifPopupVisible(false);
  };
  // Handling if gif menu is visable or not
  const handlePostGifClick = () => {
    setGifPopupVisible(!isGifPopupVisible);
    setPreview("");
  };

  // delete images / gifs
  const deleteUpload = () => {
    setPreview("");
    setTweetGif("");
  };
  // managing textarea value
  function handleChange(event) {
    setTweetText(event.target.value);
  }

  // Function that submits all data to databse and storage
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      if (tweetImg || tweetGif) {
        const filename = `${v4()}_${tweetImg.name}`;
        const storageRef = ref(storage, `tweet-images/${filename}`);
        await uploadBytes(storageRef, tweetImg);
        let imageUrl = await getDownloadURL(storageRef);

        await addDoc(tweetRef, {
          userName: props.profileData.userName,
          profileImg: props.profileData.profileImg
            ? props.profileData.profileImg
            : "https://firebasestorage.googleapis.com/v0/b/react-chat-app-7171d.appspot.com/o/profile-images%2FDefault_pfp.svg.png?alt=media&token=20dab1a3-1acd-479e-8c99-c76dd0782ff4",
          tweetText,
          tweetGif,
          imageUrl: tweetGif ? "" : imageUrl, // Use the obtained imageUrl
          timestamp: serverTimestamp(),
        });
      } else {
        await addDoc(tweetRef, {
          userName: props.profileData.userName,
          profileImg: props.profileData.profileImg
            ? props.profileData.profileImg
            : "https://firebasestorage.googleapis.com/v0/b/react-chat-app-7171d.appspot.com/o/profile-images%2FDefault_pfp.svg.png?alt=media&token=20dab1a3-1acd-479e-8c99-c76dd0782ff4",
          tweetText,
          tweetGif,
          imageUrl: "",
          timestamp: serverTimestamp(),
        });
      }

      // Clear form data
      setTweetText("");
      setPreview("");
      setTweetGif("");
      setTweetImg("");
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };

  // Fetch all existing tweets from Firestore collection
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const snapshot = await getDocs(
          query(tweetRef, orderBy("timestamp", "desc"))
        );
        let tweetData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort the tweetData array in descending order (newest first)
        tweetData.sort((a, b) => b.timestamp - a.timestamp);
        setTweetsArray(tweetData);
        console.log(tweetsArray);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets(); // Call fetchTweets once to fetch the initial tweets

    // Set up a real-time listener for new tweets
    const unsubscribe = onSnapshot(
      tweetRef, // No need for query here
      (snapshot) => {
        let tweetData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        tweetData.sort((a, b) => b.timestamp - a.timestamp);
        setTweetsArray(tweetData);
      },
      (error) => {
        console.error("Error listening for tweets:", error);
      }
    );

    // Clean up the real-time listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const renderTweets = tweetsArray.map((tweet) => (
    <TweetPost
      key={tweet.id}
      tweetId={tweet.id}
      tweetData={tweet.tweetText}
      userName={props.profileData.userName}
      tweetAuthor={tweet.userName}
      tweetGif={tweet.tweetGif}
      imageUrl={tweet.imageUrl}
      profileImg={tweet.profileImg}
      timestamp={tweet.timestamp}
    />
  ));

  return (
    <div className="feedContainer">
      <TweetCreate
        handleChange={handleChange}
        profileImg={props.profileData.profileImg}
        tweetText={tweetText}
        setTweetText={setTweetText}
        preview={preview}
        tweetGif={tweetGif}
        isLoading={isLoading}
        isGifPopupVisible={isGifPopupVisible}
        handleSubmit={handleSubmit}
        handleGifSelect={handleGifSelect}
        handlePostGifClick={handlePostGifClick}
        handleImgChange={handleImgChange}
        deleteUpload={deleteUpload}
      />

      {renderTweets}
    </div>
  );
}
