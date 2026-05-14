"use client";

import { Camera, ImagePlus, UploadCloud, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

export function PlantUploader({ onFile }: { onFile: (file: File | null) => void }) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function accept(file?: File) {
    setError(null);
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPEG, PNG, or WEBP plant photo.");
      return;
    }
    setSelectedFile(file);
    onFile(file);
  }

  function clearSelection() {
    setSelectedFile(null);
    setError(null);
    onFile(null);
  }

  return (
    <section className="space-y-3">
      <label
        htmlFor={inputId}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files[0]); }}
        className={`flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-leaf bg-leaf/10" : "border-forest/20 bg-cream"}`}
      >
        {previewUrl ? (
          <div className="grid w-full gap-4 md:grid-cols-[260px_1fr] md:text-left">
            <img src={previewUrl} alt="Selected plant preview" className="mx-auto aspect-square w-full max-w-64 rounded-3xl object-cover shadow-organic" />
            <div className="flex flex-col justify-center">
              <p className="font-display text-3xl text-forest">Photo selected</p>
              <p className="mt-2 break-all text-sm text-forest/70">{selectedFile?.name}</p>
              <p className="mt-1 text-sm text-forest/60">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-forest px-4 py-2 text-sm font-semibold text-cream"><ImagePlus className="h-4 w-4" />Change photo</span>
                <button type="button" onClick={(event) => { event.preventDefault(); clearSelection(); }} className="inline-flex items-center gap-2 rounded-2xl bg-earth/10 px-4 py-2 text-sm font-semibold text-earth"><X className="h-4 w-4" />Remove</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud className="mb-4 h-12 w-12 text-forest" />
            <p className="font-display text-2xl text-forest">Upload a plant photo</p>
            <p className="mt-2 max-w-sm text-sm text-forest/70">JPEG, PNG, or WEBP. Choose from gallery or take a fresh camera photo.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-cream"><Camera className="h-4 w-4" />Choose photo</span>
          </>
        )}
      </label>
      <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => accept(event.target.files?.[0])} />
      {error && <p className="rounded-2xl bg-earth/10 px-4 py-3 text-sm font-semibold text-earth">{error}</p>}
    </section>
  );
}
