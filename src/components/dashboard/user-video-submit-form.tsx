"use client";

import { useState } from "react";
import { Link2, Upload } from "lucide-react";
import { publishVideo } from "@/app/actions/video";
import { VIDEO_TYPE } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ne } from "@/lib/i18n/ne";
import { PublishGuidelines } from "@/components/dashboard/publish-guidelines";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

type UserVideoSubmitFormProps = {
  embedded?: boolean;
  onSuccess?: () => void;
};

type SubmitMode = "upload" | "link";

export function UserVideoSubmitForm({
  embedded,
  onSuccess,
}: UserVideoSubmitFormProps) {
  const [mode, setMode] = useState<SubmitMode>("upload");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function handleModeChange(next: SubmitMode) {
    setMode(next);
    setError(null);
    setSuccess(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setExternalUrl("");
    setFileInputKey((key) => key + 1);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(null);

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

    if (!file.type.startsWith("video/")) {
      setError(ne.mediaUploader.selectVideoError);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);

    if (mode === "upload") {
      if (!selectedFile) {
        setError(ne.mediaUploader.chooseFileError);
        setIsPending(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(ne.mediaUploader.signInToUploadError);
        setIsPending(false);
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
        setIsPending(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(storagePath);

      formData.set("videoType", VIDEO_TYPE.UPLOAD);
      formData.set("url", publicUrl);
      formData.set("storagePath", storagePath);
    } else {
      formData.set("videoType", VIDEO_TYPE.EXTERNAL_LINK);
      formData.set("externalUrl", externalUrl);

      if (extractYouTubeVideoId(externalUrl)) {
        setError(ne.videoUploader.youtubeNotAllowed);
        setIsPending(false);
        return;
      }
    }

    const result = await publishVideo(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setTitle("");
    setDescription("");
    setExternalUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileInputKey((key) => key + 1);
    setSuccess(ne.videoUploader.submittedPending);
    setIsPending(false);
    onSuccess?.();
  }

  const form = (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-border/70 bg-muted/80 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
          {success}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("upload")}
        >
          <Upload />
          {ne.videoUploader.uploadTab}
        </Button>
        <Button
          type="button"
          variant={mode === "link" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("link")}
        >
          <Link2 />
          {ne.videoUploader.linkTab}
        </Button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <Label htmlFor="user-video-file">{ne.mediaUploader.videoFile}</Label>
          <Input
            key={fileInputKey}
            id="user-video-file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <video src={previewUrl} controls className="max-h-48 w-full" />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="user-video-link">{ne.videoUploader.externalUrl}</Label>
          <Input
            id="user-video-link"
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder={ne.videoUploader.externalUrlPlaceholder}
            required
          />
          <p className="text-xs text-muted-foreground">
            {ne.videoUploader.externalUrlHint}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="user-video-title">{ne.mediaUploader.titleLabel}</Label>
        <Input
          id="user-video-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ne.mediaUploader.titlePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-video-description">
          {ne.mediaUploader.descriptionLabel}
        </Label>
        <Textarea
          id="user-video-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={ne.mediaUploader.descriptionPlaceholder}
          rows={3}
        />
      </div>

      {embedded && <PublishGuidelines variant="compact" />}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={
          isPending || (mode === "upload" ? !selectedFile : !externalUrl.trim())
        }
        className="w-full"
      >
        {isPending ? ne.videoUploader.submitting : ne.videoUploader.submit}
      </Button>
    </div>
  );

  if (embedded) return form;

  return (
    <div className={cn("surface-card p-6")}>
      <h3 className="mb-1 font-heading text-lg text-foreground">
        {ne.videoUploader.title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {ne.videoUploader.description}
      </p>
      {form}
    </div>
  );
}
