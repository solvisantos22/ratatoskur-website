import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhyItMatters } from '@/components/sections/WhyItMatters';
import { UnderTheHood } from '@/components/sections/UnderTheHood';
import { Team } from '@/components/sections/Team';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WhyItMatters />
      <UnderTheHood />
      <Team />
      <Contact />
    </main>
  );
}
