import BackgroundPaths from "@/components/hero-section/BackgroundPaths";
import AnimatedTitle from "@/components/hero-section/AnimatedTitle";
import AnimatedSubtitle from "@/components/hero-section/AnimatedSubtitle";
import InputSection from "@/components/trash/InputSection";

export default function Hero() {
  return (
    <section className="hero" id="input">

      <div className="container hero__content">
        <AnimatedTitle text="EJAKU.ID" />
        <AnimatedSubtitle text="Ejaan Jadi Akurat & Grammar Jadi Sempurna" />
        <div className="hero__input">
          <InputSection />
        </div>
      </div>
    </section>
  );
}