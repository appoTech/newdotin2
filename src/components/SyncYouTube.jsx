import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Bell,
  CheckCircle2,
  Clapperboard,
  Compass,
  Copy,
  DoorOpen,
  Gamepad2,
  Headphones,
  Home,
  Hourglass,
  LogOut,
  House,
  MessageCircle,
  Mic2,
  Play,
  PlayCircle,
  Radio,
  Send,
  Sparkles,
  Star,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import PaidScreeningModal from "./PaidScreeningModal";
import "./SyncYouTube.css";

const DEFAULT_SERVER = process.env.REACT_APP_API_URL || "http://localhost:5001/";

function maskPhone(value) {
  const text = String(value || "");
  const digits = text.replace(/\D/g, "");

  if (digits.length < 7) return text;

  return `${digits.slice(0, 2)}${"*".repeat(Math.max(3, digits.length - 4))}${digits.slice(-2)}`;
}

function formatElapsed(timestamp) {
  if (!timestamp) return "Requested just now";
  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `Requested ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Requested ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `Requested ${hours}h ago`;
}

function getDisplayTitle(videoId) {
  if (!videoId) return "Imagine Dragons — Believer";
  return `Now Playing — ${videoId}`;
}

function getDisplaySubtitle(videoId) {
  if (!videoId) return "Paste a link or video id to lock the screening room.";
  return `Locked to video id ${videoId}`;
}

function getSeatLabel(index) {
  const labels = ["A1", "A2", "DIRECTOR", "A3", "A4", "B1", "B2", "B3"];
  return labels[index] || `B${index - 4}`;
}

function useSocket(serverUrl) {
  const socketRef = useRef(null);

  function connect() {
    if (socketRef.current) return socketRef.current;
    socketRef.current = io(serverUrl, { transports: ["websocket"] });
    return socketRef.current;
  }

  function disconnect() {
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch (error) {}
      socketRef.current = null;
    }
  }

  return { connect, disconnect, socketRef };
}

export default function SyncYouTubePage(props) {
  const history = useHistory();
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const urlRoom = urlParams.get("roomId") || "";
  const urlVideo = props.match.params.id || "";

  const [serverUrl] = useState(DEFAULT_SERVER);
  const serverBase = serverUrl.endsWith("/") ? serverUrl : `${serverUrl}/`;
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [hostKey, setHostKey] = useState(() => {
    if (!urlRoom) return "";
    return localStorage.getItem(`syncwatch_host_key_${urlRoom}`) || "";
  });
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  async function authenticateUser() {
    if (!phone) {
      alert("Enter phone number");
      return false;
    }

    try {
      const res = await fetch(`${serverBase}auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!data.token) throw new Error("No token");

      setToken(data.token);
      return data.token;
    } catch (err) {
      console.error(err);
      alert("Auth failed");
      return false;
    }
  }

  const [creatorVideoId, setCreatorVideoId] = useState(urlVideo || "");
  const [inviteCreated, setInviteCreated] = useState(!!(urlRoom && urlVideo));
  const [inviteUrl, setInviteUrl] = useState(() => {
    if (urlRoom && urlVideo) {
      return `${window.location.origin}${window.location.pathname}?roomId=${encodeURIComponent(
        urlRoom
      )}&videoId=${encodeURIComponent(urlVideo)}`;
    }
    return "";
  });

  const [roomId, setRoomId] = useState(urlRoom || "");
  const [videoId, setVideoId] = useState(urlVideo || creatorVideoId);
  const [joined, setJoined] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const { connect, disconnect, socketRef } = useSocket(serverUrl);
  const playerRef = useRef(null);
  const playerReady = useRef(false);

  const [clientId, setClientId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const clientIdRef = useRef(null);
  const hostIdRef = useRef(null);

  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    hostIdRef.current = hostId;
  }, [hostId]);

  const [joinRequests, setJoinRequests] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showChat]);
  const [latencyMs, setLatencyMs] = useState(0);
  const rttHistory = useRef([]);
  const pingIntervalRef = useRef(null);
  const applyingRemoteRef = useRef(false);
  const DRIFT_THRESHOLD = 0.6;

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.disconnect();
        } catch (error) {}
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {}
      }
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, [socketRef]);

  function ensureYouTubeApi(cb) {
    if (window.YT && window.YT.Player) return cb();
    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      window.onYouTubeIframeAPIReady = () => cb();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => cb();
  }

  function initPlayer() {
    if (playerRef.current || !window.YT) return;
    playerRef.current = new window.YT.Player("yt-player", {
      height: "100%",
      width: "100%",
      videoId,
      playerVars: { controls: 0, rel: 0, modestbranding: 1, playsinline: 1 },
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
    });
  }

  function onPlayerReady() {
    playerReady.current = true;
  }

  useEffect(() => {
    if (!playerRef.current || !playerReady.current) return;
    try {
      playerRef.current.loadVideoById(videoId);
    } catch (error) {
      console.warn("Failed to load new video", error);
    }
  }, [videoId]);

  async function handleCreateOrder(formData) {
    try {
      const rid = cryptoRandomId();
      setPhone(formData.customer_phone);
      setToken("");

      const res = await fetch(`${serverBase}payment/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          roomId: rid,
          videoId: creatorVideoId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.payment_session_id || !data.order_id) {
        throw new Error("Payment init failed");
      }

      if (data.host_key) {
        setHostKey(data.host_key);
        localStorage.setItem(`syncwatch_host_key_${rid}`, data.host_key);
      }

      const cashfree = new window.Cashfree({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      const verifyRes = await fetch(`${serverBase}payment/verify/${data.order_id}`);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || verifyData.order_status !== "PAID") {
        throw new Error("Payment not completed");
      }

      const vid = (creatorVideoId || "").trim();

      setRoomId(rid);
      setVideoId(vid);

      const url = `${window.location.origin}${window.location.pathname}?roomId=${rid}&videoId=${vid}`;

      setInviteUrl(url);
      setInviteCreated(true);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function joinRoom() {
    let rid = roomId;
    if (!rid) {
      const q = new URLSearchParams(window.location.search);
      rid = q.get("roomId") || "";
      if (!rid) return alert("No room to join");
      setRoomId(rid);
    }

    const socket = connect();

    const emitJoin = async () => {
      const tkn = await authenticateUser();
      if (!tkn) return;
      socket.emit("join", {
        roomId: rid,
        videoId,
        token: tkn,
        name: phone,
        hostKey: hostKey || localStorage.getItem(`syncwatch_host_key_${rid}`) || "",
      });
      measurePing();
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(measurePing, 3000);
    };

    if (!socket._syncListenersAttached) {
      socket._syncListenersAttached = true;

      socket.on("connect", emitJoin);

      socket.on(
        "joined",
        ({ clientId: cid, userId, hostId: hid, videoId: serverVideoId }) => {
          const localId = cid || userId;
          setClientId(localId);
          clientIdRef.current = localId;
          setHostId(hid);
          hostIdRef.current = hid;

          if (serverVideoId && serverVideoId !== videoId) {
            setVideoId(serverVideoId);
          }

          ensureYouTubeApi(() => initPlayer());
          setJoined(true);
          setCopyStatus("Joined!");
          setTimeout(() => setCopyStatus(""), 2000);
        }
      );

      socket.on(
        "admission-accepted",
        ({ clientId: cid, userId, hostId: hid, videoId: serverVideoId }) => {
          const localId = cid || userId;
          setClientId(localId);
          clientIdRef.current = localId;
          setHostId(hid);
          hostIdRef.current = hid;

          if (serverVideoId && serverVideoId !== videoId) {
            setVideoId(serverVideoId);
          }

          ensureYouTubeApi(() => initPlayer());
          setJoined(true);
          setCopyStatus("Admission accepted");
          setTimeout(() => setCopyStatus(""), 2000);
        }
      );

      socket.on("waiting-for-admission", () => {
        setCopyStatus("Waiting for host approval");
      });

      socket.on("admission-denied", () => {
        setCopyStatus("Admission denied");
      });

      socket.on("room-closed", () => {
        setCopyStatus("Room closed by host");
        leaveRoom();
      });

      socket.on("kicked", () => {
        setCopyStatus("Removed from room");
        leaveRoom();
      });

      socket.on("error", (message) => {
        setCopyStatus(typeof message === "string" ? message : "Socket error");
      });

      socket.on("not-authorized", () => {
        setCopyStatus("Only the host can control playback");
      });

      socket.on("host-changed", ({ hostId: hid }) => {
        setHostId(hid);
        hostIdRef.current = hid;
        setJoinRequests([]);
      });

      socket.on("peer-left", () => {});
      socket.on("peer-joined", () => {});

      socket.on("room-users", ({ users = [] }) => {
        setRoomUsers(users);
      });

      socket.on("chat", (message) => {
        setChatMessages((prev) => [...prev, message].slice(-80));
      });

      socket.on("control", ({ from, payload }) => {
        if (from === clientIdRef.current) return;
        applyRemoteControl(payload);
      });

      socket.on("join-request", ({ userId, name }) => {
        setJoinRequests((prev) => {
          if (prev.find((request) => request.userId === userId)) return prev;
          return [...prev, { userId, name: name || userId, ts: Date.now() }];
        });
      });

      socket.on("disconnect", () => {
        setJoined(false);
        setJoinRequests([]);
        setRoomUsers([]);
        setHostId(null);
        setClientId(null);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      });
    }

    if (socket.connected) {
      emitJoin();
    }
  }

  function leaveRoom() {
    try {
      socketRef.current?.emit("leave", { roomId });
    } catch (error) {}
    disconnect();
    setJoined(false);
    setJoinRequests([]);
    setRoomUsers([]);
    setChatMessages([]);
    setChatText("");
    setHostId(null);
    setClientId(null);

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (error) {}
      playerRef.current = null;
    }

    window.history.replaceState({}, "", `${window.location.pathname}`);
  }

  function measurePing() {
    if (!socketRef.current || socketRef.current.disconnected) return;
    const t0 = Date.now();
    socketRef.current.timeout(2000).emit("ping-client", null, () => {
      const t1 = Date.now();
      const rtt = t1 - t0;
      rttHistory.current.push(rtt);
      if (rttHistory.current.length > 12) rttHistory.current.shift();
      const avg =
        rttHistory.current.reduce((total, value) => total + value, 0) /
        rttHistory.current.length;
      setLatencyMs(Math.round(avg / 2));
    });
  }

  function onPlayerStateChange(event) {
    if (!playerReady.current) return;
    if (applyingRemoteRef.current) return;

    const isHost = clientIdRef.current && hostIdRef.current === clientIdRef.current;
    if (!isHost) return;

    const state = event.data;
    const ct = playerRef.current.getCurrentTime();

    if (state === window.YT.PlayerState.PLAYING) {
      sendControl({ type: "play", currentTime: ct });
    } else if (state === window.YT.PlayerState.PAUSED) {
      sendControl({ type: "pause", currentTime: ct });
    } else if (state === window.YT.PlayerState.ENDED) {
      sendControl({ type: "ended", currentTime: ct });
    }
  }

  function sendControl(payload) {
    payload.timestamp = Date.now();
    socketRef.current?.emit("control", { roomId, payload });
  }

  function applyRemoteControl(payload) {
    if (!playerReady.current) return;
    const now = Date.now();
    const intended = payload.timestamp || now;
    const delayMs = Math.max(0, intended + latencyMs - now);
    const targetTime = (payload.currentTime || 0) + delayMs / 1000;

    setTimeout(() => {
      applyingRemoteRef.current = true;
      try {
        const drift = Math.abs(playerRef.current.getCurrentTime() - targetTime);

        if (payload.type === "play") {
          if (drift > DRIFT_THRESHOLD) playerRef.current.seekTo(targetTime, true);
          playerRef.current.playVideo();
        } else if (payload.type === "pause") {
          if (drift > DRIFT_THRESHOLD) playerRef.current.seekTo(targetTime, true);
          playerRef.current.pauseVideo();
        } else if (payload.type === "seek") {
          playerRef.current.seekTo(targetTime, true);
        }
      } finally {
        setTimeout(() => {
          applyingRemoteRef.current = false;
        }, 200);
      }
    }, delayMs);
  }

  function amIHost() {
    return clientId && hostId && clientId === hostId;
  }

  function localPlay() {
    if (!playerReady.current) return;
    const t = playerRef.current.getCurrentTime();
    playerRef.current.playVideo();
    if (amIHost()) sendControl({ type: "play", currentTime: t });
  }

  function localPause() {
    if (!playerReady.current) return;
    const t = playerRef.current.getCurrentTime();
    playerRef.current.pauseVideo();
    if (amIHost()) sendControl({ type: "pause", currentTime: t });
  }

  function localSeek(delta) {
    if (!playerReady.current) return;
    const t = Math.max(0, playerRef.current.getCurrentTime() + delta);
    playerRef.current.seekTo(t, true);
    if (amIHost()) sendControl({ type: "seek", currentTime: t });
  }

  function acceptJoinRequest(userId) {
    socketRef.current?.emit("admit-user", { targetUserId: userId, admit: true });
    setJoinRequests((prev) => prev.filter((request) => request.userId !== userId));
  }

  function rejectJoinRequest(userId) {
    socketRef.current?.emit("admit-user", { targetUserId: userId, admit: false });
    setJoinRequests((prev) => prev.filter((request) => request.userId !== userId));
  }

  function sendChatMessage(event) {
    event.preventDefault();
    const text = chatText.trim();
    if (!text || !socketRef.current || !joined) return;

    socketRef.current.emit("chat", { text });
    setChatText("");
  }

  function copyInviteLink() {
    const url =
      inviteUrl ||
      `${window.location.origin}${window.location.pathname}?roomId=${encodeURIComponent(
        roomId
      )}&videoId=${encodeURIComponent(videoId)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyStatus("Link copied to clipboard");
        setTimeout(() => setCopyStatus(""), 3000);
      })
      .catch(() => setCopyStatus("Failed to copy"));
  }

  const shareUrl =
    inviteUrl ||
    (roomId
      ? `${window.location.origin}${window.location.pathname}?roomId=${encodeURIComponent(
          roomId
        )}&videoId=${encodeURIComponent(videoId)}`
      : "");
  const audience = roomUsers.slice(0, 5);
  const crowdIcons = ["🍿", "🍿", "👏", "❤️", "🍿", "❤️", "🔥", "🍿", "🍿"];
  const navItems = [
    { label: "SyncWatch", icon: PlayCircle, active: true },
    { label: "Live Sessions", icon: Radio },
    { label: "Live Voice Chat", icon: Mic2 },
    { label: "Live Chat", icon: MessageCircle },
  ];
  const statusCards = [
    {
      title: "Connected",
      value: joined ? "You’re all set!" : "Join the room",
      icon: CheckCircle2,
      tone: "cyan",
    },
    {
      title: "Sync Delay",
      value: `${latencyMs} ms`,
      icon: Zap,
      tone: "blue",
    },
    {
      title: "Online",
      value: `${roomUsers.length}`,
      icon: Users,
      tone: "teal",
    },
  ];

  return (
    <div className="syncwatch-page">
      <div className="syncwatch-stars" />
      <div className="syncwatch-aurora syncwatch-aurora-left" />
      <div className="syncwatch-aurora syncwatch-aurora-right" />

      <div className="syncwatch-shell">
        <header className="syncwatch-topbar">
          <button
            className="syncwatch-icon-button syncwatch-menu-button"
            type="button"
            aria-label="Go back"
            onClick={() => history.goBack()}
          >
            <House size={22} />
          </button>
          <div className="syncwatch-topbar-actions">
            <div className="syncwatch-bell-wrapper">
              <button className="syncwatch-icon-button syncwatch-bell-button" type="button" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <span className="syncwatch-notification-dot" />
            </div>
          </div>
        </header>

        <section className="syncwatch-hero">
          <div className="syncwatch-film-strip" />
          <div className="syncwatch-orbits-container">
            <div className="syncwatch-orbit syncwatch-orbit-left">
              <div className="syncwatch-orbit-content">
                <PlayCircle size={28} />
              </div>
            </div>
            <div className="syncwatch-orbit syncwatch-orbit-right">
              <div className="syncwatch-orbit-content">
                <Users size={28} />
              </div>
            </div>
          </div>

          <svg className="syncwatch-logo-mark" width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#59D8FF"/>
      <stop offset="100%" stop-color="#007BFF"/>
    </linearGradient>

    <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF600"/>
      <stop offset="35%" stop-color="#FFC300"/>
      <stop offset="65%" stop-color="#FF6A00"/>
      <stop offset="100%" stop-color="#FF0033"/>
    </linearGradient>
  </defs>
  <g filter="url(#neonGlow)">
    <path
      d="
      M256 40
      L365 230
      C425 260 470 320 470 430
      C450 385 425 345 380 330
      C360 360 335 385 305 405
      L207 405
      C177 385 152 360 132 330
      C87 345 62 385 42 430
      C42 320 87 260 147 230
      Z"
      fill="none"
      stroke="url(#blue)"
      stroke-width="18"
      stroke-linejoin="round"
      stroke-linecap="round"/>
    <path
      d="M256 105 L320 220 Q256 200 192 220 Z"
      fill="none"
      stroke="url(#blue)"
      stroke-width="12"
      stroke-linejoin="round"/>
    <ellipse
      cx="256"
      cy="305"
      rx="90"
      ry="60"
      fill="none"
      stroke="url(#blue)"
      stroke-width="12"/>
    <path
      d="
      M200 300
      Q256 245 312 300
      L290 345
      L272 420
      L256 470
      L240 420
      L222 345
      Z"
      fill="url(#flame)"
      stroke="#FFFFFF"
      stroke-width="4"/>
    <path
      d="
      M220 315
      Q256 285 292 315
      L276 345
      L256 400
      L236 345
      Z"
      fill="#FF3300"
      opacity="0.55"/>
  </g>
</svg>

          <p className="syncwatch-brand">
            <span className="syncwatch-brand-app">App</span>
            <span className="syncwatch-brand-opener">Oppner</span>
          </p>
          <h1 className="syncwatch-title">
            <span className="syncwatch-title-watch">Watch Together.</span>
            <br />
            <span className="syncwatch-title-stay">Stay in </span>
            <span className="syncwatch-title-sync">Sync.</span>
          </h1>
          <p className="syncwatch-subtitle">
            Watch YouTube videos with friends in real time, no matter where they are.
          </p>
        </section>

        <section className="syncwatch-entry-grid">
          <article className="syncwatch-card syncwatch-card-create">
            <div className="syncwatch-card-header-row">
              <div className="syncwatch-card-icon">
                <Users size={22} />
              </div>
              <div className="syncwatch-card-title-block">
                <h2>Create a Room</h2>
                <p>Paste a YouTube link to start a watch party</p>
              </div>
            </div>

            <div className="syncwatch-input-container">
              <label className="syncwatch-label" htmlFor="syncwatch-phone">Phone Number</label>
              <input
                id="syncwatch-phone"
                className="syncwatch-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="syncwatch-input-container">
              <div className="syncwatch-input-icon">
                <span className="syncwatch-yt-red-logo">▶</span>
              </div>
              <input
                id="syncwatch-video"
                className="syncwatch-input syncwatch-input-with-icon"
                value={creatorVideoId}
                onChange={(e) => setCreatorVideoId(e.target.value)}
                placeholder="Paste YouTube URL here"
                disabled={inviteCreated}
              />
            </div>

            <button
              className="syncwatch-ticket-button syncwatch-ticket-purple"
              type="button"
              onClick={() => {
                if (!creatorVideoId.trim()) {
                  alert("Enter video ID");
                  return;
                }
                if (!phone) {
                  alert("Enter phone number");
                  return;
                }
                setShowModal(true);
              }}
            >
              <div className="syncwatch-ticket-inner">
                <span className="syncwatch-ticket-star">★</span>
                <span>Create Watch Party</span>
                <span className="syncwatch-ticket-star">★</span>
              </div>
            </button>
          </article>

          <div className="syncwatch-orb-divider">
            <div className="syncwatch-orb">OR</div>
          </div>

          <article className="syncwatch-card syncwatch-card-join">
            <div className="syncwatch-card-header-row">
              <div className="syncwatch-card-icon">
                <DoorOpen size={22} />
              </div>
              <div className="syncwatch-card-title-block">
                <h2>Join a Room</h2>
                <p>Enter a room code shared by your friend</p>
              </div>
            </div>

            <div className="syncwatch-input-container">
              <input
                id="syncwatch-room"
                className="syncwatch-input"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room code"
              />
            </div>

            <button
              className="syncwatch-ticket-button syncwatch-ticket-blue"
              type="button"
              onClick={joined ? leaveRoom : joinRoom}
            >
              <div className="syncwatch-ticket-inner">
                <span className="syncwatch-ticket-star">★</span>
                <span>{joined ? "Leave Room" : "Join Room"}</span>
                <span className="syncwatch-ticket-star">★</span>
              </div>
            </button>
          </article>
        </section>

        <section className="syncwatch-waitlist">
          <div className="syncwatch-panel-head">
            <div className="syncwatch-panel-title-block">
              <div className="syncwatch-panel-kicker">
                <Hourglass size={18} className="syncwatch-panel-kicker-icon" />
                <span>Waiting List</span>
                <span className="syncwatch-badge">{joinRequests.length}</span>
              </div>
              <span className="syncwatch-panel-subtitle">People waiting to join your room</span>
            </div>
            <button className="syncwatch-view-all-link" type="button">
              <span>View All Requests</span>
              <span>→</span>
            </button>
          </div>

          <div className="syncwatch-request-list">
            {joinRequests.length === 0 ? (
              <div className="syncwatch-empty-state">
                {amIHost()
                  ? "No pending requests right now."
                  : "Join requests sent to the host will appear here."}
              </div>
            ) : (
              joinRequests.map((request) => (
                <div className="syncwatch-request-row" key={request.userId}>
                  <div className="syncwatch-request-info">
                    <div className="syncwatch-request-name">{request.name}</div>
                    <div className="syncwatch-request-time">{formatElapsed(request.ts)}</div>
                  </div>
                  <div className="syncwatch-request-actions">
                    <button
                      className="syncwatch-mini-ticket syncwatch-mini-ticket-accept"
                      type="button"
                      onClick={() => acceptJoinRequest(request.userId)}
                    >
                      <div className="syncwatch-mini-ticket-inner">Accept</div>
                    </button>
                    <button
                      className="syncwatch-mini-ticket syncwatch-mini-ticket-decline"
                      type="button"
                      onClick={() => rejectJoinRequest(request.userId)}
                    >
                      <div className="syncwatch-mini-ticket-inner">Decline</div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="syncwatch-stage">
          <div className="syncwatch-now-showing">
            <span>★</span>
            <span>Now Showing</span>
            <span>★</span>
          </div>
          <h2 className="syncwatch-stage-title">{getDisplayTitle(videoId || creatorVideoId)}</h2>

          <div className="syncwatch-theater-stage-container">
            {/* Left Gathered Curtain */}
            <svg className="syncwatch-stage-curtain syncwatch-stage-curtain-left" viewBox="0 0 60 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curtain-left-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5c0000" />
                  <stop offset="25%" stopColor="#b71c1c" />
                  <stop offset="50%" stopColor="#7f0000" />
                  <stop offset="75%" stopColor="#d32f2f" />
                  <stop offset="100%" stopColor="#4a0000" />
                </linearGradient>
                <linearGradient id="gold-tie" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffe66d" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
              <path d="M 0 0 Q 30 0, 50 0 Q 25 150, 20 150 Q 15 150, 20 150 Q 40 220, 60 300 L 0 300 Z" fill="url(#curtain-left-grad)" />
              <rect x="0" y="146" width="22" height="6" rx="2" fill="url(#gold-tie)" />
              <path d="M 18 152 L 22 170 L 16 170 Z" fill="url(#gold-tie)" />
            </svg>

            {/* Right Gathered Curtain */}
            <svg className="syncwatch-stage-curtain syncwatch-stage-curtain-right" viewBox="0 0 60 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curtain-right-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4a0000" />
                  <stop offset="25%" stopColor="#d32f2f" />
                  <stop offset="50%" stopColor="#7f0000" />
                  <stop offset="75%" stopColor="#b71c1c" />
                  <stop offset="100%" stopColor="#5c0000" />
                </linearGradient>
              </defs>
              <path d="M 60 0 Q 30 0, 10 0 Q 35 150, 40 150 Q 45 150, 40 150 Q 20 220, 0 300 L 60 300 Z" fill="url(#curtain-right-grad)" />
              <rect x="38" y="146" width="22" height="6" rx="2" fill="url(#gold-tie)" />
              <path d="M 42 152 L 38 170 L 44 170 Z" fill="url(#gold-tie)" />
            </svg>

            {/* Top Swag Valance */}
            <svg className="syncwatch-stage-curtain-top" viewBox="0 0 400 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="valance-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d32f2f" />
                  <stop offset="30%" stopColor="#b71c1c" />
                  <stop offset="70%" stopColor="#7f0000" />
                  <stop offset="100%" stopColor="#4a0000" />
                </linearGradient>
                <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
              <path d="M 0 0 C 40 30, 90 30, 133 0 C 173 30, 226 30, 266 0 C 306 30, 360 30, 400 0 L 400 10 C 360 38, 306 38, 266 10 C 226 38, 173 38, 133 10 C 93 38, 40 38, 0 10 Z" fill="url(#valance-grad)" />
              <path d="M 0 10 C 40 38, 93 38, 133 10 C 173 38, 226 38, 266 10 C 306 38, 360 38, 400 10" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
              <path d="M 0 0 L 15 0 L 0 35 Z" fill="#7f0000" />
              <path d="M 400 0 L 385 0 L 400 35 Z" fill="#7f0000" />
            </svg>

            <div className="syncwatch-player-frame">
              <div id="yt-player" className="syncwatch-player" />
            </div>
          </div>

          <div className="syncwatch-controls">
            <button
              className={`syncwatch-control ${amIHost() ? "" : "is-disabled"}`}
              type="button"
              onClick={localPlay}
              disabled={!amIHost()}
            >
              Play
            </button>
            <button
              className={`syncwatch-control ${amIHost() ? "" : "is-disabled"}`}
              type="button"
              onClick={localPause}
              disabled={!amIHost()}
            >
              Pause
            </button>
            <button
              className={`syncwatch-control syncwatch-control-outline ${amIHost() ? "" : "is-disabled"}`}
              type="button"
              onClick={() => localSeek(-10)}
              disabled={!amIHost()}
            >
              -10s
            </button>
            <button
              className={`syncwatch-control syncwatch-control-outline ${amIHost() ? "" : "is-disabled"}`}
              type="button"
              onClick={() => localSeek(10)}
              disabled={!amIHost()}
            >
              +10s
            </button>
            <button
              className={`syncwatch-control syncwatch-control-outline ${shareUrl ? "" : "is-disabled"}`}
              type="button"
              onClick={copyInviteLink}
              disabled={!shareUrl}
            >
              <Copy size={14} />
              <span>Invite</span>
            </button>
          </div>

          <section className="syncwatch-audience-section">
            <div className="syncwatch-audience-header">
              <div className="syncwatch-audience-line" />
              <span>Audience Seating</span>
              <div className="syncwatch-audience-line" />
            </div>

            <div className="syncwatch-seats-container">
              {Array.from({ length: 5 }).map((_, index) => {
                const user = audience[index];
                const label = getSeatLabel(index);
                const isDirectorSeat = index === 2;
                return (
                  <div
                    className={`syncwatch-seat ${isDirectorSeat ? "syncwatch-seat-director" : ""}`}
                    key={label}
                  >
                    <div className="syncwatch-chair-model">
                      {isDirectorSeat && <span className="syncwatch-crown-icon">👑</span>}
                      <div className="syncwatch-chair-back" />
                      <div className="syncwatch-chair-cushion" />
                      <div className="syncwatch-chair-armrest syncwatch-chair-armrest-left" />
                      <div className="syncwatch-chair-armrest syncwatch-chair-armrest-right" />
                      {!user && !isDirectorSeat && (
                        <div className="syncwatch-empty-avatar">
                          <Users size={14} />
                        </div>
                      )}
                    </div>
                    <div className="syncwatch-seat-label-block">
                      <div className="syncwatch-seat-code">{isDirectorSeat ? "DIRECTOR" : label}</div>
                      <div className="syncwatch-seat-user">
                        {user ? user.name || maskPhone(user.userId) : isDirectorSeat ? "Director" : "Open"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="syncwatch-reactions-strip">
              <span className="syncwatch-reaction-icon">🍿</span>
              <span className="syncwatch-reaction-icon">🍿</span>
              <span className="syncwatch-reaction-icon">👏</span>
              <span className="syncwatch-reaction-icon">❤️</span>
              <span className="syncwatch-reaction-icon">🍿</span>
              <span className="syncwatch-reaction-icon">❤️</span>
              <span className="syncwatch-reaction-icon">🔥</span>
              <span className="syncwatch-reaction-icon">🍿</span>
              <span className="syncwatch-reaction-icon">🍿</span>
            </div>
          </section>
        </section>

        <section className="syncwatch-status-grid">
          <article className="syncwatch-status-card">
            <div className="syncwatch-status-card-header">
              <div className="syncwatch-pulse-dot" />
              <span>Connected</span>
            </div>
            <strong className="syncwatch-status-card-value">
              {joined ? "You’re all set!" : "Join the room"}
            </strong>
          </article>

          <article className="syncwatch-status-card">
            <div className="syncwatch-status-card-header">
              <Zap size={14} className="syncwatch-sync-delay-icon" />
              <span>Sync Delay</span>
            </div>
            <strong className="syncwatch-status-card-value">
              {latencyMs} ms
            </strong>
          </article>

          <article className="syncwatch-status-card">
            <div className="syncwatch-status-card-header">
              <Users size={14} className="syncwatch-online-icon" />
              <span>Online</span>
            </div>
            <strong className="syncwatch-status-card-value">
              {roomUsers.length}
            </strong>
            <span className="syncwatch-status-sparkle">✦</span>
          </article>
        </section>

        <footer className="syncwatch-bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className={`syncwatch-nav-item ${item.active ? "is-active" : ""}`}
                key={item.label}
                onClick={() => {
                  if (item.label === "Live Chat") {
                    setShowChat(true);
                  }
                }}
              >
                <div className="syncwatch-nav-item-icon-wrap">
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
          <button className="syncwatch-nav-exit" type="button" onClick={joined ? leaveRoom : () => history.push("/")}>
            <div className="syncwatch-nav-item-icon-wrap">
              <LogOut size={18} />
            </div>
            <span>Exit</span>
          </button>
        </footer>
      </div>

      {/* Sliding Chat Drawer */}
      <div className={`syncwatch-chat-drawer ${showChat ? "is-open" : ""}`}>
        <div className="syncwatch-chat-drawer-overlay" onClick={() => setShowChat(false)} />
        <div className="syncwatch-chat-drawer-content">
          <div className="syncwatch-chat-drawer-header">
            <div className="syncwatch-chat-drawer-title">
              <MessageCircle size={20} className="syncwatch-chat-drawer-icon" />
              <span>Live Chat</span>
            </div>
            <button className="syncwatch-chat-drawer-close" onClick={() => setShowChat(false)}>✕</button>
          </div>
          
          <div className="syncwatch-chat-log">
            {chatMessages.length === 0 ? (
              <div className="syncwatch-empty-state">
                No messages yet. Once the room starts chatting, it shows up here.
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div className="syncwatch-chat-message" key={`${message.time}-${index}`}>
                  <div className="syncwatch-chat-author">
                    {message.name || message.from || "User"}
                  </div>
                  <div className="syncwatch-chat-text">{message.text}</div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="syncwatch-chat-form" onSubmit={sendChatMessage}>
            <input
              className="syncwatch-input"
              value={chatText}
              onChange={(event) => setChatText(event.target.value)}
              placeholder="Type a message"
            />
            <button className="syncwatch-send-button" type="submit" disabled={!joined}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <PaidScreeningModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}

function cryptoRandomId() {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(6)))
      .map((byte) => byte.toString(36))
      .join("");
  } catch (error) {
    return Math.random().toString(36).slice(2, 8);
  }
}
