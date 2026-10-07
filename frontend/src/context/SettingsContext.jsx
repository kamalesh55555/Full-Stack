import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const translations = {
  en: {
    // Navbar & Settings
    dashboard: 'Dashboard',
    home: 'Home',
    settings: 'Settings',
    logout: 'Log out',
    login: 'Log in',
    signup: 'Sign up',
    themes: 'Themes & Colors',
    light: 'Light',
    dark: 'Dark Mode',
    ocean: 'Ocean Blue',
    sunset: 'Sunset Glow',
    fonts: 'Fonts',
    language: 'Language',
    hello: 'Hello',

    // Dashboard
    welcomeMsg: 'Welcome to your PeerLearn dashboard. Select a university to explore its courses and subjects.',
    browseResources: 'Browse Resources',
    findNotes: 'Find notes & PYQs',
    uploadMaterial: 'Upload Material',
    sharePeers: 'Share with peers',
    liveSessions: 'Live Sessions',
    studyTogether: 'Study together via Meet',
    universities: 'Universities',
    noUniversities: 'No universities found. Please run npx prisma db seed in the backend.',
    courseAvailable: 'course available',
    coursesAvailable: 'courses available',
    browseCourses: 'Browse Courses →',

    // SubjectPage
    resources: 'Resources',
    sessions: 'Live Sessions',
    uploadResource: 'Upload a Resource',
    title: 'Title',
    egUnit1: 'e.g. Unit 1 Notes',
    filePdf: 'File (PDF, PPT, etc.)',
    upload: 'Upload',
    uploading: 'Uploading...',
    cancel: 'Cancel',
    noResources: 'No resources uploaded yet.',
    beFirstShare: 'Be the first to share your notes!',
    uploadFirstResource: 'Upload First Resource',
    by: 'by',
    viewFile: 'View File',
    download: 'Download',
    hostSession: 'Host a Live Session',
    topic: 'Topic',
    egTopic: 'e.g. Unit 3 Doubt Clearing',
    googleMeetLink: 'Google Meet Link',
    date: 'Date',
    time: 'Time',
    createSession: 'Create Session',
    creating: 'Creating...',
    noSessions: 'No live sessions scheduled yet.',
    beFirstHost: 'Be the first to host a study session!',
    hostFirstSession: 'Host First Session',
    upcoming: 'Upcoming',
    past: 'Past',
    hostedBy: 'Hosted by',
    joinMeet: 'Join Meet',
    viewLink: 'View Link',
    contributor: 'Contributor',
    contributors: 'Contributors',

    // Home / Landing
    peerPowered: 'A Peer-Powered Learning Platform',
    heroTitle1: 'Learn from your peers.',
    heroTitle2: 'Share what you know.',
    heroSubtitle: 'One centralized platform for your university curriculum. Find study materials, join live peer-mentoring sessions, and collaborate.',
    getStarted: 'Get Started',
    curriculumMapped: 'Curriculum Mapped',
    curriculumDesc: 'Navigate through your University → Course → Semester → Subject hierarchy.',
    qualityResources: 'Quality Resources',
    qualityDesc: 'Upload and download notes & PYQs. Upvote the best, report the spam.',
    peerMentoring: 'Peer Mentoring',
    peerDesc: 'Host or join live study sessions via Google Meet.',
    supportedUniversities: 'Supported Universities',
    loadingUniversities: 'Loading universities...',
    noUniversitiesFound: 'No universities found. The database may not be seeded yet.',
    authPrompt: 'Log in or create an account to view courses, upload resources, and join sessions.'
  },
  ta: {
    // Navbar & Settings
    dashboard: 'கட்டுப்பாட்டு அறை',
    home: 'முகப்பு',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    login: 'உள்நுழைக',
    signup: 'பதிவு செய்க',
    themes: 'கருப்பொருள்கள் & நிறங்கள்',
    light: 'ஒளி பயன்முறை',
    dark: 'இருண்ட பயன்முறை',
    ocean: 'பெருங்கடல் நீலம்',
    sunset: 'மாலைப்பொழுது',
    fonts: 'எழுத்துருக்கள்',
    language: 'மொழி',
    hello: 'வணக்கம்',

    // Dashboard
    welcomeMsg: 'உங்கள் PeerLearn கட்டுப்பாட்டு அறைக்கு வரவேற்கிறோம். பாடங்களை ஆராய பல்கலைக்கழகத்தை தேர்வு செய்க.',
    browseResources: 'பொருட்களை உலாவுக',
    findNotes: 'குறிப்புகளை தேடுக',
    uploadMaterial: 'பொருளை பதிவேற்றுக',
    sharePeers: 'நண்பர்களுடன் பகிர்க',
    liveSessions: 'நேரடி அமர்வுகள்',
    studyTogether: 'Meet மூலம் ஒன்றாக படிக்கலாம்',
    universities: 'பல்கலைக்கழகங்கள்',
    noUniversities: 'பல்கலைக்கழகங்கள் காணப்படவில்லை.',
    courseAvailable: 'பாடநெறி உள்ளது',
    coursesAvailable: 'பாடநெறிகள் உள்ளன',
    browseCourses: 'பாடநெறிகளை உலாவுக →',

    // SubjectPage
    resources: 'பொருட்கள்',
    sessions: 'நேரடி அமர்வுகள்',
    uploadResource: 'பொருளை பதிவேற்றுக',
    title: 'தலைப்பு',
    egUnit1: 'உ.ம். அலகு 1 குறிப்புகள்',
    filePdf: 'கோப்பு (PDF, PPT)',
    upload: 'பதிவேற்றுக',
    uploading: 'பதிவேற்றப்படுகிறது...',
    cancel: 'ரத்து செய்',
    noResources: 'எந்தப் பொருளும் பதிவேற்றப்படவில்லை.',
    beFirstShare: 'முதல் நபராக குறிப்புகளை பகிர்க!',
    uploadFirstResource: 'முதல் பொருளை பதிவேற்றுக',
    by: 'பதிவேற்றியவர்',
    viewFile: 'கோப்பை காண்க',
    download: 'பதிவிறக்கு',
    hostSession: 'நேரடி அமர்வை நடத்துக',
    topic: 'தலைப்பு',
    egTopic: 'உ.ம். அலகு 3 சந்தேகங்கள்',
    googleMeetLink: 'Google Meet இணைப்பு',
    date: 'தேதி',
    time: 'நேரம்',
    createSession: 'அமர்வை உருவாக்கு',
    creating: 'உருவாக்கப்படுகிறது...',
    noSessions: 'நேரடி அமர்வுகள் ஏதுமில்லை.',
    beFirstHost: 'முதல் நபராக அமர்வை நடத்துக!',
    hostFirstSession: 'முதல் அமர்வை நடத்துக',
    upcoming: 'வரவிருக்கும்',
    past: 'முடிந்தவை',
    hostedBy: 'நடத்துபவர்',
    joinMeet: 'அமர்வில் சேர',
    viewLink: 'இணைப்பை காண்க',
    contributor: 'பங்களிப்பாளர்',
    contributors: 'பங்களிப்பாளர்கள்',

    // Home / Landing
    peerPowered: 'மாணவர் சார்ந்த கற்றல் தளம்',
    heroTitle1: 'தோழர்களிடமிருந்து கற்றுக் கொள்ளுங்கள்.',
    heroTitle2: 'உங்களுக்குத் தெரிந்ததைப் பகிருங்கள்.',
    heroSubtitle: 'உங்கள் பல்கலைக்கழக பாடத்திட்டத்திற்கான ஒரு தளம். குறிப்புகளைப் பெறுங்கள், நேரலை வழிகாட்டுதலில் இணையுங்கள்.',
    getStarted: 'தொடங்குங்கள்',
    curriculumMapped: 'பாடத்திட்ட அமைப்பு',
    curriculumDesc: 'பல்கலைக்கழகம் → பாடநெறி → பருவம் → பாடம் படிநிலைகளை எளிதாக அணுகவும்.',
    qualityResources: 'தரமான குறிப்புகள்',
    qualityDesc: 'குறிப்புகள் & வினாத்தாள்களை பதிவேற்றவும் பதிவிறக்கவும். சிறந்தவற்றை மதிப்பிடவும்.',
    peerMentoring: 'தோழர் வழிகாட்டுதல்',
    peerDesc: 'Google Meet வழியாக நேரலை படிப்பு அமர்வுகளை நடத்தலாம் அல்லது இணையலாம்.',
    supportedUniversities: 'ஆதரிக்கப்படும் பல்கலைக்கழகங்கள்',
    loadingUniversities: 'பல்கலைக்கழகங்கள் ஏற்றப்படுகின்றன...',
    noUniversitiesFound: 'பல்கலைக்கழகங்கள் எதுவும் கிடைக்கவில்லை.',
    authPrompt: 'பாடங்களைக் காண, குறிப்புகளைப் பதிவேற்ற மற்றும் அமர்வுகளில் இணைய உள்நுழையவும்.'
  }
};

