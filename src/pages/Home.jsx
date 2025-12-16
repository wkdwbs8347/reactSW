import HeroSection from "../components/home/HeroSection";
import IntroSection from "../components/home/IntroSection";
import FeatureSection from "../components/home/FeatureSection";
import StatsSection from "../components/home/StatsSection";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <IntroSection />
      <FeatureSection />
      <StatsSection />
      <CallToAction />
    </div>
  );
}