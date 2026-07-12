import { formatDateTime } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type MessageListProps = {
  messages: ContactMessageItem[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.dashboard.messages}
        </CardTitle>
        <CardDescription>{ne.dashboard.messagesDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/50 px-6 py-10 text-center text-sm text-muted-foreground">
            {ne.dashboard.noMessages}
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((item) => (
              <li key={item.id}>
                <article className="rounded-xl border border-border/70 bg-card/70 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/40 pb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {ne.dashboard.messageName}
                      </p>
                      <p className="font-medium text-foreground">{item.name}</p>
                    </div>
                    <time
                      dateTime={item.created_at}
                      className="text-xs text-muted-foreground"
                    >
                      {ne.dashboard.messageDate}: {formatDateTime(item.created_at)}
                    </time>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      {ne.dashboard.messageEmail}
                    </p>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      {ne.dashboard.messageContent}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {item.message}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
