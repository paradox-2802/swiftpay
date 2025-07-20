import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function SendMoney() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { id, name } = location.state || {};
  const [amount, setAmount] = useState(0);
  async function transfer() {
    await axios.post("http://localhost:3000/api/v1/account/transfer",
    {
      amount: amount,
      to: id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Send Money</h2>
        {/* Avatar + Name block */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="text-2xl font-bold">
            {name || "Unkown"}
          </div>
        </div>
        <label className="block text-sm font-medium mb-1">Amount (in Rs)</label>
        <input
          type="number"
          placeholder="Enter the amount"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mt-4"
          onClick={transfer}
        >
          Initiate Transfer
        </button>
      </div>
    </div>

  );
}
