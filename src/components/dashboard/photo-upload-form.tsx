"use client";

import { useState } from "react";
import { saveMediaRecord } from "@/app/actions/media";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ne } from "@/lib/i18n/ne";
import { PublishGuidelines } from "@/components/dashboard/publish-guidelines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

type PhotoUploadFormProps = {
  embedded?: boolean;
  onSuccess?: () => void;
};

export function PhotoUploadForm({ embedded, onSuccess }: PhotoUploadFormProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

    if (!file.type.startsWith("image/")) {
      setError(ne.mediaUploader.selectImageError);
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
      type: "photo",
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
    onSuccess?.();
  }

  const form = (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="photo-file">{ne.mediaUploader.imageFile}</Label>
        <Input
          key={fileInputKey}
          id="photo-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div className="overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={ne.mediaUploader.previewAlt}
            className="max-h-48 w-full object-contain"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="photo-title">{ne.mediaUploader.titleLabel}</Label>
        <Input
          id="photo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ne.mediaUploader.titlePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo-description">{ne.mediaUploader.descriptionLabel}</Label>
        <Textarea
          id="photo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={ne.mediaUploader.descriptionPlaceholder}
          rows={3}
        />
      </div>

      {embedded && <PublishGuidelines variant="compact" />}

      <Button
        type="button"
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="w-full"
      >
        {isUploading ? ne.mediaUploader.uploading : ne.mediaUploader.upload}
      </Button>
    </div>
  );

  if (embedded) return form;

  return (
    <div className="rounded-xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <h3 className="mb-1 font-heading text-lg text-foreground">
        {ne.mediaUploader.photo}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {ne.mediaUploader.description}
      </p>
      {form}
    </div>
  );
}
