import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Register() {

    const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
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
        "/auth/register",
        formData
      );

      localStorage.setItem(
        "token",
        data.token
      );

      toast.success("Account created");

      setUser(data);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          />

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

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          >
            <option value="member">
              member
            </option>

            <option value="admin">
              admin
            </option>
          </select>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Register
          </button>

        </form>

        <p className="mt-4 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;