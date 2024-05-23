import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";

const useListener = (userId, inviteCallback, onlineCallback) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const newSocket = openSocket();

    const handleDisconnect = () => {
      newSocket.close();
      setSocket(openSocket()); // Reconnect
    };
    const newSocket = io("http://localhost:8080");

    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("invite", inviteCallback);
    newSocket.on("online", onlineCallback);
    newSocket.emit("listen", JSON.stringify({ userId }));

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("invite", inviteCallback);
        newSocket.off("online", onlineCallback);
        newSocket.close();
      }
    };
  }, [userId, inviteCallback, onlineCallback]);

  return socket;
};

export default useListener;
