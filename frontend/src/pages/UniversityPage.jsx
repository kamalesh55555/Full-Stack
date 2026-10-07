import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, BookOpen } from 'lucide-react';

const UniversityPage = () => {
  const { id } = useParams();
  const { user, authAxios } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAxios.get(`/academy/universities/${id}/courses`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <p className="text-ink/50 py-12 text-center animate-pulse">Loading courses...</p>;
  if (!data) return <p className="text-stamp py-12 text-center">Failed to load data.</p>;

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink/50 mb-6">
        <Link to="/dashboard" className="hover:text-chalk">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="text-ink font-semibold">{data.university?.name}</span>
      </nav>

      <h1 className="text-3xl font-display font-bold text-ink mb-2">{data.university?.name}</h1>
      <p className="text-ink/60 mb-8">{data.courses.length} course{data.courses.length !== 1 ? 's' : ''} available</p>

      {data.courses.length === 0 ? (
        <div className="card p-6 text-center text-ink/50">No courses found for this university.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.courses.map(course => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="card p-5 hover:border-chalk hover:shadow-md transition-all group block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-chalk" />
                    <h3 className="text-lg font-bold text-ink group-hover:text-chalk transition">{course.name}</h3>
                  </div>
                  <p className="text-ink/50 text-sm">
                    {course._count?.subjects || 0} subject{course._count?.subjects !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-chalk font-mono text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversityPage;
