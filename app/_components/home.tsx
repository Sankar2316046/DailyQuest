"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import supabase from "@/lib/supabase";
import { User } from '@supabase/supabase-js';

interface Task {
  id: string;
  task: string;
  date: string;
  status: string;
}

interface Response {
  id: string;
  task_id: string;
  user_id: string;
  description: string;
  image_url: string;
  likes_count: number;
}

export default function TodayTaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [allResponses, setAllResponses] = useState<Response[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      setUser(userData.user);

      // 1️⃣ Fetch today’s task
      const today = new Date().toISOString().split("T")[0];
      const { data: taskData } = await supabase
        .from("tasks")
        .select("*")
        .eq("date", today)
        .single();

      if (!taskData) {
        setLoading(false);
        return;
      }
      setTask(taskData);

      // 2️⃣ Fetch user's response (if any)
      const { data: responseData } = await supabase
        .from("responses")
        .select("*")
        .eq("task_id", taskData.id)
        .eq("user_id", userData.user.id)
        .single();

      if (responseData) {
        setResponse(responseData);
        setDescription(responseData.description || "");
      }

      // 3️⃣ If task closed → fetch all responses
      if (taskData.status === "closed") {
        const { data: all } = await supabase
          .from("responses")
          .select("*")
          .eq("task_id", taskData.id);
        setAllResponses(all || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // 🟩 Upload Image
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImage(files[0]);
  };

  // 🟩 Submit Response
  const handleSubmit = async () => {
    if (!image && !response) {
      alert("Please capture an image first!");
      return;
    }
    if (!user || !task) return;

    let imageUrl = response?.image_url;

    // Upload image if new
    if (image) {
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("responses")
        .upload(fileName, image, { upsert: true });
      if (uploadError) {
        alert("Upload failed!");
        return;
      }
      const { data: publicUrl } = supabase.storage
        .from("responses")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    if (response) {
      // Update existing response
      await supabase
        .from("responses")
        .update({ description, image_url: imageUrl })
        .eq("id", response.id);
    } else {
      // Insert new response
      const { data: newResponse, error: responseError } = await supabase
        .from("responses")
        .insert({
          task_id: task.id,
          user_id: user.id,
          description,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (responseError) {
        console.error("Failed to insert response:", responseError);
        return;
      }

      setResponse(newResponse);

      // Award 10 points (only user_id & points)
      const { data: pointsData, error: pointsError } = await supabase
        .from("user_points")
        .upsert(
          { user_id: user.id, points: 10 },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (pointsError) console.error("Failed to award points:", pointsError);
      else console.log("Points awarded:", pointsData);
    }

    alert("Response saved successfully!");
  };

  // ❤️ Like function
  const handleLike = async (id: string) => {
    await supabase.rpc("increment_likes", { response_id: id });
    const updated = allResponses.map((r) =>
      r.id === id ? { ...r, likes_count: r.likes_count + 1 } : r
    );
    setAllResponses(updated);
  };

  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen text-gray-600">
        Loading today’s task...
      </main>
    );

  if (!task)
    return (
      <main className="flex items-center justify-center min-h-screen text-gray-700">
        No task for today.
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-10">
        <h1 className="text-xl font-semibold text-indigo-700 text-center mb-4">
          🗓️ {format(new Date(task.date), "EEEE, MMMM d")}
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          {task.task}
        </h2>

        {task.status === "active" ? (
          <>
            <p className="text-gray-700 text-center mb-3">
              📸 Capture a photo related to the task and describe it.
            </p>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              className="block w-full text-sm mb-3"
            />

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="rounded-lg w-full mb-3 shadow"
              />
            )}

            {response?.image_url && !image && (
              <img
                src={response.image_url}
                alt="existing"
                className="rounded-lg w-full mb-3 shadow"
              />
            )}

            <textarea
              className="w-full p-2 border border-gray-300 rounded-xl mb-4"
              placeholder="Describe your photo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium"
            >
              {response ? "Update Response" : "Submit Response"}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-center text-lg font-semibold mb-3">
              All Responses 📷
            </h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {allResponses.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No one has responded yet.
                </p>
              ) : (
                allResponses.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 p-3 rounded-xl shadow-sm"
                  >
                    <img
                      src={r.image_url}
                      alt="response"
                      className="rounded-lg w-full mb-2"
                    />
                    <p className="text-sm text-gray-700 mb-1">
                      {r.description}
                    </p>
                    <button
                      onClick={() => handleLike(r.id)}
                      className="text-indigo-600 text-sm font-medium"
                    >
                      ❤️ {r.likes_count || 0} Likes
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
