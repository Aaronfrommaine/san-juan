import { Question, InvestorResult, InvestorType } from '../types/questionnaire';

export const questions: Question[] = [
  {
    id: 1,
    question: "What motivates you to invest in Puerto Rico?",
    options: [
      { label: "Build a vacation home", value: "lifestyle" },
      { label: "Expand my portfolio", value: "institutional" },
      { label: "Make an impact", value: "impact" },
      { label: "Reconnect with roots", value: "diaspora" },
      { label: "Maximize tax benefits", value: "hnw" },
    ],
  },
  {
    id: 2,
    question: "What's your preferred investment timeline?",
    options: [
      { label: "Quick returns (1-2 years)", value: "institutional" },
      { label: "Medium term (3-5 years)", value: "hnw" },
      { label: "Long term (5+ years)", value: "diaspora" },
      { label: "Generational wealth", value: "impact" },
      { label: "Flexible timeline", value: "lifestyle" },
    ],
  },
  {
    id: 3,
    question: "What type of properties interest you most?",
    options: [
      { label: "Luxury residences", value: "hnw" },
      { label: "Commercial developments", value: "institutional" },
      { label: "Historic properties", value: "diaspora" },
      { label: "Sustainable projects", value: "impact" },
      { label: "Beachfront homes", value: "lifestyle" },
    ],
  },
  {
    id: 4,
    question: "How involved do you want to be in property management?",
    options: [
      { label: "Fully hands-on", value: "diaspora" },
      { label: "Balanced involvement", value: "impact" },
      { label: "Professional management", value: "hnw" },
      { label: "Strategic oversight", value: "institutional" },
      { label: "Minimal involvement", value: "lifestyle" },
    ],
  },
  {
    id: 5,
    question: "What's your primary investment goal?",
    options: [
      { label: "Capital appreciation", value: "institutional" },
      { label: "Tax optimization", value: "hnw" },
      { label: "Community development", value: "impact" },
      { label: "Cultural preservation", value: "diaspora" },
      { label: "Personal enjoyment", value: "lifestyle" },
    ],
  },
  {
    id: 6,
    question: "How do you approach risk in real estate investments?",
    options: [
      { label: "Data-driven decisions", value: "institutional" },
      { label: "Calculated risks", value: "hnw" },
      { label: "Conservative approach", value: "diaspora" },
      { label: "Impact-focused", value: "impact" },
      { label: "Balanced perspective", value: "lifestyle" },
    ],
  },
  {
    id: 7,
    question: "What's your preferred networking style?",
    options: [
      { label: "Professional events", value: "institutional" },
      { label: "Exclusive circles", value: "hnw" },
      { label: "Community gatherings", value: "diaspora" },
      { label: "Impact-focused groups", value: "impact" },
      { label: "Social connections", value: "lifestyle" },
    ],
  },
];

export const results: Record<InvestorType, InvestorResult> = {
  hnw: {
    title: "Portfolio Powerhouse",
    description: "You're a strategic investor focused on maximizing returns through tax-efficient structures.",
    recommendations: [
      "Focus on Act 60 tax incentive opportunities",
      "Consider luxury rental properties",
      "Explore commercial real estate opportunities",
      "Look into opportunity zones"
    ],
    nextSteps: [
      "Schedule a consultation with our tax experts",
      "Review our luxury property portfolio",
      "Join our HNW investor network",
      "Attend our next tax strategy workshop"
    ]
  },
  diaspora: {
    title: "Heritage Builder",
    description: "You have a deep connection to Puerto Rico and want to contribute to its future while building your legacy.",
    recommendations: [
      "Focus on community-centered developments",
      "Consider historic property renovations",
      "Explore mixed-use developments",
      "Look into local business partnerships"
    ],
    nextSteps: [
      "Connect with local community leaders",
      "Review historic property opportunities",
      "Join our cultural preservation network",
      "Attend our community impact workshop"
    ]
  },
  impact: {
    title: "Changemaker",
    description: "You're driven by creating positive social and environmental impact through your investments.",
    recommendations: [
      "Focus on sustainable development projects",
      "Consider renewable energy investments",
      "Explore affordable housing opportunities",
      "Look into eco-tourism projects"
    ],
    nextSteps: [
      "Connect with sustainability experts",
      "Review green building opportunities",
      "Join our impact investor network",
      "Attend our sustainability workshop"
    ]
  },
  institutional: {
    title: "Market Strategist",
    description: "You take a data-driven approach to identifying and capitalizing on market opportunities.",
    recommendations: [
      "Focus on large-scale developments",
      "Consider commercial real estate portfolios",
      "Explore emerging market opportunities",
      "Look into development projects"
    ],
    nextSteps: [
      "Review our market analysis reports",
      "Schedule a portfolio strategy session",
      "Join our institutional investor network",
      "Attend our market trends workshop"
    ]
  },
  lifestyle: {
    title: "Paradise Planner",
    description: "You're looking to combine lifestyle benefits with smart investment opportunities.",
    recommendations: [
      "Focus on beachfront properties",
      "Consider vacation rental opportunities",
      "Explore luxury residential areas",
      "Look into resort-style developments"
    ],
    nextSteps: [
      "Tour our featured lifestyle properties",
      "Review vacation rental analytics",
      "Join our lifestyle investor network",
      "Attend our property showcase event"
    ]
  }
};