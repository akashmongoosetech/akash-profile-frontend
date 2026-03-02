import { Helmet } from 'react-helmet-async';
import HeroSection from './home/Herosection';
import StatsSection from './home/Statssection';
import ServicesSection from './home/Servicessection';
import SkillsSection from './home/Skillssection';
import Projectssection from './home/Projectssection';
import PipelineSection from './home/Pipelinesection';
import ArchitectureSection from './home/Architecturesection';
import PerformanceSection from './home/Performancesection';
import AchievementsSection from './home/Achievementssection';
import ProcessSection from './home/Processsection';
import TechStackSection from './home/Techstacksection';
import PartnersSection from './home/Partnerssection';
import FaqSection from './home/Faqsection';
import TestimonialsSection from './home/Testimonialssection';
import CTASection from './home/Ctasection';

const Home: React.FC = () => {

  return (
    <>
      <Helmet>
        <title>Akash Raikwar — Full Stack Developer</title>
        <meta name="title" content="Akash Raikwar — Full Stack Developer" />
        <meta name="description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
        <meta property="og:title" content="Akash Raikwar — Full Stack Developer" />
        <meta property="og:description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
        <meta property="twitter:title" content="Akash Raikwar — Full Stack Developer" />
        <meta property="twitter:description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
      </Helmet>
      <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="mt-1">
        <HeroSection />
      </div>
      {/* Enhanced Stats Section */}
      <StatsSection/>
      {/* Enhanced Services Section */}
      <ServicesSection/>
      {/* Skills Preview Section */}
      <SkillsSection/>
      {/* Featured Projects Section */}
      <Projectssection/>
      {/* Live Project Pipeline Section */}
      <PipelineSection/>
      {/* Architecture Snapshot Section */}
      <ArchitectureSection/>
      {/* Performance & Reliability Section */}
      <PerformanceSection/>
      {/* Achievements Section */}
      <AchievementsSection/>
      {/* Process Section */}
      <ProcessSection/>
      {/* Technology Stack Section */}
      <TechStackSection/>
      {/* Partners Section */}
      <PartnersSection/>
      {/* FAQ Section */}
      <FaqSection/>
      {/* Testimonials Section */}
      <TestimonialsSection/>

      {/* Enhanced CTA Section */}
      <CTASection/>
    </div>
    </>
  );
};

export default Home;
