/** Form/API discriminator for publishVideo routing */
export const VIDEO_TYPE = {
  YOUTUBE_LINK: "youtube_link",
  UPLOAD: "upload",
  EXTERNAL_LINK: "external_link",
} as const;

export type VideoType = (typeof VIDEO_TYPE)[keyof typeof VIDEO_TYPE];

/** Shared video_source values for media and podcast_episodes tables */
export const VIDEO_SOURCE = {
  UPLOAD: "upload",
  EXTERNAL_LINK: "external_link",
  YOUTUBE_LINK: "youtube_link",
} as const;

export type VideoSource = (typeof VIDEO_SOURCE)[keyof typeof VIDEO_SOURCE];

/** Shared submission_status values for media and podcast_episodes tables */
export const SUBMISSION_STATUS = {
  PENDING: "pending",
  PUBLISHED: "published",
  USER_SUBMITTED: "user_submitted",
} as const;

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];
