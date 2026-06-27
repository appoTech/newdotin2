// src/components/HostControls.jsx
export default function HostControls({ isHost }) {
  if (!isHost) return null;

  return (
    <div className="bg-green-800 p-3 rounded text-white w-full max-w-md mt-4 text-center">
      ⭐ You are the Host (you control the video)
    </div>
  );
}
