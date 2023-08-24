import { React, useState, useEffect } from "react";
import Header from "../components/Header";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../src/firebase";
import { v4 } from "uuid";
import { db } from "../src/firebase";
import Feed from "../components/Feed";
import UserProfile from "../components/UserProfile";


export default function HomePage(props) {
  const profileRef = collection(db, "profiles");
  const [isProfileVisable, setIsProfileVisable] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [profileImg, setProfileImg] = useState("")
  const [userUid, setUserUid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Log user out function
  const logOut = async () => {
    await signOut(auth);
    props.updateCurrentUser({});
    console.log(props.currentUser);
  };

  // Display user profile
  const handleOpenPu = () => {
    setIsProfileVisable(true);
  };

  const handleClosePu = () => {
    setIsProfileVisable(false);
  };
  // Disables scrolling when pop up is active
  useEffect(() => {
    if (isProfileVisable) {
      document.body.classList.add("disable-scroll");
    } else {
      document.body.classList.remove("disable-scroll");
    }
  }, [isProfileVisable]);

  // Fetches info from the profiles collection and sends to Header, userProfile and feed components
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchProfileInfo = async (uid) => {
    try {
      const userDocRef = doc(profileRef, uid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setProfileData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImgChangeAndSubmit = async (e) => {
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const file = e.target.files[0];

    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }

    try {
      setIsLoading(true);

      const filename = `${v4()}_${file.name}`;
      const storageRef = ref(storage, `profile-images/${filename}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(profileRef, userUid);
      await updateDoc(userDocRef, { profileImg: imageUrl });

      // Fetch updated profile info
      await fetchProfileInfo(userUid);

      setProfileImg(""); // Clear the profileImg state after successful upload
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userUid) {
      fetchProfileInfo(userUid);
    }
  }, [userUid]);

  

  return (
    <div>
      <Header handleOpenPu={handleOpenPu} profileData={profileData} />
      <div className={`darkOverlay ${isProfileVisable ? "active" : ""}`} />
      {isProfileVisable && (
        <UserProfile
          handleClosePu={handleClosePu}
          isProfileVisable={isProfileVisable}
          profileData={profileData}
          fetchProfileInfo={fetchProfileInfo}
          handleImgChangeAndSubmit={handleImgChangeAndSubmit}
          isLoading={isLoading}
        />
      )}
      <Feed profileData={profileData} logOut={logOut} />
    </div>
  );
}
