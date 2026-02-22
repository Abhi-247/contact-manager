"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ContactFormProps {
  contactId?: string;
  onSuccess?: () => void;
}

const ContactForm = ({ contactId, onSuccess }: ContactFormProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (contactId) {
      setIsEditing(true);
      fetchContact();
    }
  }, [contactId]);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`/api/contacts/${contactId}`);
      if (response.data.success) {
        const { name, email, phone } = response.data.data;
        setName(name);
        setEmail(email);
        setPhone(phone || "");
      }
    } catch (err) {
      setError("Failed to load contact");
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`/api/contacts/${contactId}`, {
          name,
          email,
          phone,
        });
      } else {
        await axios.post("/api/contacts", {
          name,
          email,
          phone,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/contact");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save contact");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold text-center mb-6">
        {isEditing ? "Edit Contact" : "New Contact"}
      </h1>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact name"
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Contact email"
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone (Optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Contact phone"
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : isEditing
            ? "Update Contact"
            : "Create Contact"}
      </button>
    </form>
  );
};

export default ContactForm;
