// components/TaskUploader.tsx
"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function TaskUploader() {
  const [jsonInput, setJsonInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const tasks = JSON.parse(jsonInput);

      if (!Array.isArray(tasks)) {
        setMessage("JSON must be an array of tasks!");
        return;
      }

      // Map tasks to match table structure
      const formattedTasks = tasks.map((t: any) => ({
        task: t.task,
        date: t.date,
        status: "inactive",
      }));

      const { data, error } = await supabase
        .from("tasks")
        .insert(formattedTasks);

      if (error) {
        setMessage("Error inserting tasks: " + error.message);
      } else {
        setMessage("Tasks uploaded successfully!");
        setJsonInput("");
      }
    } catch (e: any) {
      setMessage("Invalid JSON: " + e.message);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Upload Tasks JSON</h2>
      <textarea
        className="w-full h-64 p-2 border rounded mb-4"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter tasks as JSON array, e.g. [{"task": "Find a Dog", "date": "2025-10-04"}]'
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Upload Tasks
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}
