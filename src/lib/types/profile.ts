export type AvatarType = 'portfolio_powerhouse' | 'heritage_builder' | 'changemaker' | 'market_strategist' | 'paradise_planner';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  category: string;
  awarded_at?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  avatar_type: AvatarType | null;
  company: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  investment_focus: string[];
  linkedin_url: string | null;
  website_url: string | null;
  badges: Badge[];
  created_at: string;
  updated_at: string;
}