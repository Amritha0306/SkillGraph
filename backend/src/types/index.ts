export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
}

export interface Location {
  id: string;
  city: string;
  country: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salaryMin?: number;
  salaryMax?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
}

export interface RelatedSkillBridge {
  basedOnSkill: string;
  relatedSkillName: string;
  category?: string;
}

export interface JobRecommendation {
  job: Job;
  company: Company | null;
  location: Location | null;
  allRequiredSkills: string[];
  totalRequiredSkills: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  relatedSkills: RelatedSkillBridge[];
  matchExplanation: string[];
}

export interface JobDetailResponse {
  job: Job;
  company: Company | null;
  location: Location | null;
  requiredSkills: Skill[];
  relatedSkills: Array<{
    skillName: string;
    relatedTo: string;
    category?: string;
  }>;
  connectionInsight?: {
    nodes: Array<{ id: string; label: string; type: 'user_skill' | 'required_skill' | 'missing_skill' | 'related_skill' | 'job' | 'company' | 'location' }>;
    links: Array<{ source: string; target: string; label: string }>;
    narrative: string[];
  };
}

export interface SkillCategoryGroup {
  category: string;
  skills: Skill[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, any>;
}
