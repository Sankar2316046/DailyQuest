"use client";

import supabase from "@/lib/supabase";
import { useRef, useState } from "react";
import Webcam from "react-webcam";


export default function CameraCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const capture = () => {
    const image = webcamRef.current!.getScreenshot();
    setImageSrc(image);
  };

  const uploadImage = async () => {
    if (!imageSrc) return;

    try {
      setUploading(true);
      setMessage("");

      const base64Data = imageSrc.split(",")[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());

      const fileName = `response-${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("responses")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("responses")
        .getPublicUrl(fileName);

      setMessage("✅ Uploaded Successfully!");
      console.log("Public URL:", publicUrl.publicUrl);
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {!imageSrc ? (
        <div className="flex flex-col items-center space-y-3">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment", // back camera for mobile
            }}
            className="rounded-2xl shadow-lg w-full max-w-sm border border-gray-300"
          />
          <button
            onClick={capture}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
          >
            Capture Photo
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <img
            src={imageSrc}
            alt="Captured"
            className="rounded-2xl w-full max-w-xs shadow-md"
          />
          <div className="flex space-x-3">
            <button
              onClick={uploadImage}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => setImageSrc(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              Retake
            </button>
          </div>
        </div>
      )}
      {message && <p className="text-sm text-gray-800">{message}</p>}
    </div>
  );
}
