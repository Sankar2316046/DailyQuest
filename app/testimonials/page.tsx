"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type Testimonial = {
  id: string;
  user_id: string;
  name: string | null;
  message: string;
  created_at: string;
};

export default function TestimonialsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [list, setList] = useState<Testimonial[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      await loadTestimonials();
    };
    init();
  }, []);

  const loadTestimonials = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, user_id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error) setList(data as Testimonial[]);
    setLoadingList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a testimonial.");
      return;
    }
    if (!message.trim()) {
      alert("Please write a testimonial message.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        user_id: user.id,
        name: name?.trim() || (user.user_metadata?.full_name as string) || null,
        message: message.trim(),
      };
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) throw error;
      setMessage("");
      setName("");
      await loadTestimonials();
      alert("Thanks for your testimonial!");
    } catch (err) {
      console.error(err);
      alert("Could not submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">
            Community Testimonials
          </h1>
          <p className="text-gray-600 mt-2">Share your experience with DailyQuest.</p>
        </header>

        {/* Submission Card */}
        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {!user ? (
            <div className="text-center text-sm text-gray-700">
              Please <Link href="/login" className="text-purple-600 underline">log in</Link> to submit a testimonial.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your testimonial</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell others how DailyQuest helped you..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* List */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Testimonials</h2>
          {loadingList ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-sm text-gray-600">No testimonials yet. Be the first to share!</div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {list.map((t) => (
                <li key={t.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">{t.name || "Anonymous"}</div>
                    {/* {typeof t.rating === "number" && (
                      <div className="text-xs text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
                        {t.rating} / 5
                      </div>
                    )} */}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{t.message}</p>
                  <div className="mt-2 text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
