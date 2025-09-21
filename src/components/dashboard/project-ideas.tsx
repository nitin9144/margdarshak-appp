
"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleProjectIdeas } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import type { GenerateProjectIdeasOutput } from '@/ai/flows/generate-project-ideas';
import type { ProvideSkillAssessmentOutput } from '@/ai/flows/provide-skill-assessment';
import { ProjectIdeaCard } from './project-idea-card';

interface ProjectIdeasProps {
  assessmentResult: ProvideSkillAssessmentOutput;
  onProjectIdeasComplete: (result: GenerateProjectIdeasOutput) => void;
  userId: string;
}

export function ProjectIdeas({ assessmentResult, onProjectIdeasComplete, userId }: ProjectIdeasProps) {
  const initialState = { error: null, data: null };
  const [state, dispatch] = useActionState(handleProjectIdeas, initialState);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  useEffect(() => {
    if (state.data) {
      onProjectIdeasComplete(state.data);
    }
  }, [state.data, onProjectIdeasComplete]);

  if (hasBeenTriggered && !state.data && !state.error) {
    return (
        <div className="flex items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Brewing some brilliant project ideas...</p>
        </div>
    );
  }
  
  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Generate Portfolio Project Ideas
        </CardTitle>
        <CardDescription>
          Let's brainstorm some project ideas to showcase your skills. Feel free to add more details about your interests or goals for a more tailored list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={(formData) => {
          setHasBeenTriggered(true);
          dispatch(formData);
        }} className="space-y-4">
          <input type="hidden" name="skills" value={assessmentResult.strengths.join(', ')} />
          <input type="hidden" name="userId" value={userId} />
          <div className="space-y-1">
            <Label htmlFor="interests">Your Interests</Label>
            <Input
              id="interests"
              name="interests"
              placeholder="e.g., Gaming, FinTech, Social Media, Sustainable Technology"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="careerGoals">Your Career Goals</Label>
            <Input
              id="careerGoals"
              name="careerGoals"
              placeholder="e.g., Become a front-end developer, work in a startup"
            />
          </div>
          <SubmitButton />
          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Error</AlertTitle>
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
          Generating...
        </>
      ) : (
        'Get Project Ideas'
      )}
    </Button>
  );
}

export function ProjectIdeaList({ projectIdeas }: GenerateProjectIdeasOutput) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline text-primary mb-2">Your Project Blueprints</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Here are some personalized project ideas to build your portfolio and showcase your talent.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projectIdeas.map((idea, index) => (
          <div key={index} style={{ animation: `fade-in-up ${0.5 + index * 0.1}s ease-out forwards`, opacity: 0 }}>
            <ProjectIdeaCard title={idea.title} description={idea.description} />
          </div>
        ))}
      </div>
    </div>
  );
}
