
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/layout/hero';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen home-background">
      <Header />
      <main className="flex-grow">
        <Hero
          title="Unlock Your Future with मार्गdarshak"
          subtitle="Your personalized AI career and skills advisor. We turn career anxiety into a clear, actionable roadmap, designed for students across India."
          ctaText="Begin Your Journey"
          ctaHref="/dashboard"
        />
      </main>
    </div>
  );
}
