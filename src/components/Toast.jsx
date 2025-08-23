import { useEffect } from "react";

export default function Toast({ message, show, onClose, type = "success" }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => onClose(), 2200);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bg = type === "error" ? "bg-red-600" : type === "info" ? "bg-blue-600" : "bg-green-600";

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded shadow-lg text-white ${bg} z-50`}>
      {message}
    </div>
  );
}