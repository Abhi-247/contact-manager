"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import DeleteButton from "../_components/deleteButton";
import { useRouter } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userId: string;
}

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("/api/contacts");
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to load contacts");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    fetchContacts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <Link
          href="/contact/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Contact
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No contacts yet</p>
          <Link
            href="/contact/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
          >
            Create Your First Contact
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contact.name}
                  </h2>
                  <p className="text-gray-600">Email: {contact.email}</p>
                  {contact.phone && (
                    <p className="text-gray-600">Phone: {contact.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/contact/edit/${contact.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton contactId={contact.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
