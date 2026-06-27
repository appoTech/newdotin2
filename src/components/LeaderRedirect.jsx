import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function LeaderRedirect() {
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");

  useEffect(() => {
    if (url) window.location.href = url;
  }, [url]);

  return null;
}
