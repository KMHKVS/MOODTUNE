import React from 'react';
import { Home, Search, Music, BookOpen, LayoutDashboard, ListMusic } from 'lucide-react';

const NAV = [
  { id: 'home',      label: 'Home',      icon: Home },
  { id: 'search',    label: 'Search',    icon: Search },
  { id: 'mood',      label: 'Mood Mix',  icon: Music },
  { id: 'library',   label: 'Library',   icon: BookOpen },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const LIBRARY_ITEMS = [
  { emoji: '❤️', bg: '#e91429', label: 'Liked Songs',     sub: 'Playlist',      page: 'library',   tab: 'liked'  },
  { emoji: '🎵', bg: '#1db954', label: 'Mood Mixes',      sub: 'Auto playlist', page: 'mood',      tab: null     },
  { emoji: '🕐', bg: '#333',    label: 'Recently Played', sub: 'Playlist',      page: 'library',   tab: 'recent' },
];

export default function Sidebar({ currentPage, setCurrentPage, setLibraryTab }) {
  const handleLibraryClick = (item) => {
    setCurrentPage(item.page);
    if (item.tab && setLibraryTab) setLibraryTab(item.tab);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎵</div>
        <span className="logo-text">MoodTune</span>
      </div>

      <div className="nav-section">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${currentPage === id ? 'active' : ''}`} onClick={() => setCurrentPage(id)}>
            <Icon size={20} /><span>{label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <p className="sidebar-section-title">Your Library</p>
        <div className="library-items">
          {LIBRARY_ITEMS.map((item) => (
            <div key={item.label} className="library-item" onClick={() => handleLibraryClick(item)}
              style={{ cursor: 'pointer', borderRadius: 8, padding: '6px 8px', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="lib-art" style={{ background: item.bg }}>{item.emoji}</div>
              <div>
                <div className="lib-title">{item.label}</div>
                <div className="lib-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
