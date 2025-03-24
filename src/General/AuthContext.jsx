import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User verified:", response.data);
        setUser(response.data); // Set user data
      } catch (error) {
        console.error("Token verification failed:", error.response?.data || error.message);
        sessionStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Logging in with:", { email, password }); // Debugging

      const response = await axios.post("http://localhost:3000/api/login", {
        email: email,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login response:", response.data); // Debugging

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("UserEmail", email);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      return response.data.redirectPath;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      } else {
        console.error("Login error:", error.response?.data || error.message);
        throw new Error("An error occurred. Please try again.");
      }
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}