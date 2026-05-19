import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const { data } = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        data.token
      );

      toast.success("Login successful");

      setUser(data);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Team Task Manager
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>

        <p className="mt-4 text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;