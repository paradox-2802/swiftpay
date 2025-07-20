import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Dashboard() {
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/decode", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return setUsername(response.data.firstName);
      });
  }, [token]);

  const [balance, setBalance] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return setBalance(parseFloat(response.data.balance));
      });
  }, [token]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return setUsers(response.data.user);
      });
  }, [filter, token]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/swiftpay-logo.svg"
              alt="SwiftPay Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-gray-900">SwiftPay</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-base font-medium text-gray-800">
              Hi, {username}
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
              {username?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </div>
      </header>
      <div className="h-6" />
      <div className="mx-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Balance</h2>
        <p className="text-2xl font-bold text-green-600">₹{balance}</p>
      </div>
      <div className="h-6" />
      <div className="mx-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Send Money To:</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => setFilter(e.target.value)}
        />
        <ul className="space-y-4">
          {users.map((user) => (
            <UserItem key={user._id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function UserItem({ user }) {
  const navigate = useNavigate();
  const avatar = user.firstName[0].toUpperCase();
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
          {avatar}
        </div>
        <span className="text-base font-medium">
          {user.firstName} {user.lastName}
        </span>
      </div>
      <button
        className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition"
        onClick={() =>
          navigate("/send", {
            state: { id: user._id, name: `${user.firstName} ${user.lastName}` },
          })
        }
      >
        Send
      </button>
    </li>
  );
}
