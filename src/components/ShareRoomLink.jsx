// src/components/ShareRoomLink.jsx
export default function ShareRoomLink({ roomId }) {
  const link = `${window.location.origin}/?room=${roomId}`;

  return (
    <button
      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      onClick={() => {
        navigator.clipboard.writeText(link);
        alert("Room link copied!");
      }}
    >
      🔗 Copy Room Link
    </button>
  );
}
