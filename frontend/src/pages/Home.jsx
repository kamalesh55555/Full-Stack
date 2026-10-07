import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';

const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/academy/universities')
      .then(res => { setUniversities(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="py-8">
      {/* Hero */}
      <section className="text-center mb-16">
        <p className="eyebrow mb-4">{t('peerPowered')}</p>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink leading-tight mb-4">
          {t('heroTitle1')}<br />
          <span className="text-chalk">{t('heroTitle2')}</span>
        </h1>
        <p className="text-lg text-ink/70 max-w-2xl mx-auto mb-8 font-body">
          {t('heroSubtitle')}
        </p>
        {!user && (
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">{t('getStarted')}</Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">{t('login')}</Link>
          </div>
        )}
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
        <div className="card p-6 text-center">
          <div className="bg-chalk/15 text-chalk w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-chalk/30">
            <BookOpen size={28} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">{t('curriculumMapped')}</h3>
          <p className="text-ink/60 text-sm">{t('curriculumDesc')}</p>
        </div>
        <div className="card p-6 text-center">
          <div className="bg-highlight/20 text-highlight w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-highlight/30">
            <Star size={28} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">{t('qualityResources')}</h3>
          <p className="text-ink/60 text-sm">{t('qualityDesc')}</p>
        </div>
        <div className="card p-6 text-center">
          <div className="bg-stamp/15 text-stamp w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-stamp/30">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">{t('peerMentoring')}</h3>
          <p className="text-ink/60 text-sm">{t('peerDesc')}</p>
        </div>
      </section>

      {/* University List */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-ink mb-6 border-b border-rule pb-3">
          <GraduationCap className="inline mr-2 text-chalk" size={24} />
          {t('supportedUniversities')}
        </h2>

        {loading ? (
          <p className="text-ink/50 animate-pulse">{t('loadingUniversities')}</p>
        ) : universities.length === 0 ? (
          <div className="card p-6 text-center text-ink/60">
            {t('noUniversitiesFound')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {universities.map(uni => (
              <div
                key={uni.id}
                onClick={() => user ? navigate(`/university/${uni.id}`) : navigate('/login')}
                className="card p-5 cursor-pointer hover:border-chalk hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-ink group-hover:text-chalk transition">{uni.name}</h3>
                    <p className="text-ink/50 text-sm mt-1">
                      {uni._count?.courses || 0} {uni._count?.courses === 1 ? t('courseAvailable') : t('coursesAvailable')}
                    </p>
                  </div>
                  <span className="text-chalk font-mono text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div className="mt-6 bg-highlight/15 border border-highlight/30 p-4 rounded-sm text-center">
            <p className="text-ink font-medium text-sm">
              🔒 <Link to="/login" className="text-chalk underline font-semibold">{t('login')}</Link> or <Link to="/signup" className="text-chalk underline font-semibold">{t('signup')}</Link> {t('authPrompt')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
