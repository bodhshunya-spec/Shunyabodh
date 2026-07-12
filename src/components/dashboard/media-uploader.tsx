"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, VideoIcon } from "lucide-react";
import { saveMediaRecord } from "@/app/actions/media";
import { createClient } from "@/lib/supabase/client";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function MediaUploader() {
  const router = useRouter();
  const [fileInputKey, setFileInputKey] = useState(0);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function handleTypeChange(type: "photo" | "video") {
    setMediaType(type);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setFileInputKey((key) => key + 1);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(ne.mediaUploader.fileSizeError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const isPhoto = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (mediaType === "photo" && !isPhoto) {
      setError(ne.mediaUploader.selectImageError);
      return;
    }

    if (mediaType === "video" && !isVideo) {
      setError(ne.mediaUploader.selectVideoError);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError(ne.mediaUploader.chooseFileError);
      return;
    }

    setIsUploading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(ne.mediaUploader.signInToUploadError);
      setIsUploading(false);
      return;
    }

    const storagePath = `${user.id}/${Date.now()}-${sanitizeFileName(selectedFile.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(storagePath);

    const result = await saveMediaRecord({
      type: mediaType,
      title: title.trim() || null,
      description: description.trim() || null,
      url: publicUrl,
      storagePath,
    });

    if (result?.error) {
      setError(result.error);
      setIsUploading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileInputKey((key) => key + 1);
    setIsUploading(false);
    router.refresh();
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.mediaUploader.title}
        </CardTitle>
        <CardDescription>{ne.mediaUploader.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mediaType === "photo" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange("photo")}
          >
            <ImageIcon />
            {ne.mediaUploader.photo}
          </Button>
          <Button
            type="button"
            variant={mediaType === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange("video")}
          >
            <VideoIcon />
            {ne.mediaUploader.video}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="media-file">
            {mediaType === "photo"
              ? ne.mediaUploader.imageFile
              : ne.mediaUploader.videoFile}
          </Label>
          <Input
            key={fileInputKey}
            id="media-file"
            type="file"
            accept={mediaType === "photo" ? "image/*" : "video/*"}
            onChange={handleFileChange}
          />
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            {mediaType === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={ne.mediaUploader.previewAlt}
                className="max-h-64 w-full object-contain"
              />
            ) : (
              <video src={previewUrl} controls className="max-h-64 w-full" />
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="media-title">{ne.mediaUploader.titleLabel}</Label>
          <Input
            id="media-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={ne.mediaUploader.titlePlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="media-description">
            {ne.mediaUploader.descriptionLabel}
          </Label>
          <Textarea
            id="media-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={ne.mediaUploader.descriptionPlaceholder}
            rows={3}
          />
        </div>

        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? ne.mediaUploader.uploading : ne.mediaUploader.upload}
        </Button>
      </CardContent>
    </Card>
  );
}
