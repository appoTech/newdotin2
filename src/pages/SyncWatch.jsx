// src/pages/SyncWatch.jsx
import { useEffect, useState } from "react";
import useSocketRoom from "../hooks/useSocketRoom";
import Player from "../components/Player";
import ChatBox from "../components/ChatBox";
import HostControls from "../components/HostControls";
import UserCount from "../components/UserCount";
import ShareRoomLink from "../components/ShareRoomLink";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/";

export default function SyncWatch(props) {
  const [roomId, setRoomId] = useState("");
  const [videoId, setVideoId] = useState(props.match.params.id || "");
  const [hasAccess, setHasAccess] = useState(null);


  // useEffect(()=>{
  //   console.log("props",props.match.params.id)
    
  //   // Check if IP has paid for access
  //   const checkAccess = async () => {
  //     try {
  //       const { data } = await axios.get(`${API_URL}payment/checkPaidScreeningAccess`);
  //       setHasAccess(data.access);
  //     } catch (err) {
  //       console.error("Access check failed:", err);
  //       setHasAccess(false);
  //     }
  //   };
  //   checkAccess();
  // },[]);

  const {
    isJoined,
    isWaiting,
    admissionDenied,
    creationDenied,
    isHost,
    userCount,
    player,
    joinRoom,
    handlePlayerEvent,
    chatMessages,
    sendChat,
    joinQueue,
    acceptUser,
    denyUser,
  } = useSocketRoom(roomId, videoId, hasAccess, "Anonymous Viewer");

  if (hasAccess === null) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Room Data...</div>;
  }

  if (creationDenied) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Action Denied</h1>
        <p className="text-gray-300">This room alias '{roomId}' does not exist yet. You must purchase a core Paid Screening gateway pass to create a new dedicated room.</p>
        <button className="mt-6 px-6 py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-700" onClick={() => window.location.href = "/"}>
          Return to Hub
        </button>
      </div>
    );
  }

  if (admissionDenied) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Entry Denied</h1>
        <p className="text-gray-300">The host declined your request to join the SyncWatch room.</p>
        <button className="mt-6 px-6 py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-700" onClick={() => window.location.href = "/"}>
          Return Home
        </button>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-4 text-blue-400 animate-pulse">Waiting for Admission...</h1>
        <p className="text-gray-300">You do not have a direct entry pass. The host has been notified and must approve your entry.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-6">🎬 YouTube Sync Watch</h1>

      {!isJoined && (
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md flex flex-col gap-3">
          <input
            className="px-3 py-2 bg-gray-700 rounded"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            className="px-3 py-2 bg-gray-700 rounded"
            placeholder="YouTube Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 rounded text-white"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      )}

      {isJoined && (
        <>
          <Player
            videoId={videoId}
            playerRef={player}
            onEvent={handlePlayerEvent}
            isHost={isHost}
          />

          <HostControls isHost={isHost} />
          <UserCount count={userCount} />
          <ShareRoomLink roomId={roomId} />

          <ChatBox messages={chatMessages} send={sendChat} />
          
          {/* Host Waitlist Panel */}
          {isHost && joinQueue.length > 0 && (
            <div className="fixed top-20 right-5 w-80 bg-gray-800 border border-blue-500/50 rounded-xl shadow-2xl p-4 z-50">
              <h3 className="text-lg font-bold text-white mb-3">Waitlist ({joinQueue.length})</h3>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                {joinQueue.map((req) => (
                  <div key={req.socketId} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                    <span className="text-sm font-semibold truncate text-gray-200 w-1/2">{req.name}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => acceptUser(req.socketId)}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded font-bold"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => denyUser(req.socketId)}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded font-bold"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
