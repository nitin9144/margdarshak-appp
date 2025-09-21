"use client";

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Lightbulb } from 'lucide-react';

interface ProjectIdeaCardProps {
  title: string;
  description: string;
}

export function ProjectIdeaCard({ title, description }: ProjectIdeaCardProps) {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printableRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Project Brief: ${title}</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
              <style>
                body { font-family: 'Poppins', sans-serif; padding: 2rem; color: #333; }
                h1 { color: #5856d6; font-size: 1.5rem; border-bottom: 2px solid #00c7b6; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                p { font-size: 1rem; line-height: 1.6; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <p>${description.replace(/\n/g, '<br>')}</p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <>
      <div ref={printableRef} className="hidden">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Card className="flex flex-col h-full hover:shadow-primary/20 bg-gradient-to-br from-card to-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-start gap-3">
            <span className="p-2 bg-accent/20 rounded-full">
              <Lightbulb className="h-6 w-6 text-accent flex-shrink-0" />
            </span>
            <span className="pt-1">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePrint} variant="outline" className="w-full hover:bg-accent/20 hover:text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Download Brief
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
