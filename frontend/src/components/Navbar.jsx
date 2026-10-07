import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { LogOut, User, Home, Settings, Palette, Globe, Type } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const { 
    theme, setTheme, cycleTheme,
    fontFamily, setFontFamily, 
    language, setLanguage, t 
  } = useSettings();

  // Close settings dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowSettings(false);
    navigate('/');
  };

  const cycleFont = () => {
    const fonts = ['serif', 'sans', 'mono'];
    const nextFont = fonts[(fonts.indexOf(fontFamily) + 1) % fonts.length];
    setFontFamily(nextFont);
  };

  const cycleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const themeOptions = [
    { id: 'light', icon: '☀️' },
    { id: 'dark', icon: '🌙' },
    { id: 'ocean', icon: '🌊' },
    { id: 'sunset', icon: '🌅' }
  ];

  return (
    <nav className="shadow-sm border-b sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center space-x-3">
            <div 
              className="font-mono font-bold text-lg px-2 py-0.5 rounded-sm shadow-xs"
              style={{ backgroundColor: 'var(--accent-chalk)', color: 'var(--bg-paper)' }}
            >
              PL
            </div>
            <Link to="/" className="text-xl font-display font-bold transition" style={{ color: 'var(--text-ink)' }}>
              PeerLearn
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-5">
            {user ? (
              <>
                <Link to="/" className="opacity-70 hover:opacity-100 transition p-1" title={t('home')} style={{ color: 'var(--text-ink)' }}>
                  <Home size={18} />
                </Link>
                <Link to="/dashboard" className="transition font-semibold text-sm hover:opacity-80" style={{ color: 'var(--text-ink)' }}>
                  {t('dashboard')}
                </Link>
                <div 
                  className="flex items-center space-x-1.5 py-1 px-2.5 rounded-sm border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-rule)',
                    color: 'var(--text-ink)'
                  }}
                >
                  <User size={15} style={{ color: 'var(--accent-chalk)' }} />
                  <span className="text-xs font-semibold">{user.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="transition font-semibold text-sm hover:opacity-80" style={{ color: 'var(--text-ink)' }}>
                  {t('login')}
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">
                  {t('signup')}
                </Link>
              </>
            )}

            {/* Settings Menu Button & Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 transition rounded-sm flex items-center border cursor-pointer"
                style={{ 
                  backgroundColor: showSettings ? 'var(--bg-card)' : 'transparent',
                  borderColor: showSettings ? 'var(--accent-chalk)' : 'var(--border-rule)',
                  color: showSettings ? 'var(--accent-chalk)' : 'var(--text-ink)'
                }}
                title={t('settings')}
              >
                <Settings size={18} />
              </button>

              {showSettings && (
                <div 
                  className="settings-menu absolute right-0 mt-2 w-64 rounded-sm py-2 z-50 border shadow-2xl animate-in fade-in duration-100"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-rule)',
                    color: 'var(--text-ink)',
                    opacity: 1
                  }}
                >
                  <div className="px-4 py-1.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-rule)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">{t('settings')}</p>
                    <span className="text-[10px] font-mono opacity-50">PeerV4</span>
                  </div>

                  {/* Themes & Colours Section (Dark Mode merged here) */}
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border-rule)' }}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold">
                        <Palette size={14} style={{ color: 'var(--accent-chalk)' }} />
                        {t('themes')}
                      </span>
                      <button
                        onClick={cycleTheme}
                        className="text-[10px] font-mono hover:underline uppercase font-bold"
                        style={{ color: 'var(--accent-chalk)' }}
                        title="Cycle next theme"
                      >
                        {t(theme)} ⟳
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTheme(opt.id)}
                          style={theme === opt.id ? {
                            backgroundColor: 'var(--accent-chalk)',
                            color: 'var(--bg-paper)',
                            borderColor: 'var(--accent-chalk)',
                            fontWeight: 'bold'
                          } : {
                            backgroundColor: 'transparent',
                            color: 'var(--text-ink)',
                            borderColor: 'var(--border-rule)'
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-sm border flex items-center justify-start gap-1.5 font-medium transition cursor-pointer hover:opacity-85"
                        >
                          <span className="text-sm leading-none">{opt.icon}</span>
                          <span className="truncate">{t(opt.id)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fonts Option */}
                  <button 
                    onClick={cycleFont}
                    className="w-full text-left px-4 py-2 text-xs flex items-center justify-between transition hover:opacity-80 cursor-pointer"
                    style={{ color: 'var(--text-ink)' }}
                  >
                    <span className="flex items-center gap-2">
                      <Type size={14} className="opacity-70" />
                      {t('fonts')}
                    </span>
                    <span 
                      className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: 'var(--bg-paper)', 
                        borderColor: 'var(--border-rule)',
                        color: 'var(--text-ink)' 
                      }}
                    >
                      {fontFamily}
                    </span>
                  </button>

                  {/* Language Option */}
                  <button 
                    onClick={cycleLanguage}
                    className="w-full text-left px-4 py-2 text-xs flex items-center justify-between transition hover:opacity-80 cursor-pointer"
                    style={{ color: 'var(--text-ink)' }}
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={14} className="opacity-70" />
                      {t('language')}
                    </span>
                    <span 
                      className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: 'var(--bg-paper)', 
                        borderColor: 'var(--border-rule)',
                        color: 'var(--text-ink)' 
                      }}
                    >
                      {language === 'en' ? 'EN' : 'தமிழ்'}
                    </span>
                  </button>

                  {/* Logout Option (only if logged in) */}
                  {user && (
                    <>
                      <div className="border-t my-1" style={{ borderColor: 'var(--border-rule)' }}></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 transition font-medium cursor-pointer hover:opacity-80"
                        style={{ color: 'var(--color-stamp)' }}
                      >
                        <LogOut size={14} />
                        {t('logout')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
