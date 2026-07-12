import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

type AccountDetailsProps = {
  email: string;
  fullName: string | null;
  username: string | null;
  bio: string | null;
};

export function AccountDetails({
  email,
  fullName,
  username,
  bio,
}: AccountDetailsProps) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.profile.accountDetails}
        </CardTitle>
        <CardDescription>{ne.profile.hubDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <DetailRow label={ne.profile.fullName} value={fullName || "—"} />
        <DetailRow label={ne.profile.email} value={email} />
        <DetailRow label={ne.profile.username} value={username ? `@${username}` : "—"} />
        <DetailRow label={ne.profile.bio} value={bio || "—"} multiline />
      </CardContent>
    </Card>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

function DetailRow({ label, value, multiline }: DetailRowProps) {
  return (
    <div className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-foreground ${multiline ? "leading-relaxed" : ""}`}>
        {value}
      </p>
    </div>
  );
}
