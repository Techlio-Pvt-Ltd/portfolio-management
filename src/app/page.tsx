import type { Metadata } from "next";
import { getCapabilities, getProfile, getProjects, getReviews, getSiteContent } from "@/lib/content";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkSection from "@/components/WorkSection";
import ReviewsSection from "@/components/ReviewsSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import RevealEffect from "@/components/RevealEffect";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `${profile.name} — ${profile.title}`,
    description: profile.heroLede,
  };
}

export default async function Home() {
  const [profile, site, projects, reviews, capabilities] = await Promise.all([
    getProfile(),
    getSiteContent(),
    getProjects(),
    getReviews(),
    getCapabilities(),
  ]);

  return (
    <>
      <div className="bg-fx" aria-hidden="true">
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>
      <Header profile={profile} site={site} />
      <main id="top">
        <Hero profile={profile} />
        <WorkSection site={site} projects={projects} />
        <ReviewsSection site={site} reviews={reviews} />
        <CapabilitiesSection site={site} capabilities={capabilities} />
        <AboutSection site={site} profile={profile} />
        <ContactSection profile={profile} />
        <Footer site={site} />
      </main>
      <RevealEffect />
    </>
  );
}
