import { useEffect, useRef } from "react";
import openSocket from "socket.io-client";

const PING_INTERVAL = 1000 * 60 * 5; // 5 min

function useSocketListener(userId, inviteCallback, onlineCallback) {
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const destroyedRef = useRef(false);

  useEffect(() => {
    const connect = () => {
      const socket = openSocket();
      socketRef.current = socket;

      socket.on("disconnect", () => {
        if (!destroyedRef.current) {
          socket.close();
          connect();
        }
      });

      socket.on("invite", inviteCallback);
      socket.on("online", onlineCallback);

      socket.emit("listen", JSON.stringify({ userId: userId }));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        socket.emit("uping", JSON.stringify({ userId: userId }));
      }, PING_INTERVAL);
    };

    connect();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      destroyedRef.current = true;
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userId, inviteCallback, onlineCallback]);

  return socketRef.current;
}

export default useSocketListener;

// Listener.js

/// import openSocket from "socket.io-client";

// const PING_INTERVAL = 1000 * 60 * 5; // 5 min

// export default class Listener {
//   constructor(userId, inviteCallback, onlineCallback) {
//     this.userId = userId;
//     this.inviteCallback = inviteCallback;
//     this.onlineCallback = onlineCallback;

//     this.destroyed = false;

//     this.connect();
//   }

//   connect() {
//     this.socket = openSocket();
//     this.socket.on("disconnect", () => {
//       if (!this.destroyed) {
//         this.socket.close();
//         this.connect();
//       }
//     });

//     this.socket.on("invite", this.inviteCallback);
//     this.socket.on("online", this.onlineCallback);

//     this.socket.emit("listen", JSON.stringify({ userId: this.userId }));

//     if (this.interval) {
//       clearInterval(this.interval);
//     }

//     this.interval = setInterval(() => this.ping(), PING_INTERVAL);
//   }

//   ping() {
//     this.socket.emit("uping", JSON.stringify({ userId: this.userId }));
//   }

//   destroy() {
//     clearInterval(this.interval);

//     this.destroyed = true;
//     this.socket.close();
//   }
// }
