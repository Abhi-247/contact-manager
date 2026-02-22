"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  contactId: string;
}

const DeleteButton = ({ contactId }: DeleteButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/contacts/${contactId}`);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteButton;
