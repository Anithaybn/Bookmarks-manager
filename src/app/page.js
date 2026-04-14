"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getBookmarks();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    console.log("Setting up realtime...");
    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          console.log("Change detected", payload);
          getBookmarks();
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addBookmark = async (e) => {
    e.preventDefault(); //to stop refresh
    if (!user) {
      alert("User not logged in");
      return;
    }
    if (!title || !url) {
      setError("All fields are required");
      return;
    }
    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);
    if (error) {
      console.log(error);
      alert("Error adding bookmark");
    } else {
      setError("");
      alert("Bookmark added");
      setTitle("");
      setUrl("");
      getBookmarks();
    }
  };

  const getBookmarks = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("is_favourite", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookmarks(data);
    } catch (error) {
      console.log("Error fetching bookmarks:", error.message);
    }
  };

  const deleteBookmark = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      console.log(error);
      alert("Error deleting bookmark");
    } else {
      alert("Deleted successfully");
      getBookmarks(); // to refresh table
    }
  };

  const toggleFavourite = async (id, currentValue) => {
    console.log("here:", currentValue);
    const { error } = await supabase
      .from("bookmarks")
      .update({ is_favourite: !currentValue })
      .eq("id", id);
    if (error) {
      console.log(error);
    } else {
      alert(currentValue ? "Removed from favorites" : "Marked as favorite");
      getBookmarks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full ">
        <div>
          {user ? (
            <>
              <div className="w-full bg-gray-400 text-white px-6 py-4 flex justify-between items-center mb-6">
                <p className="text-l font-semibold text-gray-700">
                  Hi, {user.email}
                </p>
                <button
                  onClick={logout}
                  className=" text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-600 transition"
                >
                  Logout
                </button>
              </div>
              <div className="mb-4 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Welcome to your Bookmark Manager 🚀
                </h2>
                <p className="text-gray-600 text-sm">
                  Save, organize, and manage your favorite links. Add new
                  bookmarks below and access them anytime.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <form
                  onSubmit={addBookmark}
                  className=" md:col-span-1 bg-white p-4 rounded-xl mb-6 space-y-3 shadow-sm h-fit"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Bookmark
                  </button>
                </form>
                {bookmarks.length === 0 ? (
                  <div className="md:col-span-2 text-center py-10 text-gray-500">
                    No bookmarks yet. Add your first one 🚀
                  </div>
                ) : (
                  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden h-fit">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="p-2 text-left">Title</th>
                          <th className="p-2 text-left">URL</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookmarks.map((b) => (
                          <tr key={b.id} className="border-t hover:bg-gray-50">
                            <td className="p-2">{b.title}</td>
                            <td className="p-2">
                              <a
                                href={b.url}
                                target="_blank"
                                className="text-blue-700 hover:underline"
                              >
                                {b.url}
                              </a>
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() =>
                                  toggleFavourite(b.id, b.is_favourite)
                                }
                                className="text-yellow-500 text-lg mr-2 hover:scale-110 transition transform"
                              >
                                {b.is_favourite ? "★" : "☆"}
                              </button>
                              <button
                                onClick={() => deleteBookmark(b.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="bg-white p-8 rounded-xl shadow-md  w-full max-w-sm text-center">
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  Bookmark Manager
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                  Sign in to save and manage your bookmarks
                </p>
                <button
                  onClick={login}
                  className="flex items-center justify-center gap-3 w-full border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3C33.6 32.1 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.4 2.6l5.7-5.7C33.5 6.5 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.5-.2-3-.4-4.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 13 24 13c2.8 0 5.4 1 7.4 2.6l5.7-5.7C33.5 6.5 29 5 24 5c-7.7 0-14.3 4.3-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 45c5.1 0 9.8-1.9 13.4-5l-6.2-5.1C29.1 36.5 26.7 37.5 24 37.5c-5.1 0-9.4-3.1-11-7.4l-6.5 5C9.7 40.6 16.3 45 24 45z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.8 6.9l6.2 5.1C38.9 36.6 44 31.3 44 25c0-1.5-.2-3-.4-4.5z"
                    />
                  </svg>

                  <span className="text-sm font-medium text-gray-700">
                    Continue with Google
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
