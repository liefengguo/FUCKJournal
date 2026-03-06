import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type AuthorCardProps = {
  contributor: {
    name: string;
    initials: string;
    role: string;
    affiliation: string;
    bio: string;
  };
};

export function AuthorCard({ contributor }: AuthorCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{contributor.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-display text-2xl leading-none">{contributor.name}</p>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {contributor.role}
            </p>
          </div>
        </div>
        <p className="font-serif text-base leading-relaxed text-muted-foreground">
          {contributor.bio}
        </p>
        <p className="mt-auto font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {contributor.affiliation}
        </p>
      </CardContent>
    </Card>
  );
}
