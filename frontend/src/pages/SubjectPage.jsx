import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ThumbsUp, ThumbsDown, Flag, Upload, Video, ExternalLink, Clock, Users } from 'lucide-react';
import Loader from '../components/Loader';
import { useSettings } from '../context/SettingsContext';
import { SERVER_URL } from '../utils/api';

const SubjectPage = () => {
  const { id } = useParams();
  const { user, authAxios } = useAuth();
  const { t } = useSettings();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('resources'); // 'resources' | 'sessions'

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // Session state
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionLink, setSessionLink] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  const [msg, setMsg] = useState('');

  const fetchSubject = () => {
    authAxios.get(`/academy/subjects/${id}`)
      .then(res => { setSubject(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchSubject(); }, [id]);

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader text="Loading subject details..." />;
  if (!subject) return <p className="text-stamp py-12 text-center">Subject not found.</p>;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setMsg('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('subjectId', id);
    try {
      await authAxios.post('/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('✅ Resource uploaded successfully!');
      setUploadTitle('');
      setUploadFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchSubject();
    } catch (err) {
      setMsg('❌ Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleRate = async (resourceId, isHelpful) => {
    try {
      await authAxios.post(`/resources/${resourceId}/rate`, { isHelpful });
      fetchSubject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (resourceId) => {
    const reason = prompt('Why are you reporting this resource?');
    if (!reason) return;
    try {
      await authAxios.post(`/resources/${resourceId}/report`, { reason });
      alert('Report submitted.');
      fetchSubject();
    } catch (err) {
      alert(err.response?.data?.message || 'Report failed');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreatingSession(true);
    try {
      await authAxios.post('/sessions', {
        topic: sessionTopic,
        date: sessionDate,
        time: sessionTime,
        meetLink: sessionLink,
        subjectId: id
      });
      setSessionTopic(''); setSessionDate(''); setSessionTime(''); setSessionLink('');
      fetchSubject();
    } catch (err) {
      alert('Failed to create session: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreatingSession(false);
    }
  };

  const upvotes = (r) => r.ratings?.filter(rt => rt.isHelpful).length || 0;
  const downvotes = (r) => r.ratings?.filter(rt => !rt.isHelpful).length || 0;

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink/50 mb-6 flex-wrap">
        <Link to="/dashboard" className="hover:text-chalk">Dashboard</Link>
        <ChevronRight size={14} />
        <Link to={`/university/${subject.course?.university?.id}`} className="hover:text-chalk">
          {subject.course?.university?.name}
        </Link>
        <ChevronRight size={14} />
        <Link to={`/course/${subject.course?.id}`} className="hover:text-chalk">
          {subject.course?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-ink font-semibold">{subject.code}</span>
      </nav>

      {/* Subject header */}
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="tag-chip mb-2 inline-block">{subject.code}</span>
            <h1 className="text-3xl font-display font-bold text-ink">{subject.name}</h1>
            <p className="text-ink/60 mt-1">{subject.semester} · {subject.course?.name} · {subject.course?.university?.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-rule">
        <button
          onClick={() => setTab('resources')}
          className={`px-4 py-2 font-semibold text-sm transition border-b-2 -mb-px ${tab === 'resources' ? 'border-chalk text-chalk' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          📄 {t('resources')} ({subject.resources?.length || 0})
        </button>
        <button
          onClick={() => setTab('sessions')}
          className={`px-4 py-2 font-semibold text-sm transition border-b-2 -mb-px ${tab === 'sessions' ? 'border-chalk text-chalk' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          🎥 {t('sessions')} ({subject.sessions?.length || 0})
        </button>
      </div>

      {/* Resources Tab */}
      {tab === 'resources' && (
        <div>
          {/* Upload form */}
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Upload size={18} className="text-chalk" /> {t('uploadResource')}
            </h3>
            {msg && <p className="text-sm mb-3 font-medium">{msg}</p>}
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-ink/60 mb-1">{t('title')}</label>
                  <input
                    type="text" required className="input-field"
                    placeholder={t('egUnit1')}
                    value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-ink/60 mb-1">{t('filePdf')}</label>
                  <input
                    type="file" required ref={fileRef}
                    className="w-full text-sm text-ink file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-chalk file:text-paper hover:file:bg-chalk-dark cursor-pointer"
                    onChange={e => setUploadFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button type="submit" disabled={uploading} className="btn-primary whitespace-nowrap px-8 mt-2">
                  {uploading ? t('uploading') : t('upload')}
                </button>
              </div>
            </form>
          </div>

          {/* Resource list */}
          {subject.resources?.length === 0 ? (
            <div className="card p-6 text-center text-ink/50">
              {t('noResources')} {t('beFirstShare')}
            </div>
          ) : (
            <div className="space-y-4">
              {subject.resources.map(r => (
                <div key={r.id} className="card p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-ink truncate">{r.title}</h4>
                    <p className="text-ink/50 text-xs mt-1">
                      {t('by')} {r.uploader?.name || 'Unknown'} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`${SERVER_URL}${r.fileUrl}`}
                      target="_blank" rel="noopener noreferrer"
                      download={r.title}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      <ExternalLink size={14} /> {t('download')}
                    </a>
                    <button onClick={() => handleRate(r.id, true)} className="flex items-center gap-1 text-chalk hover:text-chalk-dark text-sm" title="Helpful">
                      <ThumbsUp size={16} /> <span>{upvotes(r)}</span>
                    </button>
                    <button onClick={() => handleRate(r.id, false)} className="flex items-center gap-1 text-stamp hover:text-red-700 text-sm" title="Not Helpful">
                      <ThumbsDown size={16} /> <span>{downvotes(r)}</span>
                    </button>
                    <button onClick={() => handleReport(r.id)} className="text-ink/40 hover:text-stamp text-sm" title="Report">
                      <Flag size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sessions Tab */}
      {tab === 'sessions' && (
        <div>
          {/* Create session form */}
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Video size={18} className="text-chalk" /> {t('hostSession')}
            </h3>
            <form onSubmit={handleCreateSession} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">{t('topic')}</label>
                <input type="text" required className="input-field" placeholder={t('egTopic')}
                  value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">{t('googleMeetLink')}</label>
                <input type="url" required className="input-field" placeholder="https://meet.google.com/..."
                  value={sessionLink} onChange={e => setSessionLink(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">{t('date')}</label>
                <input type="date" required className="input-field"
                  value={sessionDate} onChange={e => setSessionDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">{t('time')}</label>
                <input type="time" required className="input-field"
                  value={sessionTime} onChange={e => setSessionTime(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={creatingSession} className="btn-primary">
                  {creatingSession ? t('creating') : t('createSession')}
                </button>
              </div>
            </form>
          </div>

          {/* Session list */}
          {subject.sessions?.length === 0 ? (
            <div className="card p-6 text-center text-ink/50">
              {t('noSessions')} {t('beFirstHost')}
            </div>
          ) : (
            <div className="space-y-4">
              {subject.sessions.map(s => (
                <div key={s.id} className="card p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-bold text-ink">{s.topic}</h4>
                    <p className="text-ink/50 text-xs mt-1 flex items-center gap-2">
                      <Clock size={14} />
                      {s.date} at {s.time} · {t('hostedBy')} {s.host?.name || 'Unknown'}
                    </p>
                  </div>
                  <a
                    href={s.meetLink}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    <Video size={14} /> {t('joinMeet')}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
