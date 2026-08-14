import {
  Skill,
  SkillCategoryGroup,
  RecommendationResponse,
  JobDetailResponse,
  ApiResponse,
  DatabaseHealth,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: Failed request to ${endpoint}`);
      }

      return data;
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  }

  public async getHealth(): Promise<{ status: string; database: DatabaseHealth }> {
    return this.request<{ status: string; database: DatabaseHealth }>('/health');
  }

  public async getAllSkills(search?: string): Promise<Skill[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await this.request<ApiResponse<Skill[]>>(`/skills${query}`);
    return res.data || [];
  }

  public async getGroupedSkills(): Promise<SkillCategoryGroup[]> {
    const res = await this.request<ApiResponse<SkillCategoryGroup[]>>('/skills?grouped=true');
    return res.data || [];
  }

  public async getRelatedSkills(skillName: string): Promise<Array<{
    id: string;
    name: string;
    category: string;
    relatedTo: string;
  }>> {
    const res = await this.request<ApiResponse<any>>(`/skills/${encodeURIComponent(skillName)}/related`);
    return res.data || [];
  }

  public async getRecommendations(skills: string[]): Promise<RecommendationResponse> {
    const res = await this.request<ApiResponse<RecommendationResponse>>('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
    if (!res.data) {
      throw new Error('No recommendation data returned from server');
    }
    return res.data;
  }

  public async getJobById(jobId: string, userSkills: string[] = []): Promise<JobDetailResponse> {
    const query = userSkills.length > 0 ? `?userSkills=${encodeURIComponent(userSkills.join(','))}` : '';
    const res = await this.request<ApiResponse<JobDetailResponse>>(`/jobs/${jobId}${query}`);
    if (!res.data) {
      throw new Error('Job details not found');
    }
    return res.data;
  }
}

export const api = new ApiService();
