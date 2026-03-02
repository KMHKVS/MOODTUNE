import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, ListMusic } from 'lucide-react';

const PLAYLIST_KEY = 'moodtune-playlists';

export default function AddToPlaylist({ track, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName]     = useState('');
  const [showNew, setShowNew]     = useState(false);
  const [added, setAdded]         = useState(null);
  const ref = useRef();

  useEffect(() => {
    try { setPlaylists(JSON.parse(localStorage.getItem(PLAYLIST_KEY) || '[]')); } catch {}
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isInPlaylist = (playlist) => playlist.tracks.some(t => t.id === track.id);

  const addToPlaylist = (playlistId) => {
    const updated = playlists.map(p => {
      if (p.id !== playlistId) return p;
      if (isInPlaylist(p)) return p;
      return { ...p, tracks: [...p.tracks, track] };
    });
    setPlaylists(updated);
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify(updated));
    setAdded(playlistId);
    setTimeout(() => { setAdded(null); onClose(); }, 800);
  };

  const createAndAdd = () => {
    if (!newName.trim()) return;
    const COVER_GRADIENTS = [['#1db954','#0d7a36'],['#8b5cf6','#4c1d95'],['#ff6b35','#c23b00'],['#00b4d8','#0077b6'],['#e91429','#7d0010'],['#f59e0b','#92400e']];
    const newPlaylist = { id: Date.now(), name: newName.trim(), tracks: [track], gradient: COVER_GRADIENTS[playlists.length % COVER_GRADIENTS.length], createdAt: new Date().toLocaleDateString() };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify(updated));
    setAdded(newPlaylist.id);
    setTimeout(() => { setAdded(null); onClose(); }, 800);
  };

  return (
    <div ref={ref} style={{ position: 'absolute', zIndex: 1000, background: 'var(--bg-highlight)', borderRadius: 12, padding: 8, minWidth: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p style={{ margin: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-subdued)', letterSpacing: 1 }}>ADD TO PLAYLIST</p>

      {playlists.length === 0 && !showNew && (
        <p style={{ margin: '4px 12px 8px', fontSize: 13, color: 'var(--text-subdued)' }}>No playlists yet</p>
      )}

      {playlists.map(p => (
        <button key={p.id} onClick={() => addToPlaylist(p.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', color: isInPlaylist(p) ? 'var(--text-subdued)' : 'var(--text-base)', cursor: isInPlaylist(p) ? 'default' : 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'left' }}>
          <ListMusic size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
          {added === p.id && <Check size={14} style={{ color: 'var(--essential-bright)' }} />}
          {isInPlaylist(p) && added !== p.id && <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>Added</span>}
        </button>
      ))}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4, paddingTop: 4 }}>
        {showNew ? (
          <div style={{ padding: '8px 12px' }}>
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createAndAdd(); if (e.key === 'Escape') setShowNew(false); }}
              placeholder="Playlist name..." style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'var(--text-base)', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={createAndAdd} style={{ flex: 1, padding: '6px', background: 'var(--essential-bright)', border: 'none', borderRadius: 6, color: 'black', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Create & Add</button>
              <button onClick={() => setShowNew(false)} style={{ padding: '6px 10px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text-subdued)', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNew(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', color: 'var(--essential-bright)', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'left' }}>
            <Plus size={15} /> New Playlist
          </button>
        )}
      </div>
    </div>
  );
}