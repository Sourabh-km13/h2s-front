import { useState, useEffect } from "react";

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // auto-hide after 2s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed  top-1/2 left-1/2      bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all">
      {message}
    </div>
  );
}
