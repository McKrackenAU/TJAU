import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// This is a special redirect page to handle the
// redirection from the Pendulum course back to the learning page
export default function BackToLearningPage() {
  useEffect(() => {
    // Immediately redirect to the learning page
    window.location.replace('/learning');
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-xl font-bold">Redirecting...</h1>
      <p className="text-sm text-muted-foreground mb-8">Returning to Learning Home</p>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
  );
}