export default function PhoneCard() {
  return (
    <div className="relative top-[-75px] z-10 w-[300px] sm:w-[360px] rounded-[2.5rem] bg-gradient-to-br from-[#0d0d1c] to-[#1b1b2d] p-6 text-white shadow-inner border-4 border-orange-500">
      <div className="space-y-6">
        <h5 className="font-bold">Get Your Smart Links Today !</h5>
        <div>
          <p className="text-sm mb-1 text-gray-400">⚡ Step 1</p>
          <label className="block text-sm mb-1">Paste your URL here:</label>
          <input
            type="text"
            placeholder="https://example.com"
            className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none"
          />
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-400">⚡ Step 2</p>
          <label className="block text-sm mb-1">Open In:</label>
          <select className="w-full p-2 bg-black/80 border border-gray-600 rounded-lg text-white">
            <option>Select platform</option>
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-400">⚡ Step 3</p>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 py-2 rounded-md bg-violet-700 text-white shadow-md">
              ⚡ Generate
            </button>
            <button className="flex-1 py-2 rounded-md bg-yellow-700 text-white shadow-md">
              👑 Golden Link<br />$1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
