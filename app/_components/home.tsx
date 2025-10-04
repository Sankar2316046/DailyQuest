"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import supabase from "@/lib/supabase";

interface Task {
  id: string;
  task: string;
  date: string;
  status: string;
}

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayTask();
  }, []);

  const fetchTodayTask = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), "yyyy-MM-dd");

      const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setTask(task);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
    <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center">
      {loading ? (
        <p className="text-gray-600 text-center animate-pulse">
          Fetching today’s task...
        </p>
      ) : task ? (
        <>
          <h1 className="text-xl font-semibold text-indigo-700 mb-3">
            🗓️ {format(new Date(task.date), "EEEE, MMMM d")}
          </h1>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {task.task}
          </h2>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              task.status === "active"
                ? "bg-green-100 text-green-700"
                : task.status === "closed"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {task.status?.toUpperCase()}
          </span>
        </>
      ) : (
        <p className="text-gray-700 text-center">
          No task available for today.
        </p>
      )}
    </div>
  </main>
  );
}
