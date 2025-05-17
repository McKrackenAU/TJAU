import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// This is a simple server-side redirect
// When the component mounts, just use a meta refresh tag
// to ensure the redirect happens immediately at the HTML level
export default function BackToLearningPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/learning" />
      <div className="container py-8">
        <h1 className="text-xl font-bold">Redirecting...</h1>
        <p className="text-sm text-muted-foreground mb-8">Returning to Learning Home</p>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    </>
  );
}