import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/";

export default function useSocketRoom(roomId, videoId, hasAccess, userName) {
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [admissionDenied, setAdmissionDenied] = useState(false);
  const [creationDenied, setCreationDenied] = useState(false);
  
  const [userCount, setUserCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [joinQueue, setJoinQueue] = useState([]);

  const socketRef = useRef(null);
  const player = useRef(null);
  const updating = useRef(false);
  const [shouldConnect, setShouldConnect] = useState(false);

  const joinRoom = () => {
    if (!roomId) return;
    setShouldConnect(true);
  };

  // --------------------------------------------------------
  // INITIALIZE & EVENTS
  // --------------------------------------------------------
  useEffect(() => {
    if (!shouldConnect) return;

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      // Name can be passed to show in waiting room
      socket.emit("join", { roomId, videoId, hasAccess, name: userName });
    });

    socket.on("room-creation-denied", () => {
      setCreationDenied(true);
      socket.disconnect();
    });

    socket.on("joined", (data) => {
      setIsJoined(true);
      setIsWaiting(false);
      setAdmissionDenied(false);
      setCreationDenied(false);

      if (data.hostId === socket.id) {
        setIsHost(true);
      }
      
      setUserCount((prev) => prev + 1); // self
    });

    socket.on("waiting-for-admission", () => {
      setIsWaiting(true);
    });

    socket.on("admission-accepted", (data) => {
      setIsWaiting(false);
      setIsJoined(true);
      if (data.hostId === socket.id) {
        setIsHost(true);
      }
      setUserCount((prev) => prev + 1);
    });

    socket.on("admission-denied", () => {
      setIsWaiting(false);
      setAdmissionDenied(true);
    });

    socket.on("peer-joined", () => {
      setUserCount((prev) => prev + 1);
    });

    socket.on("peer-left", () => {
      setUserCount((prev) => Math.max(0, prev - 1));
    });

    socket.on("host-changed", (data) => {
      if (data.hostId === socket.id) {
        setIsHost(true);
      }
    });

    // Host receives join requests
    socket.on("join-request", (request) => {
      setJoinQueue((prev) => [...prev, request]);
    });

    // Chat
    socket.on("chat", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    // Control sync
    socket.on("control", ({ payload }) => {
      if (!player.current) return;
      updating.current = true;

      if (payload.video && player.current.getVideoData().video_id !== payload.video) {
        player.current.loadVideoById(payload.video);
      }

      if (payload.state === 1) {
        player.current.mute(); // allow autoplay
        player.current.seekTo(payload.time, true);
        setTimeout(() => player.current.playVideo(), 50);
      } else if (payload.state === 2) {
        player.current.pauseVideo();
      }

      setTimeout(() => (updating.current = false), 300);
    });

    return () => {
      socket.disconnect();
    };
  }, [shouldConnect, roomId, videoId, hasAccess, userName]);

  // --------------------------------------------------------
  // HOST SENDS PLAYBACK EVENTS
  // --------------------------------------------------------
  const handlePlayerEvent = (event) => {
    if (!isHost) return;
    if (updating.current) return;
    if (!socketRef.current) return;

    socketRef.current.emit("control", {
      roomId,
      payload: {
        state: event.data,
        time: player.current.getCurrentTime(),
        video: videoId,
        timestamp: Date.now()
      }
    });
  };

  // --------------------------------------------------------
  // CHAT
  // --------------------------------------------------------
  const sendChat = (msg) => {
    if (!msg.trim() || !socketRef.current) return;
    socketRef.current.emit("chat", { text: msg, name: userName });
  };

  // --------------------------------------------------------
  // WAITING ROOM CONTROLS (Host Only)
  // --------------------------------------------------------
  const acceptUser = (socketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("admit-user", { targetSocketId: socketId, admit: true });
    setJoinQueue((prev) => prev.filter((r) => r.socketId !== socketId));
  };

  const denyUser = (socketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("admit-user", { targetSocketId: socketId, admit: false });
    setJoinQueue((prev) => prev.filter((r) => r.socketId !== socketId));
  };

  return {
    isJoined,
    isWaiting,
    admissionDenied,
    creationDenied,
    isHost,
    userCount,
    player,
    handlePlayerEvent,
    chatMessages,
    sendChat,
    joinQueue,
    joinRoom,
    acceptUser,
    denyUser,
  };
}
