
import { getUserData } from "@/app/auth-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from 'next/headers';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BarChart, Briefcase, Lightbulb, TrendingUp, CheckCircle, Target, Edit, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import AppLayout from "../layout-app";
import Link from "next/link";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user-session');
  
  if (!userCookie) {
    redirect('/login');
  }

  const user = JSON.parse(userCookie.value);
  const data = await getUserData(user.id);

  const { assessmentResult, careerPathResult, projectIdeasResult } = 'error' in data 
    ? { assessmentResult: null, careerPathResult: null, projectIdeasResult: null } 
    : data;

  const content = () => {
    if (!assessmentResult && !careerPathResult && !projectIdeasResult) {
      return (
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
          <p className="text-muted-foreground">You haven't generated any insights yet. Go to the <Link href="/dashboard" className="text-primary underline">dashboard</Link> to get started!</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto my-10 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-1/3">
            <Card className="shadow-lg">
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                   <AvatarImage
                    src={"https://picsum.photos/seed/user-profile/128/128"}
                    alt="Profile Picture"
                    data-ai-hint="person avatar"
                    className="shadow-md"
                  />
                  <AvatarFallback>{user?.email?.[0].toUpperCase() || 'S'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-primary">{user?.email?.split('@')[0] || 'Student'}</h2>
                    <p className="text-muted-foreground">Student</p>
                </div>
                <div className="w-full text-center space-y-2 mt-4">
                  <Button className="w-full" disabled><Edit /> Edit Profile</Button>
                  <Button asChild variant="secondary" className="w-full">
                      <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3">
            <Card className="shadow-lg p-6">
              <h2 className="text-3xl font-semibold text-primary mb-6">Your Saved Insights</h2>
              <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="assessment">
                {assessmentResult && (
                  <Card>
                    <AccordionItem value="assessment" className="border-b-0">
                      <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-3"><BarChart className="text-primary" />Skill Snapshot</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-3"><CheckCircle className="text-green-500" />Strengths</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                              {assessmentResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-3"><TrendingUp className="text-blue-500" />Areas for Growth</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                              {assessmentResult.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                )}
                {careerPathResult && (
                  <Card>
                    <AccordionItem value="career" className="border-b-0">
                      <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-3"><Briefcase className="text-primary" />Career Roadmap</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                        <p className="mb-4 text-muted-foreground">{careerPathResult.summary}</p>
                        <h4 className="font-semibold mb-2">Potential Paths:</h4>
                        <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                          {careerPathResult.careerPaths.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                )}
                {projectIdeasResult && (
                  <Card>
                    <AccordionItem value="projects" className="border-b-0">
                      <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-3"><Lightbulb className="text-primary" />Project Blueprints</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                        <div className="space-y-4">
                          {projectIdeasResult.projectIdeas.map((p, i) => (
                            <div key={i} className="p-4 border rounded-lg bg-secondary/50">
                              <h4 className="font-semibold text-lg flex items-center gap-2"><Target/> {p.title}</h4>
                              <p className="text-muted-foreground mt-1">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                )}
              </Accordion>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      {content()}
    </AppLayout>
  )
}
