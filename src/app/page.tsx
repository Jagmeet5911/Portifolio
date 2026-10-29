import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import MindCircuit from "@/components/MindCircuit";
import Capabilities from "@/components/Capabilities";
import Work from "@/components/Work";
import Faq from "@/components/Faq";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Motion from "@/components/Motion";
import Experience from "@/components/Experience";
import { marquee } from "@/data/site";

export default function Home() {
  return (
    <>
      <Experience />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Marquee items={marquee} />
        <MindCircuit />
        <Capabilities />
        <Work />
        <Faq />
        <Journey />
        <Marquee items={["Let’s build", "AI engineering", "Agent systems", "Full-stack platforms"]} tone="ink" />
        <Contact />
      </main>
      <Motion />
    </>
  );
}
