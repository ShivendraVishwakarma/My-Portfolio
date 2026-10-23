import { useCallback, useState } from "react";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Chatbot from "./components/Chatbot";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import LoadingScreen from "./components/LoadingScreen";
import Philosophy from "./components/Philosophy";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import ScrollProgress from "./components/ScrollProgress";
import SmoothScroll from "./components/SmoothScroll";
import StaggeredMenu from "./components/StaggeredMenu";
import { menuItems, socials } from "./data/profile";

const menuSocials = socials.map((s) => ({ label: s.label, link: s.href }));

export default function App() {
  const [loading, setLoading] = useState(true);
  const onLoaded = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen onComplete={onLoaded} />}
      {!loading && <ScrollProgress />}
      {!loading && <Chatbot />}
      <div className="noise-overlay" aria-hidden="true" />
      {!loading && (
        <StaggeredMenu
          position="left"
          items={menuItems}
          socialItems={menuSocials}
          displaySocials
          displayItemNumbering
          colors={["#0d0d0f", "#1e1e24"]}
          accentColor="#A02A22"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#A02A22"
        />
      )}
      <SmoothScroll>
        <main>
          <Hero />
          <Philosophy />
          <Projects />
          <Skills />
          <Experience />
          <Certifications />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
