
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleSkillAssessment } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, List, Loader2, Sparkles, AlertCircle, TrendingUp, Paintbrush } from 'lucide-react';
import type { ProvideSkillAssessmentOutput } from '@/ai/flows/provide-skill-assessment';

interface SkillAssessmentProps {
  onAssessmentComplete: (result: ProvideSkillAssessmentOutput) => void;
  userId: string;
}

export function SkillAssessment({ onAssessmentComplete, userId }: SkillAssessmentProps) {
  const initialState = { error: null, data: null };
  const [state, dispatch] = useActionState(handleSkillAssessment, initialState);

  useEffect(() => {
    if (state.data) {
      onAssessmentComplete(state.data);
    }
  }, [state.data, onAssessmentComplete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="text-primary" />
          Paint a Picture of Your Skills
        </CardTitle>
        <CardDescription>
          Describe your experiences, projects, interests, and what you're passionate about. The more detail, the better our AI can understand you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <Textarea
            name="narrative"
            placeholder="For example: 'I'm from Faridabad and I love building small websites. I've learned HTML, CSS, and some JavaScript. I'm really interested in gaming and want to see if I can combine it with my web skills...'"
            rows={8}
            required
            className="focus:ring-2 focus:ring-primary/50"
          />
          <input type="hidden" name="userId" value={userId} />
          <SubmitButton />
          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Assessment Error</AlertTitle>
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
          Analyzing...
        </>
      ) : (
        'Assess My Skills'
      )}
    </Button>
  );
}

export function SkillAssessmentResults({ strengths, areasForImprovement }: ProvideSkillAssessmentOutput) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <h2 className="text-3xl font-bold font-headline text-primary text-center">Your Skill Snapshot</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-green-500/10 dark:bg-green-500/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3" style={{ animation: `fade-in-up ${0.5 + i * 0.1}s ease-out forwards`, opacity: 0 }}>
                  <Sparkles className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
                  <span className="font-medium">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {areasForImprovement.map((area, i) => (
                <li key={i} className="flex items-start gap-3" style={{ animation: `fade-in-up ${0.5 + i * 0.1}s ease-out forwards`, opacity: 0 }}>
                  <Sparkles className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
                  <span className="font-medium">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
