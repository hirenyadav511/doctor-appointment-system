import { useEffect, useRef, useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function ClerkSync() {
  const { user, isLoaded } = useUser();
  const { backendUrl, token, setToken } = useContext(AppContext);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setToken("");
      localStorage.removeItem("token");
      return;
    }

    if (token && syncingRef.current === false) return;

    const syncUser = async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/clerk-login",
          {
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.firstName,
            image: user.imageUrl,
          },
        );
        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        }
      } catch (err) {
        console.error("Clerk sync error:", err);
      } finally {
        syncingRef.current = false;
      }
    };

    syncUser();
  }, [isLoaded, user, backendUrl, setToken, token]);

  return null;
}
