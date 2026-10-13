import React, { useState, useEffect } from 'react';
import { profileApi } from '../services/api';
import { MasterOptions, StudentProfileData } from '../types';
import {
  Compass,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Layers,
  Heart,
  Sliders,
  Award
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'academics' | 'interests' | 'skills' | 'strengths' | 'preferences'>('academics');
  const [options, setOptions] = useState<MasterOptions | null>(null);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [educationLevel, setEducationLevel] = useState('12th Standard');
  const [educationStatus, setEducationStatus] = useState('12th Standard');
  const [backgroundStream, setBackgroundStream] = useState('Science');
  const [careerTransition, setCareerTransition] = useState('I am from an IT / CS background');
  const [stream, setStream] = useState('Science / Vocational IT');
  const [percentage, setPercentage] = useState<number>(75.0);
  const [schoolCollege, setSchoolCollege] = useState('');
  const [gradYear, setGradYear] = useState<number>(2025);

  const [selectedInterests, setSelectedInterests] = useState<Record<number, number>>({});
  const [selectedSkills, setSelectedSkills] = useState<Record<number, number>>({});
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);

  const [preferences, setPreferences] = useState({
    preferred_work_env: 'Indoor/Office',
    preferred_industry: 'Information Technology',
    budget_max: 40000,
    max_course_duration_months: 12,
    location_type: 'Local / Hybrid',
    expected_salary_min: 25000,
    work_style: 'Hands-on & Computer'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [optRes, profRes] = await Promise.all([
          profileApi.getOptions(),
          profileApi.getProfile()
        ]);
        setOptions(optRes.data);
        const p = profRes.data;
        setProfile(p);

        if (p.education_level) setEducationLevel(p.education_level);
        if (p.education_status) setEducationStatus(p.education_status);
        if (p.background_stream) setBackgroundStream(p.background_stream);
        if (p.career_transition) setCareerTransition(p.career_transition);
        if (p.stream) setStream(p.stream);
        if (p.gpa_or_percentage !== undefined && p.gpa_or_percentage !== null) setPercentage(p.gpa_or_percentage);
        if (p.school_college) setSchoolCollege(p.school_college);
        if (p.graduation_year) setGradYear(p.graduation_year);

        // Map interests
        const intMap: Record<number, number> = {};
        p.interests.forEach(i => { intMap[i.interest_id] = i.interest_level; });
        setSelectedInterests(intMap);

        // Map skills
        const skMap: Record<number, number> = {};
        p.skills.forEach(s => { skMap[s.skill_id] = s.proficiency_level; });
        setSelectedSkills(skMap);

        // Map strengths
        setSelectedStrengths(p.strengths.map(st => st.strength_id));

        if (p.preferences) {
          setPreferences({
            preferred_work_env: p.preferences.preferred_work_env || 'Indoor/Office',
            preferred_industry: p.preferences.preferred_industry || 'Information Technology',
            budget_max: p.preferences.budget_max || 40000,
            max_course_duration_months: p.preferences.max_course_duration_months || 12,
            location_type: p.preferences.location_type || 'Local / Hybrid',
            expected_salary_min: p.preferences.expected_salary_min || 25000,
            work_style: p.preferences.work_style || 'Hands-on & Computer'
          });
        }
      } catch (err: any) {
        setErrorMsg("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInterestToggle = (interestId: number) => {
    setSelectedInterests(prev => {
      const copy = { ...prev };
      if (copy[interestId]) {
        delete copy[interestId];
      } else {
        copy[interestId] = 4; // default high interest level
      }
      return copy;
    });
  };

  const handleInterestLevelChange = (interestId: number, level: number) => {
    setSelectedInterests(prev => ({ ...prev, [interestId]: level }));
  };

  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills(prev => {
      const copy = { ...prev };
      if (copy[skillId]) {
        delete copy[skillId];
      } else {
        copy[skillId] = 3; // default intermediate
      }
      return copy;
    });
  };

  const handleSkillLevelChange = (skillId: number, level: number) => {
    setSelectedSkills(prev => ({ ...prev, [skillId]: level }));
  };

  const handleStrengthToggle = (strengthId: number) => {
    setSelectedStrengths(prev =>
      prev.includes(strengthId) ? prev.filter(id => id !== strengthId) : [...prev, strengthId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        education_level: educationLevel,
        education_status: educationStatus,
        background_stream: backgroundStream,
        career_transition: careerTransition,
        stream,
        gpa_or_percentage: percentage,
        school_college: schoolCollege,
        graduation_year: gradYear,
        interests: Object.entries(selectedInterests).map(([id, lvl]) => ({
          interest_id: parseInt(id),
          interest_level: lvl
        })),
        skills: Object.entries(selectedSkills).map(([id, lvl]) => ({
          skill_id: parseInt(id),
          proficiency_level: lvl
        })),
        strengths: selectedStrengths,
        preferences: preferences,
        academic_records: [
          {
            level: educationLevel,
            stream: stream,
            marks_percentage: percentage,
            passing_year: gradYear,
            board_or_univ: schoolCollege || 'State Board'
          }
        ]
      };

      const res = await profileApi.updateProfile(payload);
      setProfile(res.data);
      setSuccessMsg("Your 6 student profile inputs have been successfully saved!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading profile options...</p>
      </div>
    );
  }

  const proficiencyLabels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
  const interestLabels = ['', 'Slight', 'Moderate', 'Considerable', 'High', 'Passionate'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
              6-Input Evaluation Data
            </span>
            <span className="text-xs text-slate-500">
              Completion: <strong>{profile?.completion_percentage || 0}%</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Student Profile Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Provide accurate details. The transparent scoring engine uses these inputs to calculate your career matches.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 overflow-x-auto pb-1 text-xs sm:text-sm">
        {[
          { id: 'academics', label: '1. Academics', icon: GraduationCap },
          { id: 'interests', label: '2. Interests', icon: Heart },
          { id: 'skills', label: '3. Skills', icon: Layers },
          { id: 'strengths', label: '4. Strengths', icon: Award },
          { id: 'preferences', label: '5. Preferences', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 rounded-t-xl font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Academics */}
      {activeTab === 'academics' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Academic Background & Qualifications</h3>
            <p className="text-xs text-slate-500">Used by the rule-based eligibility layer and academic match weighting (15%).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Completed Qualification</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {options?.education_levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stream / Discipline</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {options?.streams.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aggregate Marks / Percentage (%)</label>
              <input
                type="number"
                min="35"
                max="100"
                step="0.1"
                value={percentage}
                onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">School / Polytechnic College</label>
              <input
                type="text"
                value={schoolCollege}
                onChange={(e) => setSchoolCollege(e.target.value)}
                placeholder="e.g. Govt Vocational Institute, Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passing / Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(parseInt(e.target.value) || 2025)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Skill-First / Non-IT to Tech Pathway Card */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-br from-violet-50 via-indigo-50/50 to-teal-50/40 p-6 rounded-2xl border border-violet-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-600 text-white flex items-center gap-1 shadow-sm">
                  ⚡ Skill-First Pathway
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Skill-First / Non-IT to Tech Transition Setup
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed for students from <strong>Arts, Commerce, non-IT backgrounds</strong>, or candidates with <strong>diplomas, 10th/12th, or dropouts</strong>. Our AI evaluates you based on verifiable practical skills, projects, and portfolio readiness rather than formal college degrees.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Education Status
                  </label>
                  <select
                    value={educationStatus}
                    onChange={(e) => setEducationStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                  >
                    {(options?.education_statuses || [
                      "10th Standard",
                      "12th Standard",
                      "Diploma",
                      "Degree",
                      "Dropout",
                      "Other"
                    ]).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Background / Stream
                  </label>
                  <select
                    value={backgroundStream}
                    onChange={(e) => setBackgroundStream(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                  >
                    {(options?.background_streams || [
                      "Computer Science / IT",
                      "Science",
                      "Commerce",
                      "Arts / Humanities",
                      "Other"
                    ]).map((bs) => (
                      <option key={bs} value={bs}>{bs}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Career Transition Goal
                  </label>
                  <select
                    value={careerTransition}
                    onChange={(e) => setCareerTransition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                  >
                    {(options?.career_transitions || [
                      "I am from an IT / CS background",
                      "I am from Arts / Commerce / Non-IT background and want to enter Tech / IT",
                      "I have low academic marks and want a skill-first entry into Tech",
                      "I am a Diploma / 12th / Non-degree student aiming for IT roles",
                      "Career changer from another industry seeking Tech jobs",
                      "Self-taught / Portfolio-based entry into Tech"
                    ]).map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-violet-100 text-[11px] text-slate-600 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Ethical AI Guidance:</strong> Degree and qualification requirements vary by employer and role. Our platform will provide step-by-step guidance roadmaps (Foundation → Practice Projects → Portfolio → Entry Roles) to help you prepare effectively.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interests */}
      {activeTab === 'interests' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Vocational & Career Interests (30% Match Weight)</h3>
            <p className="text-xs text-slate-500">
              Select domains you find exciting and adjust the intensity slider from 1 (Slight) to 5 (Passionate).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options?.interests.map((it) => {
              const isSelected = selectedInterests[it.id] !== undefined;
              const level = selectedInterests[it.id] || 3;
              return (
                <div
                  key={it.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected ? 'border-teal-500 bg-teal-50/30 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`it-${it.id}`}
                          checked={isSelected}
                          onChange={() => handleInterestToggle(it.id)}
                          className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        />
                        <label htmlFor={`it-${it.id}`} className="font-bold text-sm text-slate-900 cursor-pointer">
                          {it.name}
                        </label>
                      </div>
                      <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-semibold ml-6 inline-block mt-1">
                        {it.category}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 ml-6">{it.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-teal-100 pl-6 space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-teal-800">
                        <span>Interest Level:</span>
                        <span>{interestLabels[level]} ({level}/5)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={level}
                        onChange={(e) => handleInterestLevelChange(it.id, parseInt(e.target.value))}
                        className="w-full accent-teal-600"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Current Skills & Proficiency (20% Match Weight)</h3>
            <p className="text-xs text-slate-500">
              Select existing tools or techniques you know. The engine performs skill-gap analysis against missing levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options?.skills.map((sk) => {
              const isSelected = selectedSkills[sk.id] !== undefined;
              const level = selectedSkills[sk.id] || 2;
              return (
                <div
                  key={sk.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected ? 'border-indigo-500 bg-indigo-50/30 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`sk-${sk.id}`}
                          checked={isSelected}
                          onChange={() => handleSkillToggle(sk.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <label htmlFor={`sk-${sk.id}`} className="font-bold text-sm text-slate-900 cursor-pointer">
                          {sk.name}
                        </label>
                      </div>
                      <span className="text-[10px] text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-semibold ml-6 inline-block mt-1">
                        {sk.category}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 ml-6">{sk.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 pl-6 space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-indigo-800">
                        <span>Current Proficiency:</span>
                        <span>{proficiencyLabels[level]} (Level {level})</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={level}
                        onChange={(e) => handleSkillLevelChange(sk.id, parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Strengths */}
      {activeTab === 'strengths' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Personal Strengths & Attributes (10% Match Weight)</h3>
            <p className="text-xs text-slate-500">Pick qualities that best describe your natural working style.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {options?.strengths.map((st) => {
              const isSelected = selectedStrengths.includes(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => handleStrengthToggle(st.id)}
                  className={`p-4 rounded-2xl border cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{st.name}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                    {st.category}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">{st.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Career & Training Preferences (10% Match Weight)</h3>
            <p className="text-xs text-slate-500">Align recommendations with your family's budget, duration constraints, and work style.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Work Setting</label>
              <select
                value={preferences.preferred_work_env}
                onChange={(e) => setPreferences({ ...preferences, preferred_work_env: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {options?.work_environments.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Industry Sector</label>
              <select
                value={preferences.preferred_industry}
                onChange={(e) => setPreferences({ ...preferences, preferred_industry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {options?.industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Course Fee Budget (₹): <span className="font-bold text-teal-700">₹{preferences.budget_max.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={preferences.budget_max}
                onChange={(e) => setPreferences({ ...preferences, budget_max: parseInt(e.target.value) })}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹5,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Vocational Training Duration: <span className="font-bold text-teal-700">{preferences.max_course_duration_months} Months</span>
              </label>
              <input
                type="range"
                min="3"
                max="36"
                step="3"
                value={preferences.max_course_duration_months}
                onChange={(e) => setPreferences({ ...preferences, max_course_duration_months: parseInt(e.target.value) })}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3 Months</span>
                <span>12 Months</span>
                <span>36 Months</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Monthly Starting Salary (₹)
              </label>
              <input
                type="number"
                min="15000"
                step="5000"
                value={preferences.expected_salary_min}
                onChange={(e) => setPreferences({ ...preferences, expected_salary_min: parseFloat(e.target.value) || 20000 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Working Style</label>
              <select
                value={preferences.work_style}
                onChange={(e) => setPreferences({ ...preferences, work_style: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Hands-on & Computer">Hands-on & Computer Combined</option>
                <option value="Primarily Physical / Workshop">Primarily Workshop & Physical Tools</option>
                <option value="Primarily Computer / Software">Primarily Software & Desk-based</option>
                <option value="People & Service Oriented">People, Hospitality & Care Oriented</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>Save All 6 Profile Inputs</span>
        </button>
      </div>
    </div>
  );
};
