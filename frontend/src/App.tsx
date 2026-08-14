import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { ExploreSkillsPage } from './pages/ExploreSkillsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import { api } from './services/api';
import {
  Skill,
  SkillCategoryGroup,
  RecommendationResponse,
  JobDetailResponse,
  DatabaseHealth,
} from './types';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'match' | 'explore' | 'architecture'>('match');
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'job-details'>('home');

  // Data State
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [groupedSkills, setGroupedSkills] = useState<SkillCategoryGroup[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'JavaScript']);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetailResponse | null>(null);

  // Status & Error State
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isLoadingJobDetail, setIsLoadingJobDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial Load: Skills & DB Health Check
  const loadInitialData = useCallback(async () => {
    setIsLoadingSkills(true);
    setErrorMessage(null);

    try {
      // Check health
      try {
        const healthRes = await api.getHealth();
        setDbHealth(healthRes.database);
      } catch {
        setDbHealth({ connected: false, message: 'Backend unreachable' });
      }

      // Fetch all skills & grouped skills
      const [skillsData, groupsData] = await Promise.all([
        api.getAllSkills(),
        api.getGroupedSkills(),
      ]);

      setAllSkills(skillsData);
      setGroupedSkills(groupsData);
    } catch (err: any) {
      console.error('Failed to load initial SkillGraph data:', err);
      setErrorMessage(
        'SkillGraph is temporarily unable to reach the graph database. Please verify your connection or try again.'
      );
    } finally {
      setIsLoadingSkills(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Skill Selection Handlers
  const handleToggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const handleClearSkills = () => {
    setSelectedSkills([]);
  };

  const handleApplyPreset = (presetSkills: string[]) => {
    setSelectedSkills(presetSkills);
  };

  // Find Matches Action
  const handleFindMatches = async () => {
    if (selectedSkills.length === 0) return;

    setIsLoadingMatches(true);
    setErrorMessage(null);

    try {
      const recData = await api.getRecommendations(selectedSkills);
      setRecommendations(recData);
      setCurrentView('results');
    } catch (err: any) {
      console.error('Failed to fetch recommendations:', err);
      setErrorMessage(err.message || 'Unable to execute graph recommendation query.');
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // View Job Detail Action
  const handleViewJobDetails = async (jobId: string) => {
    setIsLoadingJobDetail(true);
    setErrorMessage(null);

    try {
      const jobData = await api.getJobById(jobId, selectedSkills);
      setSelectedJobDetail(jobData);
      setCurrentView('job-details');
    } catch (err: any) {
      console.error('Failed to fetch job details:', err);
      setErrorMessage(err.message || 'Unable to retrieve job graph details.');
    } finally {
      setIsLoadingJobDetail(false);
    }
  };

  const handleSelectSkillFromExplorer = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills((prev) => [...prev, skillName]);
    }
    setActiveTab('match');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'match') {
            setCurrentView('home');
          }
        }}
        dbHealth={dbHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6">
            <ErrorAlert
              message={errorMessage}
              onRetry={loadInitialData}
            />
          </div>
        )}

        {/* Tab 1: Match Career View */}
        {activeTab === 'match' && (
          <>
            {isLoadingSkills ? (
              <div className="max-w-4xl mx-auto py-10">
                <LoadingSkeleton type="skills" />
              </div>
            ) : currentView === 'home' ? (
              <HomePage
                allSkills={allSkills}
                groupedSkills={groupedSkills}
                selectedSkills={selectedSkills}
                onToggleSkill={handleToggleSkill}
                onClearSkills={handleClearSkills}
                onApplyPreset={handleApplyPreset}
                onFindMatches={handleFindMatches}
                isLoading={isLoadingMatches}
              />
            ) : currentView === 'results' && recommendations ? (
              isLoadingMatches ? (
                <LoadingSkeleton type="cards" />
              ) : (
                <ResultsPage
                  results={recommendations}
                  selectedSkills={selectedSkills}
                  onBackToSearch={() => setCurrentView('home')}
                  onViewJobDetails={handleViewJobDetails}
                />
              )
            ) : currentView === 'job-details' && selectedJobDetail ? (
              isLoadingJobDetail ? (
                <LoadingSkeleton type="details" />
              ) : (
                <JobDetailsPage
                  jobDetail={selectedJobDetail}
                  userSkills={selectedSkills}
                  onBack={() => setCurrentView('results')}
                />
              )
            ) : null}
          </>
        )}

        {/* Tab 2: Explore Skills Graph */}
        {activeTab === 'explore' && (
          <ExploreSkillsPage
            allSkills={allSkills}
            groupedSkills={groupedSkills}
            onSelectSkillForSearch={handleSelectSkillFromExplorer}
          />
        )}

        {/* Tab 3: Graph Architecture & openCypher Schema */}
        {activeTab === 'architecture' && <ArchitecturePage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-300">SkillGraph</span> — Turn your skills into your next opportunity.
          </div>
          <div className="flex items-center space-x-4">
            <span>Intelligent Career Graph Engine</span>
            <span>•</span>
            <span>Direct Skill-to-Role Matching</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
