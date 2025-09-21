
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillAssessment, SkillAssessmentResults } from '@/components/dashboard/skill-assessment';
import { CareerPath, CareerTimeline } from '@/components/dashboard/career-path';
import { ProjectIdeas, ProjectIdeaList } from '@/components/dashboard/project-ideas';

import type { ProvideSkillAssessmentOutput } from '@/ai/flows/provide-skill-assessment';
import type { SimulateCareerPathsOutput } from '@/ai/flows/simulate-career-paths';
import type { GenerateProjectIdeasOutput } from '@/ai/flows/generate-project-ideas';
import { useAuth } from '@/hooks/use-auth';

export function DashboardClient() {
  const { user } = useAuth();
  const [assessmentResult, setAssessmentResult] = useState<ProvideSkillAssessmentOutput | null>(null);
  const [careerPathResult, setCareerPathResult] = useState<SimulateCareerPathsOutput | null>(null);
  const [projectIdeasResult, setProjectIdeasResult] = useState<GenerateProjectIdeasOutput | null>(null);
  
  const [activeTab, setActiveTab] = useState('assessment');

  const handleAssessmentComplete = (result: ProvideSkillAssessmentOutput) => {
    setAssessmentResult(result);
    setCareerPathResult(null); // Reset subsequent steps if re-assessing
    setProjectIdeasResult(null);
    setActiveTab('career'); // Move to the next tab
  };

  const handleCareerPathComplete = (result: SimulateCareerPathsOutput) => {
    setCareerPathResult(result);
    setActiveTab('projects'); // Move to the final tab
  };

  const handleProjectIdeasComplete = (result: GenerateProjectIdeasOutput) => {
    setProjectIdeasResult(result);
  };
  
  if (!user) return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="assessment">1. Skill Assessment</TabsTrigger>
        <TabsTrigger value="career" disabled={!assessmentResult}>2. Career Paths</TabsTrigger>
        <TabsTrigger value="projects" disabled={!assessmentResult}>3. Project Ideas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="assessment" className="mt-6">
        <SkillAssessment onAssessmentComplete={handleAssessmentComplete} userId={user.id} />
        {assessmentResult && (
          <div className="mt-8">
            <SkillAssessmentResults {...assessmentResult} />
          </div>
        )}
      </TabsContent>

      <TabsContent value="career" className="mt-6">
        {assessmentResult && (
          <CareerPath
            key={JSON.stringify(assessmentResult)} // Re-mount if assessment changes
            skillsAndInterests={`Strengths: ${assessmentResult.strengths.join(', ')}. Interests: ${assessmentResult.areasForImprovement.join(', ')}`}
            onCareerPathComplete={handleCareerPathComplete}
            userId={user.id}
          />
        )}
        {careerPathResult && <CareerTimeline {...careerPathResult} />}
      </TabsContent>

      <TabsContent value="projects" className="mt-6">
        {assessmentResult && (
           <ProjectIdeas
              key={JSON.stringify(assessmentResult)} // Re-mount if assessment changes
              assessmentResult={assessmentResult}
              onProjectIdeasComplete={handleProjectIdeasComplete}
              userId={user.id}
           />
        )}
        {projectIdeasResult && <ProjectIdeaList {...projectIdeasResult} />}
      </TabsContent>
    </Tabs>
  );
}
