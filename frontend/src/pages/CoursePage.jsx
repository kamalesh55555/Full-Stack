import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, FileText } from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams();
  const { user, authAxios } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAxios.get(`/academy/courses/${id}/subjects`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <p className="text-ink/50 py-12 text-center animate-pulse">Loading subjects...</p>;
  if (!data) return <p className="text-stamp py-12 text-center">Failed to load data.</p>;

  // Group subjects by semester
  const bySemester = {};
  data.subjects.forEach(sub => {
    const sem = sub.semester || 'Other';
    if (!bySemester[sem]) bySemester[sem] = [];
    bySemester[sem].push(sub);
  });

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink/50 mb-6 flex-wrap">
        <Link to="/dashboard" className="hover:text-chalk">Dashboard</Link>
        <ChevronRight size={14} />
        <Link to={`/university/${data.course?.university?.id}`} className="hover:text-chalk">
          {data.course?.university?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-ink font-semibold">{data.course?.name}</span>
      </nav>

      <h1 className="text-3xl font-display font-bold text-ink mb-2">{data.course?.name}</h1>
      <p className="text-ink/60 mb-8">
        {data.course?.university?.name} · {data.subjects.length} subject{data.subjects.length !== 1 ? 's' : ''}
      </p>

      {data.subjects.length === 0 ? (
        <div className="card p-6 text-center text-ink/50">No subjects found for this course.</div>
      ) : (
        Object.keys(bySemester).sort().map(sem => (
          <div key={sem} className="mb-8">
            <h3 className="text-lg font-display font-bold text-chalk mb-3 border-b border-rule pb-2">
              {sem}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bySemester[sem].map(subject => (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className="card p-4 hover:border-chalk hover:shadow-md transition-all group block"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={16} className="text-chalk" />
                        <span className="tag-chip">{subject.code}</span>
                      </div>
                      <h4 className="font-bold text-ink group-hover:text-chalk transition">{subject.name}</h4>
                      <p className="text-ink/50 text-xs mt-1">
                        {subject._count?.resources || 0} resource{subject._count?.resources !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className="text-chalk font-mono group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CoursePage;
