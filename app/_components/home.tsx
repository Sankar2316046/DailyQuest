"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import supabase from "@/lib/supabase";
import Image from "next/image";
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
      <main className="flex items-center justify-center min-h-screen text-purple-600 bg-white">
        Loading today's task...
      </main>
    );

  if (!task)
    return (
      <main className="flex items-center justify-center min-h-screen text-black bg-white">
        No task for today.
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white p-4 text-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-7 mt-10 border border-gray-200">
        <h1 className="text-lg sm:text-xl font-semibold text-center mb-1">
          🗓️ {format(new Date(task.date), "EEEE, MMMM d")}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">
          {task.task}
        </h2>

        {task.status === "active" ? (
          <>
            <p className="text-gray-700 text-center mb-3">
              📸 Capture a photo related to the task and describe it.
            </p>

            <label className="block w-full">
              <span className="sr-only">Choose image</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleUpload}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
              />
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="rounded-xl w-full mb-3 shadow ring-1 ring-purple-100"
              />
            )}

            {response?.image_url && !image && (
              <img
                src={response.image_url}
                alt="existing"
                className="rounded-xl w-full mb-3 shadow ring-1 ring-purple-100"
              />
            )}

            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Describe your photo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-md"
            >
              {response ? "Update Response" : "Submit Response"}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-center text-lg font-semibold mb-4 text-gray-900">
              Community Responses 📷
            </h3>
            <div className="max-h-[70vh] overflow-y-auto">
              {allResponses.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No one has responded yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {allResponses.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-purple-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={r.image_url}
                        alt="response"
                        className=" object-cover"
                        width={500}
                        height={500}
                      />
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => handleLike(r.id)}
                            className={`text-xl transition-colors ${r.likes_count && r.likes_count > 0 ? 'text-red-500' : 'text-purple-600'} hover:text-red-500`}
                            aria-label="Like response"
                          >
                            ❤️
                          </button>
                          <span className="text-sm text- font-medium">
                            {r.likes_count || 0} likes
                          </span>
                        </div>
                        <p className="text-purple-600 leading-relaxed">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
