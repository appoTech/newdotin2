// src/components/UserCount.jsx
export default function UserCount({ count }) {
  return (
    <div className="p-2 bg-gray-700 text-white rounded mt-4">
      👥 Users in room: <b>{count}</b>
    </div>
  );
}
