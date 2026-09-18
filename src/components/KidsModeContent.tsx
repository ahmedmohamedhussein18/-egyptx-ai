'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { KIDS_FACTS, KIDS_QUIZZES, QuizTopic } from '@/data/kids-content';
import { Smile, Star, Award, ChevronRight, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';

interface KidsProfile {
  id: string;
  nickname: string;
  points: number;
}

interface KidsBadge {
  badge_key: string;
}

export default function KidsModeContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<KidsProfile | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Onboarding
  const [nicknameInput, setNicknameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizTopic | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Facts Carousel
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/kids');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  useEffect(() => {
    // Auto-rotate facts every 8 seconds
    const interval = setInterval(() => {
      setFactIdx(prev => (prev + 1) % KIDS_FACTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Assuming 1 profile per user for now
      const { data: profileData } = await supabase
        .from('kids_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        const { data: badgesData } = await supabase
          .from('kids_badges')
          .select('badge_key')
          .eq('kids_profile_id', profileData.id);

        if (badgesData) {
          setBadges(badgesData.map(b => b.badge_key));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim() || !user) return;
    setSavingProfile(true);
    try {
      const { data, error } = await supabase
        .from('kids_profiles')
        .insert({ user_id: user.id, nickname: nicknameInput.trim(), points: 0 })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setBadges([]);
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      alert('Failed to create profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const startQuiz = (topic: QuizTopic) => {
    setActiveQuiz(topic);
    setCurrentQuestionIdx(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null || !activeQuiz) return;
    
    const correct = optionIdx === activeQuiz.questions[currentQuestionIdx].correctAnswerIndex;
    setSelectedOption(optionIdx);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIdx < activeQuiz.questions.length - 1) {
        setCurrentQuestionIdx(idx => idx + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishQuiz(correct ? score + 1 : score);
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore: number) => {
    setQuizFinished(true);
    if (!profile || !activeQuiz) return;

    const totalQ = activeQuiz.questions.length;
    const allCorrect = finalScore === totalQ;
    const pointsEarned = finalScore * 10;

    try {
      // Award points
      if (pointsEarned > 0) {
        const { data } = await supabase
          .from('kids_profiles')
          .update({ points: profile.points + pointsEarned })
          .eq('id', profile.id)
          .select()
          .single();
        if (data) setProfile(data);
      }

      // Award badge if perfect score and not already earned
      if (allCorrect && !badges.includes(activeQuiz.badgeKey)) {
        await supabase
          .from('kids_badges')
          .insert({ kids_profile_id: profile.id, badge_key: activeQuiz.badgeKey });
        
        setBadges(prev => [...prev, activeQuiz.badgeKey]);
      }
    } catch (err) {
      console.error('Error awarding points/badge:', err);
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  // --- ONBOARDING VIEW ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1628] to-[#1B6B93] text-white flex flex-col items-center justify-center p-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center max-w-lg w-full"
        >
          <Smile className="w-20 h-20 text-[#C9A84C] mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome Explorer!</h1>
          <p className="text-lg text-gray-200 mb-8">Let&apos;s get started! What&apos;s your nickname?</p>
          
          <form onSubmit={createProfile} className="space-y-4">
            <input
              type="text"
              required
              maxLength={20}
              placeholder="Your Nickname"
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              className="w-full text-center text-xl bg-white/20 border-2 border-white/30 rounded-2xl px-6 py-4 text-white placeholder:text-gray-300 focus:outline-none focus:border-[#C9A84C]"
            />
            <button 
              type="submit" 
              disabled={savingProfile || !nicknameInput.trim()}
              className="w-full bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold text-xl py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(201,168,76,0.4)] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {savingProfile ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Start Exploring!'}
            </button>
          </form>
          <p className="text-xs text-white/50 mt-6 text-left">
            Parents: We only store this nickname to track progress. No personal data is collected.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentFact = KIDS_FACTS[factIdx];

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#0A1628] text-white pt-24 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-[#1B6B93]/40 to-transparent p-6 rounded-3xl border border-[#1B6B93]/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C9A84C] rounded-full flex items-center justify-center text-[#0A1628] border-4 border-[#0A1628] shadow-lg">
              <Smile className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Hi, {profile.nickname}!</h1>
              <p className="text-[#4CC9F0] font-medium flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> Explorer Level
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#0A1628] px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-[#C9A84C] font-bold text-3xl">{profile.points}</span>
            <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Points</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Quiz Area */}
            {activeQuiz ? (
              <div className="bg-white/5 border-2 border-[#1B6B93] rounded-3xl p-6 md:p-8 backdrop-blur-md">
                {!quizFinished ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[#4CC9F0] font-bold uppercase text-sm tracking-wider">{activeQuiz.title}</span>
                      <span className="text-gray-400 font-medium text-sm">Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                      {activeQuiz.questions[currentQuestionIdx].question}
                    </h2>
                    
                    <div className="space-y-3">
                      {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                        let btnStyle = "bg-[#0A1628] border-gray-700 hover:border-[#C9A84C] hover:bg-white/5 text-white";
                        if (selectedOption === idx) {
                          if (isCorrect) btnStyle = "bg-green-500/20 border-green-500 text-green-400";
                          else btnStyle = "bg-red-500/20 border-red-500 text-red-400";
                        } else if (selectedOption !== null && idx === activeQuiz.questions[currentQuestionIdx].correctAnswerIndex) {
                          btnStyle = "bg-green-500/20 border-green-500 text-green-400";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg flex items-center justify-between ${btnStyle}`}
                          >
                            {opt}
                            {selectedOption === idx && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                            {selectedOption === idx && !isCorrect && <XCircle className="w-6 h-6" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {score === activeQuiz.questions.length ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
                        <div className="text-6xl mb-4">{activeQuiz.badgeIcon}</div>
                        <h2 className="text-3xl font-bold text-[#C9A84C] mb-2">Perfect Score!</h2>
                        <p className="text-xl text-gray-300">You earned the <strong className="text-white">{activeQuiz.badgeName}</strong> badge and {score * 10} points!</p>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">Great Try!</h2>
                        <p className="text-xl text-gray-300">You scored {score} out of {activeQuiz.questions.length} and earned {score * 10} points.</p>
                        <p className="text-[#4CC9F0] mt-2">Get a perfect score to earn the badge!</p>
                      </motion.div>
                    )}
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Facts Carousel */}
                <div className="bg-gradient-to-br from-[#1B6B93]/30 to-[#0A1628] border border-[#1B6B93]/50 rounded-3xl p-6 md:p-8 backdrop-blur-md">
                  <h2 className="text-[#4CC9F0] font-bold uppercase text-sm tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Did you know?
                  </h2>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFact.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                    >
                      <div className="text-6xl bg-black/30 w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                        {currentFact.emoji}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#C9A84C] mb-2">{currentFact.title}</h3>
                        <p className="text-lg text-gray-200 leading-relaxed">{currentFact.description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Quizzes Grid */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Take a Quiz</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {KIDS_QUIZZES.map(quiz => {
                      const hasBadge = badges.includes(quiz.badgeKey);
                      return (
                        <button
                          key={quiz.id}
                          onClick={() => startQuiz(quiz)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-left transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-3xl">{quiz.badgeIcon}</span>
                              {hasBadge && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-200 group-hover:text-[#C9A84C] transition-colors">{quiz.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{quiz.questions.length} questions</p>
                          </div>
                          <div className="mt-4 text-[#4CC9F0] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            Play Now <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#C9A84C]" /> My Badges
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {KIDS_QUIZZES.map(quiz => {
                  const earned = badges.includes(quiz.badgeKey);
                  return (
                    <div 
                      key={quiz.badgeKey}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all ${
                        earned 
                          ? 'bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/50 shadow-[0_0_15px_rgba(201,168,76,0.2)]' 
                          : 'bg-black/30 border border-white/5 grayscale opacity-50'
                      }`}
                    >
                      <span className="text-4xl mb-2 drop-shadow-md">{quiz.badgeIcon}</span>
                      <span className={`text-xs font-bold leading-tight ${earned ? 'text-[#C9A84C]' : 'text-gray-500'}`}>
                        {quiz.badgeName}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {badges.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  Get a perfect score on a quiz to earn your first badge!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
