import { useQuery } from "@tanstack/react-query";
import { useLocation, Link, useRoute } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles, Heart, Brain, Compass } from "lucide-react";
import type { AngelNumber } from "@shared/schema";

export default function AngelNumberDetailPage() {
  const [match, params] = useRoute<{ number: string }>("/angel-numbers/:number");
  const number = match ? params.number : "";

  const { data: angelNumber, isLoading, error } = useQuery<AngelNumber>({
    queryKey: [`/api/angel-numbers/${number}`],
    enabled: !!number,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Angel Number {number}</h1>
        <p>Loading angel number details...</p>
      </div>
    );
  }

  if (error || !angelNumber) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/angel-numbers">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Angel Numbers
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Angel Number {number}</CardTitle>
              <CardDescription>Error</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">
                This angel number could not be found or an error occurred. Please try again later.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/angel-numbers">
                <Button>Back to Angel Numbers Library</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/angel-numbers">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Angel Numbers
          </Button>
        </Link>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl lg:text-4xl">{angelNumber.number}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {angelNumber.name}
                </CardDescription>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" />
                  Meaning
                </h3>
                <Separator className="my-2" />
                <p className="text-muted-foreground">{angelNumber.meaning}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Spiritual Meaning
                </h3>
                <Separator className="my-2" />
                <p className="text-muted-foreground">{angelNumber.spiritualMeaning}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Compass className="h-5 w-5 mr-2 text-primary" />
                  Practical Guidance
                </h3>
                <Separator className="my-2" />
                <p className="text-muted-foreground">{angelNumber.practicalGuidance}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Link to="/angel-numbers">
              <Button variant="outline">View All Angel Numbers</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}