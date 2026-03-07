import { useEffect, useState } from "react";

type LoadState = "idle" | "loading" | "ready";

export default function useApi() {
  const [state, setState] = useState<LoadState>("idle");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setState("loading");

    const timer = window.setTimeout(() => {
      setItems([
        "API starter task",
        "Replace mock data",
        "Connect real permissions"
      ]);
      setState("ready");
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    state,
    items
  };
}
