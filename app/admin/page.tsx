// // // // components/TaskUploader.tsx
// // // "use client";

// // // import { useState } from "react";
// // // import supabase from "@/lib/supabase";

// // // export default function TaskUploader() {
// // //   const [jsonInput, setJsonInput] = useState("");
// // //   const [message, setMessage] = useState("");

// // //   const handleSubmit = async () => {
// // //     try {
// // //       const tasks = JSON.parse(jsonInput);

// // //       if (!Array.isArray(tasks)) {
// // //         setMessage("JSON must be an array of tasks!");
// // //         return;
// // //       }

// // //       // Map tasks to match table structure
// // //       const formattedTasks = tasks.map((t: any) => ({
// // //         task: t.task,
// // //         date: t.date,
// // //         status: "inactive",
// // //       }));

// // //       const { data, error } = await supabase
// // //         .from("tasks")
// // //         .insert(formattedTasks);

// // //       if (error) {
// // //         setMessage("Error inserting tasks: " + error.message);
// // //       } else {
// // //         setMessage("Tasks uploaded successfully!");
// // //         setJsonInput("");
// // //       }
// // //     } catch (e: any) {
// // //       setMessage("Invalid JSON: " + e.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-4 border rounded-md max-w-lg mx-auto mt-8">
// // //       <h2 className="text-xl font-semibold mb-4">Upload Tasks JSON</h2>
// // //       <textarea
// // //         className="w-full h-64 p-2 border rounded mb-4"
// // //         value={jsonInput}
// // //         onChange={(e) => setJsonInput(e.target.value)}
// // //         placeholder='Enter tasks as JSON array, e.g. [{"task": "Find a Dog", "date": "2025-10-04"}]'
// // //       />
// // //       <button
// // //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// // //         onClick={handleSubmit}
// // //       >
// // //         Upload Tasks
// // //       </button>
// // //       {message && <p className="mt-2 text-red-600">{message}</p>}
// // //     </div>
// // //   );
// // // }


// // // components/TaskUploader.tsx
// // "use client";

// // import { useState } from "react";
// // import supabase from "@/lib/supabase";

// // export default function TaskUploader() {
// //   const [jsonInput, setJsonInput] = useState("");
// //   const [message, setMessage] = useState("");

// //   const handleSubmit = async () => {
// //     try {
// //       const tasks = JSON.parse(jsonInput);

// //       if (!Array.isArray(tasks)) {
// //         setMessage("JSON must be an array of tasks!");
// //         return;
// //       }

// //       // Map tasks to match table structure
// //       const formattedTasks = tasks.map((t: any) => ({
// //         task: t.task,
// //         date: t.date,
// //         status: "inactive",
// //       }));

// //       const { data, error } = await supabase
// //         .from("tasks")
// //         .insert(formattedTasks);

// //       if (error) {
// //         setMessage("Error inserting tasks: " + error.message);
// //       } else {
// //         setMessage("✅ Tasks uploaded successfully!");
// //         setJsonInput("");
// //       }
// //     } catch (e: any) {
// //       setMessage("Invalid JSON: " + e.message);
// //     }
// //   };

// //   return (
// //     <div className="p-6 border border-pink-600 rounded-md max-w-lg mx-auto mt-8 bg-black text-pink-300 shadow-lg">
// //       <h2 className="text-2xl font-semibold mb-4 text-pink-400 text-center">
// //         Upload Tasks JSON
// //       </h2>

// //       <textarea
// //         className="w-full h-64 p-3 border border-pink-500 rounded-md bg-gray-900 text-pink-200 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
// //         value={jsonInput}
// //         onChange={(e) => setJsonInput(e.target.value)}
// //         placeholder='Enter tasks as JSON array, e.g. [{"task": "Find a Dog", "date": "2025-10-04"}]'
// //       />

// //       <button
// //         className="bg-gray-800 text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text px-4 py-2 rounded hover:bg-gray-700 border border-gray-600"
// //         onClick={handleSubmit}
// //       >
// //         Upload Tasks
// //       </button>

// //       {message && (
// //         <p
// //           className={`mt-3 text-center ${
// //             message.startsWith("✅") ? "text-green-400" : "text-red-400"
// //           }`}
// //         >
// //           {message}
// //         </p>
// //       )}
// //     </div>
// //   );
// // }


"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function TaskUploader() {
  const [jsonInput, setJsonInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const tasks = JSON.parse(jsonInput);

      if (!Array.isArray(tasks)) {
        setMessage("❌ JSON must be an array of tasks!");
        return;
      }

      const formattedTasks = tasks.map((t: any) => ({
        task: t.task,
        date: t.date,
        status: "inactive",
      }));

      const { error } = await supabase.from("tasks").insert(formattedTasks);

      if (error) {
        setMessage("⚠️ Error inserting tasks: " + error.message);
      } else {
        setMessage(`✅ ${formattedTasks.length} task(s) uploaded successfully!`);
        setJsonInput("");
      }
    } catch (e: any) {
      setMessage("❌ Invalid JSON: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-800">
      {/* Floating glow particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fuchsia-300/10 rounded-full blur-3xl animate-[spin_10s_linear_infinite]" />
      </div>

      <div className="relative z-10 w-full max-w-xl p-8 rounded-2xl bg-white border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
          Upload Tasks JSON
        </h2>

        <textarea
          className="w-full h-64 p-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70 transition-all duration-300"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter tasks as JSON array, e.g. [{"task": "Find a Dog", "date": "2025-10-04"}]'
        />

        <div className="relative mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`relative w-full py-3 rounded-xl font-semibold transition-all overflow-hidden group ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-[1.03]"
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-600 opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative text-white tracking-wide text-lg">
              {loading ? "Uploading..." : "🚀 Upload Tasks"}
            </span>
          </button>
        </div>

        {message && (
          <p
            className={`mt-5 text-center text-base font-medium transition-all duration-300 ${
              message.startsWith("✅")
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Neon border animation */}
      <style jsx>{`
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 8px rgba(236,72,153,0.6), 0 0 16px rgba(168,85,247,0.6), 0 0 24px rgba(236,72,153,0.6);
          }
          50% {
            text-shadow: 0 0 16px rgba(168,85,247,0.6), 0 0 24px rgba(236,72,153,0.6), 0 0 36px rgba(168,85,247,0.6);
          }
        }
        .animate-textGlow {
          animation: textGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
