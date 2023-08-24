import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../src/firebase";
import { db } from "../src/firebase";
import { storage } from "../src/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";


function setupPage({ updateCurrentUser }) {
  // State to manage the register / sign up of usersa
  const profileRef = collection(db, "profiles");
  const [registerUser, setRegisterUser] = React.useState({
    userName: "",
    email: "",
    password: "",
  });
  const [signInUser, setSignInUser] = React.useState({
    email: "",
    password: "",
  });
  // State for managing current user

  // State that allows users to render either register or sign up page
  const [renderRegisterUser, setRenderRegisterUser] = React.useState(true);
  // State for managing error
  const [errorMessage, setErrorMessage] = React.useState(null);

  // Update current user in App.js
  function handleSuccessfulLogin(user) {
    updateCurrentUser(user);
  }

  const register = async () => {
    const profileDefaultImg = ref(
      storage,
      `profile-images/Default_pfp.svg.png`
    );
    const imageUrl = await getDownloadURL(profileDefaultImg);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerUser.email,
        registerUser.password
      );
      const user = userCredential.user;
      handleSuccessfulLogin(user);

      // Use the same UID as the document ID
      const userDocRef = doc(profileRef, user.uid);

      await setDoc(userDocRef, {
        userName: registerUser.userName,
        profileImg: imageUrl,
        email: registerUser.email,
        password: registerUser.password,
      });
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error);
    }
  };

  // Register / sign in with Google
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Assuming you have a reference to the Firestore collection
      const userDocRef = doc(profileRef, user.uid);

      // Use the same UID as the document ID
      await setDoc(userDocRef, {
        userName: user.displayName,
        profileImg: user.photoURL,
        email: user.email,
      });

      handleSuccessfulLogin(user);
      console.log(user);
    } catch (error) {
      // Handle Errors here.
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      const email = error.customData?.email;
    }
  }

  // Sign user in function
  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        signInUser.email,
        signInUser.password
      );
      handleSuccessfulLogin(user);
      console.log(user);
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error);
    }
  };

  // Function allowing user to swap between sign in / register page

  const renderSignUp = () => {
    setRenderRegisterUser(true);
  };

  const renderSignIn = () => {
    setRenderRegisterUser(false);
  };

  return (
    <div>
    <div className="setupHeader">
      <h1 className="logo">Tweetpresso</h1>
      </div>
    <div className="setupPageContainer ">
      
      <div className="backgroundSvg ">
      <svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  x="0px"
  y="0px"
  width="100%"
  height="100%"
  viewBox="0 0 1600 900"
  preserveAspectRatio="xMidYMax slice"
>
  <defs>
    <linearGradient id="bg">
      <stop offset="0%" stopColor="#d1a88f" />
      <stop offset="50%" stopColor="#f4e1c1" />
      <stop offset="100%" stopColor="#d1a88f" />
    </linearGradient>
    <path
      id="wave"
      fill="url(#bg)"
      d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
  s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
    />
  </defs>
  <g>
    <use xlinkHref="#wave" opacity=".3">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        dur="10s"
        calcMode="spline"
        values="270 230; -334 180; 270 230"
        keyTimes="0; .5; 1"
        keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
        repeatCount="indefinite"
      />
    </use>
    <use xlinkHref="#wave" opacity=".6">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        dur="8s"
        calcMode="spline"
        values="-270 230;243 220;-270 230"
        keyTimes="0; .6; 1"
        keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
        repeatCount="indefinite"
      />
    </use>
    <use xlinkHref="#wave" opacity=".9">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        dur="6s"
        calcMode="spline"
        values="0 230;-140 200;0 230"
        keyTimes="0; .4; 1"
        keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
        repeatCount="indefinite"
      />
    </use>
  </g>
</svg>;
      </div>
      {renderRegisterUser ? (
        <>
          <div className="registerContainer">
            <h1 className="formH1">Create an Account</h1>
            <input
              placeholder="Username"
              onChange={(event) =>
                setRegisterUser((prevData) => ({
                  ...prevData,
                  userName: event.target.value,
                }))
              }
            />
            <input
              placeholder="Email"
              onChange={(event) =>
                setRegisterUser((prevData) => ({
                  ...prevData,
                  email: event.target.value,
                }))
              }
            />
            <input
              placeholder="Password"
              onChange={(event) =>
                setRegisterUser((prevData) => ({
                  ...prevData,
                  password: event.target.value,
                }))
              }
            />

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <div className="providersContainer">
              <button className="formBtn" onClick={register}>
                Register
              </button>

              <img
                src="../src/assets/icons8-google-60.png"
                className="icon"
                onClick={signInWithGoogle}
              />
            </div>
            <p>
              Already have an account?{" "}
              <span className="signSpan" onClick={renderSignIn}>
                Sign In
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="signInContainer">
            <h1 className="formH1">Sign in</h1>
            <input
              placeholder="Email"
              onChange={(event) =>
                setSignInUser((prevData) => ({
                  ...prevData,
                  email: event.target.value,
                }))
              }
            />
            <input
              placeholder="Password"
              onChange={(event) =>
                setSignInUser((prevData) => ({
                  ...prevData,
                  password: event.target.value,
                }))
              }
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            <div className="providersContainer">
              <button className="formBtn" onClick={signIn}>
                Sign In
              </button>

              <img
                src="../src/assets/icons8-google-60.png"
                className="icon"
                onClick={signInWithGoogle}
              />
            </div>
            <p>
              Don't have an account?{" "}
              <span className="signSpan" onClick={renderSignUp}>
                Sign Up
              </span>
            </p>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default setupPage;
