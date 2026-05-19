import {
  createContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

export const AuthContext =
  createContext();

function AuthProvider({ children }) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        setLoading(false);

        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await API.get(
        "/auth/me",
        config
      );

      setUser(data);

    } catch (error) {

      console.log(error);

      localStorage.removeItem("token");

      setUser(null);
    }

    setLoading(false);
  };

  // LOGOUT FUNCTION

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export default AuthProvider;