import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider } from "../Firebase/Firebase.js";
import { signInWithPopup } from "firebase/auth";

export default function Auth() {
  const navigate = useNavigate();

  async function handleAuth() {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // ✅ Firebase ID Token

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("Backend error: " + (error.error || "Unknown error"));
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // 🔐 Store server JWT

      // 🔽 Fetch user data using the server JWT
      const userRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const userData = await userRes.json();
      console.log("Authenticated user:", userData);

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("Auth error: " + error.message);
    }
  }



  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={{ fontFamily: "'Italiana', serif" }}
      >
        <div className="w-full max-w-md p-8 border-2 border-red-600 rounded-lg shadow-lg bg-white text-center">
          <h2 className="text-3xl font-semibold text-red-600 mb-8">Authenticate</h2>
          <button
            onClick={handleAuth}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
          >
            Login / Signup with Google
          </button>
        </div>
      </div>
    </>
  );
}
