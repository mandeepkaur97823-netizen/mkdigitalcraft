import logoEmblem from "../assets/images/mk_logo_emblem_1794468442925.jpg";
import webDesignMockup from "../assets/images/web_design_mockup_1794468444528.jpg";
import videoEditingSuite from "../assets/images/video_editing_pro.jpg";
import graphicDesignPortfolio from "../assets/images/graphic_design_pro.jpg";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "website-design" | "video-editing" | "graphic-design";
  categoryLabel: string;
  description: string;
  details: string;
  tags: string[];
  imageUrl: string;
  previewType: "website" | "video" | "graphic";
  ctaLabel: "View Project" | "View Video";
  duration?: string;
  toolsUsed?: string[];
  isDemo: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  imageUrl: string;
  subcategories: string[];
  ctaText: string;
  whatsappMessage: string;
}

export const brand = {
  name: "MK Digital Craft",
  tagline: "Create • Edit • Design",
  slogan: "Your Digital Partner",
  logoUrl: logoEmblem,
  email: "mandeepkaur97823@gmail.com",
  instagramHandle: "@mk.digitalcraft",
  instagramUrl: "https://www.instagram.com/mk.digitalcraft?obrf=bWFveWxtMXdlMXVr",
  instagramDmUrl: "https://ig.me/m/mk.digitalcraft",
};

