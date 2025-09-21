import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image?: ImagePlaceholder;
}

export function Hero({ title, subtitle, ctaText, ctaHref, image }: HeroProps) {
  return (
    <section className="container grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
      <div className="flex flex-col items-start space-y-6 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-accent">
          {title}
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          {subtitle}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105"
        >
          <Link href={ctaHref}>
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      {image && (
        <div className="relative w-full h-80 lg:h-full rounded-lg overflow-hidden animate-float">
          <Image
            src={image.imageUrl}
            alt={image.description}
            data-ai-hint={image.imageHint}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority
          />
          <div className="absolute inset-0 rounded-lg ring-4 ring-primary/20 ring-offset-4 ring-offset-background glow-shadow"></div>
        </div>
      )}
    </section>
  );
}
