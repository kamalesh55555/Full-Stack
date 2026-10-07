import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Navigate, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Upload, Video } from 'lucide-react';

const Dashboard = () => {
  const { user, authAxios } = useAuth();
  const { t } = useSettings();
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    authAxios.get('/academy/universities')
      .then(res => setUniversities(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="py-6">
      {/* Welcome banner */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-display font-bold text-ink mb-1">{t('hello')}, {user.name}!</h2>
        <p className="text-ink/60">{t('welcomeMsg')}</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 flex items-center gap-3">
          <BookOpen className="text-chalk" size={22} />
          <div>
            <p className="font-bold text-ink text-sm">{t('browseResources')}</p>
            <p className="text-ink/50 text-xs">{t('findNotes')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Upload className="text-highlight" size={22} />
          <div>
            <p className="font-bold text-ink text-sm">{t('uploadMaterial')}</p>
            <p className="text-ink/50 text-xs">{t('sharePeers')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Video className="text-stamp" size={22} />
          <div>
            <p className="font-bold text-ink text-sm">{t('liveSessions')}</p>
            <p className="text-ink/50 text-xs">{t('studyTogether')}</p>
          </div>
        </div>
      </div>

      {/* Universities */}
      <h3 className="text-xl font-display font-bold text-ink mb-4 border-b border-rule pb-2">
        <GraduationCap className="inline mr-2 text-chalk" size={20} />
        {t('universities')}
      </h3>

      {universities.length === 0 ? (
        <div className="card p-6 text-center text-ink/50">
          {t('noUniversities')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map(uni => (
            <Link
              key={uni.id}
              to={`/university/${uni.id}`}
              className="card p-5 hover:border-chalk hover:shadow-md transition-all group block"
            >
              <h4 className="text-lg font-bold text-ink group-hover:text-chalk transition">{uni.name}</h4>
              <p className="text-ink/50 text-sm mt-1">
                {uni._count?.courses || 0} {uni._count?.courses === 1 ? t('courseAvailable') : t('coursesAvailable')}
              </p>
              <p className="text-chalk text-sm mt-3 font-semibold group-hover:underline">
                {t('browseCourses')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
