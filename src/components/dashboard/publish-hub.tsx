"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, FileText, ImageIcon, VideoIcon } from "lucide-react";
import { ArticleEditor } from "@/components/dashboard/article-editor";
import { PhotoUploadForm } from "@/components/dashboard/photo-upload-form";
import { UserVideoSubmitForm } from "@/components/dashboard/user-video-submit-form";
import { YoutubeEmbedForm } from "@/components/dashboard/youtube-embed-form";
import { PublishGuidelines } from "@/components/dashboard/publish-guidelines";
import { Button } from "@/components/ui/button";
import { ne } from "@/lib/i18n/ne";
import { cn } from "@/lib/utils";

type PublishStep = "menu" | "article" | "photo" | "video" | "podcast";

type PublishHubProps = {
  isAdmin: boolean;
};

export function PublishHub({ isAdmin }: PublishHubProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<PublishStep>("menu");

  function handleOpen() {
    setStep("menu");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setStep("menu");
  }

  function handleSuccess() {
    handleClose();
    router.refresh();
  }

  function getStepTitle() {
    switch (step) {
      case "menu":
        return ne.dashboard.publishTitle;
      case "article":
        return ne.dashboard.publishArticle;
      case "photo":
        return ne.dashboard.publishPhoto;
      case "video":
        return ne.dashboard.publishVideo;
      case "podcast":
        return ne.dashboard.publishPodcast;
      default:
        return ne.dashboard.publishTitle;
    }
  }

  return (
    <>
      <Button size="lg" onClick={handleOpen} className="w-full sm:w-auto">
        {ne.dashboard.publish}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/70 bg-card/95 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-dialog-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-card/95 px-6 py-4">
              <div>
                {step !== "menu" && (
                  <button
                    type="button"
                    onClick={() => setStep("menu")}
                    className="mb-1 text-xs text-muted-foreground transition-colors hover:text-foreground/90"
                  >
                    {ne.dashboard.publishBack}
                  </button>
                )}
                <h2
                  id="publish-dialog-title"
                  className="font-heading text-lg text-foreground"
                >
                  {getStepTitle()}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                {ne.dashboard.publishClose}
              </Button>
            </div>

            <div className="px-6 py-6">
              {step === "menu" && (
                <div className="space-y-3">
                  <PublishGuidelines className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {ne.dashboard.publishDescription}
                  </p>
                  <PublishOption
                    icon={<FileText className="size-5" />}
                    label={ne.dashboard.publishArticle}
                    onClick={() => setStep("article")}
                  />
                  <PublishOption
                    icon={<ImageIcon className="size-5" />}
                    label={ne.dashboard.publishPhoto}
                    onClick={() => setStep("photo")}
                  />
                  <PublishOption
                    icon={<VideoIcon className="size-5" />}
                    label={ne.dashboard.publishVideo}
                    onClick={() => setStep("video")}
                  />
                  {isAdmin && (
                    <PublishOption
                      icon={<Clapperboard className="size-5" />}
                      label={ne.dashboard.publishPodcast}
                      onClick={() => setStep("podcast")}
                    />
                  )}
                </div>
              )}

              {step === "article" && (
                <ArticleEditor embedded onSuccess={handleSuccess} />
              )}

              {step === "photo" && (
                <PhotoUploadForm embedded onSuccess={handleSuccess} />
              )}

              {step === "video" && (
                <UserVideoSubmitForm embedded onSuccess={handleSuccess} />
              )}

              {step === "podcast" && isAdmin && (
                <YoutubeEmbedForm embedded onSuccess={handleSuccess} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type PublishOptionProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function PublishOption({ icon, label, onClick }: PublishOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border border-border/70 bg-card/70 px-5 py-4",
        "text-left transition-colors hover:border-border hover:bg-muted"
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium text-foreground">{label}</span>
    </button>
  );
}