export const services: ServiceItem[] = [
  {
    id: "website-design",
    number: "01",
    name: "Website Design & Development",
    shortName: "Website Design",
    description:
      "Modern, responsive websites engineered to elevate credibility and convert visitors.",
    imageUrl: webDesignMockup,
    subcategories: [
      "Business Websites",
      "Landing Pages",
      "Portfolio Websites",
      "Website Redesign",
      "Responsive Design",
    ],
    ctaText: "Start a Web Project",
    whatsappMessage:
      "Hi MK Digital Craft! I’m interested in Website Design & Development. Can we discuss my project?",
  },
  {
    id: "video-editing",
    number: "02",
    name: "Video Editing",
    shortName: "Video Editing",
    description:
      "Sharp pacing, color grading, and narrative cuts built for high audience retention.",
    imageUrl: videoEditingSuite,
    subcategories: [
      "Instagram Reels",
      "Short-Form Content",
      "Promotional Videos",
      "Social Media Videos",
      "Brand Storytelling",
    ],
    ctaText: "Book Video Editing",
    whatsappMessage:
      "Hi MK Digital Craft! I’m looking for Video Editing services. Let’s discuss my footage.",
  },
  {
    id: "graphic-design",
    number: "03",
    name: "Graphic Design",
    shortName: "Graphic Design",
    description:
      "Cohesive brand identities, campaign posters, and digital creatives with visual clarity.",
    imageUrl: graphicDesignPortfolio,
    subcategories: [
      "Social Media Creatives",
      "Brand Identity",
      "Promotional Posters",
      "Marketing Designs",
      "Campaign Creatives",
    ],
    ctaText: "Request Brand Design",
    whatsappMessage:
      "Hi MK Digital Craft! I’m interested in Graphic Design services. Let’s connect.",
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "demo-business-website",
    title: "Business Website Concept",
    category: "website-design",
    categoryLabel: "Website Projects",
    description:
      "Demo responsive storefront layout featuring clean hierarchy and mobile-first navigation.",
    details:
      "Replaceable placeholder concept demonstrating desktop and mobile viewport adaptability, clear service structure, and inquiry conversion flow.",
    tags: ["Demo Concept", "Responsive UI"],
    imageUrl: webDesignMockup,
    previewType: "website",
    ctaLabel: "View Project",
    toolsUsed: ["React", "Tailwind CSS", "Responsive Layout"],
    isDemo: true,
  },
  {
    id: "demo-promo-video",
    title: "Promotional Video Edit Demo",
    category: "video-editing",
    categoryLabel: "Video Editing Projects",
    description:
      "Demo commercial timeline showcasing cinematic color grading, pacing, and sound design.",
    details:
      "Replaceable sample preview illustrating multi-track editing, atmospheric color grading passes, and crisp motion transitions.",
    tags: ["Demo Concept", "Color Grading"],
    imageUrl: videoEditingSuite,
    previewType: "video",
    ctaLabel: "View Video",
    duration: "0:45",
    toolsUsed: ["DaVinci Resolve", "Premiere Pro", "Audio Mix"],
    isDemo: true,
  },
  {
    id: "demo-brand-identity",
    title: "Brand Identity & Poster Concept",
    category: "graphic-design",
    categoryLabel: "Graphic Design Projects",
    description:
      "Demo visual identity system with editorial typography, poster layouts, and social templates.",
    details:
      "Replaceable graphic design showcase demonstrating modular campaign posters, brand typography guidelines, and digital ad assets.",
    tags: ["Demo Concept", "Brand Identity"],
    imageUrl: graphicDesignPortfolio,
    previewType: "graphic",
    ctaLabel: "View Project",
    toolsUsed: ["Illustrator", "Photoshop", "Typography"],
    isDemo: true,
  },
  {
    id: "demo-landing-page",
    title: "Product Landing Page Concept",
    category: "website-design",
    categoryLabel: "Website Projects",
    description:
      "Demo conversion-focused landing page built for fast loading and clear call-to-action flow.",
    details:
      "Replaceable web concept highlighting dark luxury aesthetics, structured product sections, and seamless mobile responsiveness.",
    tags: ["Demo Concept", "Landing Page"],
    imageUrl: webDesignMockup,
    previewType: "website",
    ctaLabel: "View Project",
    toolsUsed: ["Web Architecture", "UI Design", "Performance"],
    isDemo: true,
  },
  {
    id: "demo-reels-edit",
    title: "Short-Form Reels Edit Demo",
    category: "video-editing",
    categoryLabel: "Video Editing Projects",
    description:
      "Demo vertical video cut engineered with beat-synced transitions and kinetic captions.",
    details:
      "Replaceable video showcase designed for Instagram Reels and social campaigns with retention-focused hook framing.",
    tags: ["Demo Concept", "Short-Form Reels"],
    imageUrl: videoEditingSuite,
    previewType: "video",
    ctaLabel: "View Video",
    duration: "0:30",
    toolsUsed: ["After Effects", "Kinetic Type", "Vertical Cut"],
    isDemo: true,
  },
  {
    id: "demo-campaign-creatives",
    title: "Campaign Creatives Concept",
    category: "graphic-design",
    categoryLabel: "Graphic Design Projects",
    description:
      "Demo set of promotional posters and social media ad visuals with high-contrast styling.",
    details:
      "Replaceable marketing design concept displaying cohesive campaign grids, promotional banners, and print-ready layouts.",
    tags: ["Demo Concept", "Campaign Kit"],
    imageUrl: graphicDesignPortfolio,
    previewType: "graphic",
    ctaLabel: "View Project",
    toolsUsed: ["Creative Direction", "Poster Layout", "Social Kit"],
    isDemo: true,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    description: "Understand the client’s goals.",
  },
  {
    step: "02",
    title: "Design",
    description: "Plan the creative direction.",
  },
  {
    step: "03",
    title: "Create",
    description: "Build and refine the project.",
  },
  {
    step: "04",
    title: "Launch",
    description: "Deliver the final work.",
  },
];

export const corePrinciples = [
  {
    title: "Bespoke Direction",
    description: "Tailored creative work—never recycled templates.",
  },
  {
    title: "Modern Execution",
    description: "Clean layouts, sharp motion, and cohesive typography.",
  },
  {
    title: "Unified Studio",
    description: "Web, video, and brand design under one roof.",
  },
  {
    title: "Built for Impact",
    description: "Every detail engineered for clarity and trust.",
  },
];
