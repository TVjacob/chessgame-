import axios from "axios";
import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  useMatch,
  useParams,
} from "react-router-dom";

import About from "./About.js";
import Alert from "./Alert.js";
import Campaign from "./Campaign.js";
import Game from "./Game.js";
import Header from "./Header.js";
import Home from "./Home.js";
import Live from "./Live.js";
import Profile from "./Profile.js";
import Replay from "./Replay.js";
import Users from "./Users.js";
import Register from "./Register";
import Login from "./Login.js";
import Play from "./Play.js";
import openSocket from "socket.io-client";
import useSocketListener from "../util/Listener.js"; // Import the custom hook

const App = () => {
  // const match = useMatch();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [user, setUser] = useState(null);
  const [knownUsers, setKnownUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [playerKeys, setPlayerKeys] = useState(null);
  const [error, setError] = useState(null);
  const [router, setRouter] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status
  const navigate = (url) => {
    window.location.href = url;
  };

  useEffect(() => {
    // Check if user data exists in local storage
    // if userData
    console.log("user");
    const userData = localStorage.getItem("userData");
    if (userData && userData !== "undefined") {
      console.log("user");
      setUser(JSON.parse(userData));
    }
  }, []);

  useSocketListener(
    user?.userId,
    () => loadMyInfo(),
    (data) => {
      const onlineUsersCopy = Object.keys(data.users);
      setKnownUsers({
        ...knownUsers,
        ...data.users,
      });
      setOnlineUsers(onlineUsersCopy);
    }
  );

  useEffect(
    () => {
      const loadMyInfo = () => {
        axios
          .get("/api/user/info", { withCredentials: true })
          .then((response) => {
            const data = response.data;
            if (data.loggedIn) {
              let knownUsersCopy = { ...knownUsers };
              knownUsersCopy[data.user.userId] = data.user;

              setUser(data.user);
              setKnownUsers(knownUsersCopy);

              // Set user properties for Amplitude
              // Replace this with your desired implementation
              // amplitude.getInstance().setUserId(data.user.userId);
              // amplitude.getInstance().setUserProperties({
              //     username: data.user.username,
              //     pictureUrl: data.user.pictureUrl,
              // });

              if (data.user.currentGame) {
                const { gameId, playerKey } = data.user.currentGame;
                setPlayerKeys(null);
                navigate(`/game/${gameId}?key=${playerKey}`);
              }
            }

            setCsrfToken(data.csrfToken);
            setInitialLoadDone(true);
          })
          .catch(() => setError("Error logging in."));
      };
    },
    []
    // [knownUsers, router, user]
  );

  const loginUser = (userData) => {
    // Persist user data to local storage
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const handleLogin = async (formData) => {
    // try {
    const response = await axios.post("/api/user/login", formData);
    const data = response.data;
    if (data.success) {
      console.log("am herre  ....");
      // Persist user data to local storage
      console.log(data.user);
      loginUser(data.user);

      let knownUsersCopy = { ...knownUsers };
      knownUsersCopy[data.user.userId] = data.user;

      setUser(data.user);
      setKnownUsers(knownUsersCopy);
      console.log("am down here...");
      if (data.user.currentGame) {
        console.log("current game....");
        const { gameId, playerKey } = data.user.currentGame;
        setPlayerKeys(null);
        navigate(`/game/${gameId}?key=${playerKey}`);
      } else {
        console.log("else ..current game....");
        navigate("/"); // Redirect user to dashboard
      }
    } else {
      setError(data.message);
    }
    // } catch (error) {
    //   console.error("Error logging in:", error);
    //   setError("An unexpected error occurred. Please try again later.");
    // }
  };
  const getRequest = (path, callback, errorCallback) => {
    axios
      .get("http://localhost:5000" + path, { withCredentials: true })
      .then(callback)
      .catch(errorCallback);
  };

  const postRequest = (path, data, callback, errorCallback) => {
    axios
      .post("http://localhost:5000" + path, data, {
        headers: {
          "content-type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true,
      })
      .then(callback)
      .catch(errorCallback);
  };

  const loadMyInfo = (callback) => {
    getRequest(
      "/api/user/info",
      (response) => {
        response.data;
        const data = response.data;
        if (data.loggedIn) {
          let knownUsersCopy = { ...knownUsers };
          knownUsersCopy[data.user.userId] = data.user;

          setUser(data.user);
          setKnownUsers(knownUsersCopy);

          // Set user properties for Amplitude
          // Replace this with your desired implementation
          // amplitude.getInstance().setUserId(data.user.userId);
          // amplitude.getInstance().setUserProperties({
          //     username: data.user.username,
          //     pictureUrl: data.user.pictureUrl,
          // });

          if (data.user.currentGame) {
            const { gameId, playerKey } = data.user.currentGame;
            setPlayerKeys(null);
            navigate(`/game/${gameId}?key=${playerKey}`);
          }
        }

        setCsrfToken(data.csrfToken);

        if (callback) {
          callback();
        }
      },
      () => setError("Error logging in.")
    );
  };

  const fetchUserInfo = (userIds, callback, knownUsers) => {
    // const { knownUsers } = state;

    userIds = userIds.filter((userId) => !(userId in knownUsers));
    if (userIds.length === 0) {
      callback();
      return;
    }

    const path =
      "/api/user/info?" +
      userIds.map((userId) => "userId=" + encodeURIComponent(userId)).join("&");
    getRequest(
      path,
      (response) => {
        response.json().then((data) => {
          setKnownUsers((prevKnownUsers) => ({
            ...prevKnownUsers,
            ...data.users,
          }));
          callback();
        });
      },
      () => {
        setError("Error fetching user information.");
        callback();
      }
    );
  };

  const updateUser = (username, callback) => {
    //   amplitude.getInstance().logEvent("Update User", {
    //     username,
    //   });

    postRequest(
      "/api/user/update",
      JSON.stringify({ username }),
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            setKnownUsers((prevKnownUsers) => ({
              ...prevKnownUsers,
              [data.user.userId]: data.user,
            }));
            setUser(data.user);
          } else {
            setError(data.message);
          }
          callback();
        });
      },
      () => {
        setError("Error updating user information.");
        callback();
      }
    );
  };

  const uploadProfilePic = (data, callback) => {
    amplitude.getInstance().logEvent("Upload Profile Pic");

    if (data.length > 1024 * 64) {
      setError("File is too large (max size 64KB).");
      callback();
      return;
    }

    postRequest(
      "/api/user/uploadPic",
      data,
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            setKnownUsers((prevKnownUsers) => ({
              ...prevKnownUsers,
              [data.user.userId]: data.user,
            }));
            setUser(data.user);
          } else {
            setError(data.message);
          }
          callback();
        });
      },
      () => {
        setError("Error uploading user pic.");
        callback();
      }
    );
  };

  const createNewGame = (speed, isBot, difficulty, username) => {
    //     amplitude.getInstance().logEvent("Create New Game", {
    //       speed,
    //       isBot,
    //       difficulty,
    //     });

    postRequest(
      "/api/game/new",
      JSON.stringify({
        speed,
        bots: isBot ? { 2: difficulty } : {},
        username,
      }),
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            setPlayerKeys(data.playerKeys);
            navigate(`/game/${data.gameId}?key=${data.playerKeys["1"]}`);
          } else {
            setError(data.message);
          }
        });
      },
      () => setError("Error creating new game.")
      // () => {
      // setError('Error uploading user pic.');
      // callback();
      // }
    );
  };

  const checkGame = (gameId) => {
    getRequest(
      `/api/game/check?gameId=${gameId}`,
      (response) => {
        response.json().then((data) => {
          if (!data.success) {
            // game did not exist, update user and go to home page
            setUser(data.user);
            navigate("/");
          }
        });
      },
      () => setError("Error checking game.")
    );
  };

  const inviteUser = (gameId, username, callback) => {
    //     amplitude.getInstance().logEvent("Invite User", {
    //       gameId,
    //       username,
    //     });

    postRequest(
      "/api/game/invite",
      JSON.stringify({ gameId, player: 2, username }),
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            callback();
          } else {
            this.setError(data.message);
          }
        });
      },
      () => {
        this.setError("Error inviting user.");
        callback();
      }
    );
  };

  const getUserGameHistory = (userId, offset, count, callback) => {
    getRequest(
      `/api/user/history?userId=${userId}&offset=${offset}&count=${count}`,
      (response) => {
        response.json().then((data) => {
          this.setState(
            {
              knownUsers: {
                ...this.state.knownUsers,
                ...data.users,
              },
            },
            () => {
              callback(data.history);
            }
          );
        });
      },
      () => {
        this.setError("Error fetching user game history.");
        callback();
      }
    );
  };

  const getLiveInfo = (callback) => {
    getRequest(
      "/api/live",
      (response) => {
        response.json().then((data) => {
          this.setState(
            {
              knownUsers: {
                ...this.state.knownUsers,
                ...data.users,
              },
            },
            () => {
              callback(data);
            }
          );
        });
      },
      () => {
        this.setError("Error fetching live info.");
        callback();
      }
    );
  };

  const startReplay = (historyId, callback) => {
    postRequest(
      "/api/game/startreplay",
      JSON.stringify({ historyId }),
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            callback(data);
          } else {
            this.setError(data.message);
          }
        });
      },
      () => {
        this.setError("Error starting replay.");
        callback();
      }
    );
  };

  const fetchCampaignInfo = (userId, callback) => {
    getRequest(
      `/api/user/campaign?userId=${userId}`,
      (response) => {
        response.json().then((data) => {
          callback(data);
        });
      },
      () => {
        this.setError("Error fetching campaign info.");
        callback();
      }
    );
  };

  const startCampaignLevel = (level) => {
    postRequest(
      "/api/game/startcampaign",
      JSON.stringify({ level }),
      (response) => {
        response.json().then((data) => {
          if (data.success) {
            this.navigate(`/game/${data.gameId}?key=${data.playerKeys["1"]}`);
          } else {
            this.setError(data.message);
          }
        });
      },
      () => {
        this.setError("Error starting campaign level.");
        // call
      }
    );
  };

  const logout = () => {
    postRequest(
      "/logout",
      "",
      (response) => {
        response.json().then(() => {
          this.navigate("/");
          window.location.reload();
        });
      },
      () => this.setError("Error logging out.")
    );
  };

  // Import useHistory from react-router-dom
  // import { useHistory } from "react-router-dom";

  const handleSignup = async (formData) => {
    // Get the history object
    // const history = useHistory();

    try {
      console.log(formData);
      const response = await axios.post("/api/user/signup", formData);
      const data = response.data;
      if (data.success) {
        // Registration successful, set isRegistered to true
        setIsRegistered(true);
        // Redirect to the login page (signin) upon successful registration
        navigate("/signin");
      } else {
        // Registration failed, display error message
        console.error("Error signing up:", data.message);
        // Handle error message display if needed
      }
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error message display if needed
    }
  };

  // const handleSignup = async (formData) => {
  //   try {
  //     const response = await axios.post("/api/user/signup", formData);
  //     const data = response.data;
  //     if (data.success) {
  //       // Registration successful, set isRegistered to true
  //       setIsRegistered(true);
  //     } else {
  //       // Registration failed, display error message
  //       console.error("Error signing up:", data.message);
  //       // Handle error message display if needed
  //     }
  //   } catch (error) {
  //     console.error("Error signing up:", error);
  //     // Handle error message display if needed
  //   }
  // };

  //   // Inside your component:
  //   // Inside your component:
  const updateError = (message) => {
    // Add a random id to the error so alert knows when it updated
    setError({
      message,
      id: Math.random(),
    });
  };
  const url = window.location.href;

  //   return <h1>helo..</h1>;
  // }
  return (
    <BrowserRouter ref={(router) => setRouter(router)}>
      <div className="base-layout">
        <div className="component-container">
          {!url.includes("signin") && (
            <Header user={user} router={router} logout={logout} />
          )}
          <Alert error={error} />
          <Users
            user={user}
            knownUsers={knownUsers}
            onlineUsers={onlineUsers}
            onOpen={() => {
              ping();
            }}
            createNewGame={createNewGame}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={<Home createNewGame={createNewGame} />}
            />
            <Route
              path="/live"
              element={
                <Live
                  user={user}
                  knownUsers={knownUsers}
                  getLiveInfo={getLiveInfo}
                  getRequest={getRequest}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/profile/:userId" element={<ProfileWrapper />} />

            <Route
              path="/game/:gameId"
              element={
                <Game
                  user={user}
                  checkGame={checkGame}
                  knownUsers={knownUsers}
                  fetchUserInfo={fetchUserInfo}
                  inviteUser={inviteUser}
                  playerKeys={playerKeys}
                  startCampaignLevel={startCampaignLevel}
                  // {...props}
                />
              }
            />
            <Route
              path="/replay/:historyId"
              element={
                <Replay
                  knownUsers={knownUsers}
                  fetchUserInfo={fetchUserInfo}
                  startReplay={startReplay}
                  // {...props}
                />
              }
            />
            <Route
              path="/campaign"
              element={
                <Campaign
                  user={user}
                  fetchCampaignInfo={fetchCampaignInfo}
                  startCampaignLevel={startCampaignLevel}
                />
              }
            />
            <Route
              path="/register"
              element={<Register onSignup={handleSignup} />}
            />
            <Route path="/signin" element={<Login onLogin={handleLogin} />} />
            <Route path="/play" element={<PlayRoute />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
const ProfileWrapper = () => {
  const match = useMatch();
  const { userId } = useParams();

  return (
    <Profile
      user={user}
      knownUsers={knownUsers}
      fetchUserInfo={fetchUserInfo}
      fetchCampaignInfo={fetchCampaignInfo}
      updateUser={updateUser}
      uploadProfilePic={uploadProfilePic}
      getUserGameHistory={getUserGameHistory}
      match={match} // Passing match explicitly
      // Pass other props as needed
    />
  );
};
export default App;
