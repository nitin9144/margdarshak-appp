
"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleCareerPath } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Map, Milestone, AlertCircle, Bot } from 'lucide-react';
import type { SimulateCareerPathsOutput } from '@/ai/flows/simulate-career-paths';

interface CareerPathProps {
  skillsAndInterests: string;
  onCareerPathComplete: (result: SimulateCareerPathsOutput) => void;
  userId: string;
}

export function CareerPath({ skillsAndInterests, onCareerPathComplete, userId }: CareerPathProps) {
  const initialState = { error: null, data: null };
  const [state, dispatch] = useActionState(handleCareerPath, initialState);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  useEffect(() => {
    if (state.data) {
      onCareerPathComplete(state.data);
    }
  }, [state.data, onCareerPathComplete]);
  
  if (hasBeenTriggered && !state.data && !state.error) {
    return (
        <div className="flex items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Strap in! We're simulating your future...</p>
        </div>
    );
  }

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="text-primary" />
          Simulate Your Career Trajectory
        </CardTitle>
        <CardDescription>
          Based on your skills assessment, let's explore potential career paths. Press the button below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={(formData) => {
          setHasBeenTriggered(true);
          dispatch(formData);
        }}>
          <input type="hidden" name="skillsAndInterests" value={skillsAndInterests} />
          <input type="hidden" name="userId" value={userId} />
          <SubmitButton />
          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Simulation Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Simulating...
        </>
      ) : (
        'Explore Career Paths'
      )}
    </Button>
  );
}


export function CareerTimeline({ careerPaths, summary }: SimulateCareerPathsOutput) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="text-primary animate-float" /> AI Summary</CardTitle>
          <CardDescription className="text-base">{summary}</CardDescription>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-3xl font-bold font-headline text-primary mb-6 text-center">Your Potential Career Roadmap</h2>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-primary/20 after:left-0">
          {careerPaths.map((path, index) => (
            <div key={index} className="relative mb-8" style={{ animation: `fade-in-up ${0.5 + index * 0.1}s ease-out forwards`, opacity: 0 }}>
              <div className="absolute top-1/2 -translate-y-1/2 -left-[36px] h-5 w-5 rounded-full bg-accent border-4 border-background" />
              <Card className="ml-4 hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Milestone className="text-primary" />
                    {path}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