export const SettingsProvider = ({ children }) => {
  // Merged theme state: 'light' | 'dark' | 'ocean' | 'sunset'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    if (saved && ['light', 'dark', 'ocean', 'sunset'].includes(saved)) return saved;
    if (localStorage.getItem('theme_dark') === 'true') return 'dark';
    const legacy = localStorage.getItem('theme_color');
    if (legacy && ['ocean', 'sunset'].includes(legacy)) return legacy;
    return 'light';
  });

  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('theme_font') || 'serif');
  const [language, setLanguage] = useState(() => localStorage.getItem('theme_lang') || 'en');

  // Cycle helper
  const cycleTheme = () => {
    const list = ['light', 'dark', 'ocean', 'sunset'];
    const next = list[(list.indexOf(theme) + 1) % list.length];
    setTheme(next);
  };

  // Backwards compatibility helpers
  const darkMode = theme === 'dark';
  const setDarkMode = (val) => setTheme(val ? 'dark' : 'light');
  const colorTheme = theme;
  const setColorTheme = (val) => setTheme(val);

  // Apply theme, font, and language across documentElement, body, and attributes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const themeClasses = ['dark', 'theme-light', 'theme-ocean', 'theme-sunset'];
    root.classList.remove(...themeClasses);
    body.classList.remove(...themeClasses);

    const activeClass = theme === 'dark' ? 'dark' : `theme-${theme}`;
    root.classList.add(activeClass);
    body.classList.add(activeClass);

    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);

    localStorage.setItem('theme_mode', theme);
    localStorage.setItem('theme_dark', theme === 'dark' ? 'true' : 'false');
    localStorage.setItem('theme_color', theme);

    // Font Family
    if (fontFamily === 'sans') {
      document.body.style.fontFamily = 'Inter, sans-serif';
    } else if (fontFamily === 'mono') {
      document.body.style.fontFamily = '"JetBrains Mono", monospace';
    } else {
      document.body.style.fontFamily = '"Source Serif 4", Georgia, serif';
    }
    localStorage.setItem('theme_font', fontFamily);

    // Language
    localStorage.setItem('theme_lang', language);
  }, [theme, fontFamily, language]);

  // Translation helper function
  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        theme, setTheme, cycleTheme,
        darkMode, setDarkMode, 
        colorTheme, setColorTheme, 
        fontFamily, setFontFamily, 
        language, setLanguage,
        t 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
