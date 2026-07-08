import { Cta } from "./_components/cta";
import { Features } from "./_components/features";
import { Hero } from "./_components/hero";
import { Marquee } from "./_components/marquee";
import { Metrics } from "./_components/metrics";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <Metrics />
      <Cta />
    </>
  );
}
