// src/hooks/useFirebaseRoom.js
import { useEffect, useRef, useState } from "react";
import { db } from "../helper/firebase";
import {
  ref,
  set,
  push,
  onValue,
  update,
  remove,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";

export default function useFirebaseRoom(roomId, videoId) {
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);

  const player = useRef(null);
  const updating = useRef(false);
  const initRef = useRef(false);

  const localUserId = useRef("user-" + Math.random().toString(36).slice(2, 9));

  // --------------------------------------------------------
  // JOIN ROOM
  // --------------------------------------------------------
  const joinRoom = async () => {
    if (!roomId || !videoId) return;
    if (initRef.current) return;
    initRef.current = true;

    const roomRef = ref(db, `rooms/${roomId}`);
    const usersRef = ref(db, `rooms/${roomId}/users`);

    // Listen once for users
    onValue(usersRef, (snap) => {
      const users = snap.val();

      // First user becomes HOST
      if (!users || !users.host) {
        update(usersRef, {
          host: localUserId.current,
          [localUserId.current]: true,
        });
        setIsHost(true);

        // Host deletes room on disconnect
        onDisconnect(roomRef).remove();
      } else {
        // Viewers
        const hostId = users.host;

        setIsHost(hostId === localUserId.current);

        update(usersRef, {
          [localUserId.current]: true,
        });

        // Viewers simply remove themselves from user list on disconnect
        onDisconnect(
          ref(db, `rooms/${roomId}/users/${localUserId.current}`)
        ).remove();
      }

      // Count users properly
      const updated = snap.val();
      if (updated) {
        const keys = Object.keys(updated).filter((k) => k !== "host");
        setUserCount(keys.length);
      }
    });

    // Chat listener
    onValue(ref(db, `rooms/${roomId}/chat`), (snap) => {
      const msgs = snap.val();
      setChatMessages(msgs ? Object.values(msgs) : []);
    });

    setIsJoined(true);
  };

  // --------------------------------------------------------
  // SYNC LISTENER (BOTH HOST & VIEWERS)
  // --------------------------------------------------------
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);

    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || !player.current) return;

      updating.current = true;

      // Fix video ID syncing
      if (data.video && player.current.getVideoData().video_id !== data.video) {
        player.current.loadVideoById(data.video);
      }

      // Sync playback
      if (data.state === 1) {
        player.current.mute(); // allow autoplay
        player.current.seekTo(data.time, true);
        setTimeout(() => player.current.playVideo(), 50);
      } else if (data.state === 2) {
        player.current.pauseVideo();
      }

      setTimeout(() => (updating.current = false), 300);
    });

    return () => unsub();
  }, [roomId]);

  // --------------------------------------------------------
  // HOST SENDS PLAYBACK EVENTS
  // --------------------------------------------------------
  const handlePlayerEvent = (event) => {
    if (!isHost) return;
    if (updating.current) return;

    set(ref(db, `rooms/${roomId}`), {
      state: event.data,
      time: player.current.getCurrentTime(),
      video: videoId,
      updatedAt: serverTimestamp(),
    });
  };

  // --------------------------------------------------------
  // CHAT
  // --------------------------------------------------------
  const sendChat = (msg) => {
    if (!msg.trim()) return;
    push(ref(db, `rooms/${roomId}/chat`), {
      text: msg,
      time: Date.now(),
    });
  };

  return {
    isJoined,
    isHost,
    userCount,
    player,
    joinRoom,
    handlePlayerEvent,
    chatMessages,
    sendChat,
  };
}
