import React from "react";
import SetupPage from "/components/SetupPage";
import HomePage from "./HomePage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebase";

function App() {
  const [currentUser, setCurrentUser] = React.useState({});

  // Shows user name if logged in
  React.useEffect(() => {
    const manageCurrentUser = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
    });

    return () => manageCurrentUser();
  }, [currentUser]);

  function updateCurrentUser(user) {
    setCurrentUser(user);
  }

  return (
    <div>
      {currentUser ? (
        <HomePage
          currentUser={currentUser}
          updateCurrentUser={updateCurrentUser}
        />
      ) : (
        <SetupPage updateCurrentUser={updateCurrentUser} />
      )}
    </div>
  );
}

export default App;
