"use client";

import socketUrl from "@/config/socketUrl";
import {
  addNotification,
  startRinging,
  stopRinging,
} from "@/redux/features/notifications/notificationsSlice";
import { SocketUser } from "@/types";
import { getAccessToken } from "@/utils/authToken";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface iSocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[];
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  /* ────────── auth state ────────── */
  const { user } = useSelector((state: any) => state.auth);

  /* ────────── notifications state ────────── */
  const { isRinging } = useSelector((state: any) => state.notifications);

  /* ────────── socket state ────────── */
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

  /* ────────── bell audio ────────── */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ────────── create audio once ────────── */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/ball.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  /* ────────── connect socket when user ready ────────── */
  useEffect(() => {
    if (!user || !user._id) {
      dispatch(stopRinging());

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      return;
    }

    /* ────────── resolve token for socket auth ────────── */
    const accessToken = getAccessToken();

    /* ────────── socket debug ────────── */
    console.log("/* ────────── agent notification socket debug ────────── */");
    console.log("🌐 socket url:", socketUrl);
    console.log("🔐 socket token:", accessToken ? "FOUND" : "MISSING");
    console.log("👤 socket user:", String(user._id));

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });

    /* ────────── debug connect ────────── */
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);

      /* ────────── join personal room ────────── */
      newSocket.emit("join-room", String(user._id));

      /* ────────── join agent room ────────── */
      if (user?.role === "agent") {
        newSocket.emit("join-agent-room");
      }

      setSocket(newSocket);
      setIsSocketConnected(true);
    });

    /* ────────── debug connect error ────────── */
    newSocket.on("connect_error", (err: any) => {
      console.error("🔴 agent socket connect_error:", err?.message, err);
    });

    /* ────────── debug disconnect ────────── */
    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);

      dispatch(stopRinging());

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [user?._id, user?.role, dispatch]);

  /* ────────── play/pause sound based on isRinging ────────── */
  useEffect(() => {
    if (!audioRef.current) return;

    if (isRinging) {
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch(() => {
        /* ────────── autoplay blocked হলে ignore ────────── */
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isRinging]);

  /* ────────── socket listeners ────────── */
  useEffect(() => {
    if (!socket) return;

    const onUserNotification = (payload: any) => {
      const n = payload?.notification;

      if (n?._id) {
        dispatch(addNotification(n));

        if (!n?.is_read) dispatch(startRinging());

        toast.success(payload?.message || n?.title || "New notification");
      }
    };

    const onGetUsers = (users: SocketUser[]) => {
      setOnlineUsers(users);
    };

    socket.on("getUsers", onGetUsers);
    socket.on("user-notification", onUserNotification);

    return () => {
      socket.off("getUsers", onGetUsers);
      socket.off("user-notification", onUserNotification);
    };
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
