import React, { useState, useEffect } from 'react';
import { Plus, Play, Trash2, Share2, Music, X, Edit2, Check } from 'lucide-react';
import TrackList from '../components/TrackList';
import { getGenreStyle } from '../utils/helpers';

const PLAYLIST_KEY = 'moodtune-playlists';

function loadPlaylists() {
  try { return JSON.parse(localStorage.getItem(PLAYLIST_KEY) || '[]'); }
  catch { return []; }
}

function savePlaylists(playlists) {
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlists));
}

const COVER_GRADIENTS = [
  ['#1db954','#0d7a36'], ['#8b5cf6','#4c1d95'], ['#ff6b35','#c23b00'],
  ['#00b4d8','#0077b6'], ['#e91429','#7d0010'], ['#f59e0b','#92400e'],
];

export default function Playlists({ playTrack, toggleLike, isLiked, currentTrack, isPlaying }) {
  const [playlists, setPlaylists]       = useState(loadPlaylists);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [newName, setNewName]           = useState('');
  const [editingId, setEditingId]       = useState(null);
  const [editName, setEditName]         = useState('');
  const [shareMsg, setShareMsg]         = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => { savePlaylists(playlists); }, [playlists]);

  const createPlaylist = () => {
    if (!newName.trim()) return;
    const gradient = COVER_GRADIENTS[playlists.length % COVER_GRADIENTS.length];
    const playlist = {
      id: Date.now(),
      name: newName.trim(),
      tracks: [],
      gradient,
      createdAt: new Date().toLocaleDateString(),
    };
    setPlaylists(prev => [...prev, playlist]);
    setNewName('');
    setShowCreate(false);
    setActivePlaylist(playlist.id);
  };

  const deletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activePlaylist === id) setActivePlaylist(null);
    setShowDeleteConfirm(null);
  };

  const renamePlaylist = (id) => {
    if (!editName.trim()) return;
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name: editName.trim() } : p));
    setEditingId(null);
  };

  const removeTrack = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) } : p
    ));
  };

  const sharePlaylist = (playlist) => {
    const text = `🎵 Check out my MoodTune playlist "${playlist.name}"!\n${playlist.tracks.map(t => `• ${t.title} - ${t.artist}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setShareMsg(`Copied "${playlist.name}" to clipboard!`);
    setTimeout(() => setShareMsg(''), 3000);
  };

  const current = playlists.find(p => p.id === activePlaylist);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* Playlist Sidebar */}
      <div style={{ width: 280, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-base)' }}>My Playlists</h2>
          <button onClick={() => setShowCreate(true)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--essential-bright)', border: 'none', color: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} />
          </button>
        </div>

        {/* Create Playlist */}
        {showCreate && (
          <div style={{ background: 'var(--bg-highlight)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-subdued)', fontWeight: 600 }}>NEW PLAYLIST</p>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createPlaylist(); if (e.key === 'Escape') setShowCreate(false); }}
              placeholder="Playlist name..."
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-base)', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createPlaylist} style={{ flex: 1, padding: '8px', background: 'var(--essential-bright)', border: 'none', borderRadius: 8, color: 'black', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Create</button>
              <button onClick={() => { setShowCreate(false); setNewName(''); }} style={{ padding: '8px 12px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'var(--text-subdued)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Playlist List */}
        {playlists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subdued)' }}>
            <Music size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <p style={{ fontSize: 13 }}>No playlists yet.<br />Click + to create one!</p>
          </div>
        ) : (
          playlists.map(playlist => (
            <div key={playlist.id}
              onClick={() => setActivePlaylist(playlist.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 4, background: activePlaylist === playlist.id ? 'var(--bg-highlight)' : 'transparent', transition: 'background 0.2s' }}
              onMouseEnter={e => { if (activePlaylist !== playlist.id) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { if (activePlaylist !== playlist.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 8, background: `linear-gradient(135deg,${playlist.gradient[0]},${playlist.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🎵</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === playlist.id ? (
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') renamePlaylist(playlist.id); }}
                      autoFocus style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--essential-bright)', borderRadius: 4, color: 'var(--text-base)', padding: '2px 6px', fontSize: 13, outline: 'none' }} />
                    <button onClick={() => renamePlaylist(playlist.id)} style={{ background: 'none', border: 'none', color: 'var(--essential-bright)', cursor: 'pointer' }}><Check size={14} /></button>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playlist.name}</div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>{playlist.tracks.length} songs</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Playlist Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 120px 0' }}>
        {!current ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, color: 'var(--text-subdued)' }}>
            <Music size={64} style={{ opacity: 0.2 }} />
            <h3 style={{ color: 'var(--text-base)', margin: 0 }}>Select a playlist</h3>
            <p style={{ margin: 0, fontSize: 14 }}>Or create a new one with the + button</p>
          </div>
        ) : (
          <>
            {/* Playlist Header */}
            <div style={{ background: `linear-gradient(135deg, ${current.gradient[0]}44, var(--bg-base))`, padding: '40px 32px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 24 }}>
                <div style={{ width: 160, height: 160, borderRadius: 16, background: `linear-gradient(135deg,${current.gradient[0]},${current.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', flexShrink: 0 }}>🎵</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--text-subdued)', letterSpacing: 1 }}>PLAYLIST</p>
                  {editingId === current.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') renamePlaylist(current.id); }}
                        autoFocus style={{ fontSize: 32, fontWeight: 900, background: 'transparent', border: 'none', borderBottom: '2px solid var(--essential-bright)', color: 'var(--text-base)', outline: 'none', width: '100%' }} />
                      <button onClick={() => renamePlaylist(current.id)} style={{ background: 'var(--essential-bright)', border: 'none', borderRadius: 8, padding: '8px 16px', color: 'black', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                    </div>
                  ) : (
                    <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 900, color: 'var(--text-base)' }}>{current.name}</h1>
                  )}
                  <p style={{ margin: '0 0 20px', color: 'var(--text-subdued)', fontSize: 14 }}>{current.tracks.length} songs · Created {current.createdAt}</p>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {current.tracks.length > 0 && (
                      <button onClick={() => playTrack(current.tracks[0], current.tracks)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--essential-bright)', border: 'none', borderRadius: 30, color: 'black', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
                        <Play size={18} fill="black" /> Play All
                      </button>
                    )}
                    <button onClick={() => { setEditingId(current.id); setEditName(current.name); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 30, color: 'var(--text-base)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      <Edit2 size={15} /> Rename
                    </button>
                    <button onClick={() => sharePlaylist(current)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 30, color: 'var(--text-base)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      <Share2 size={15} /> Share
                    </button>
                    <button onClick={() => setShowDeleteConfirm(current.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(233,20,41,0.15)', border: '1px solid rgba(233,20,41,0.3)', borderRadius: 30, color: '#e91429', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {shareMsg && (
                <div style={{ background: 'var(--essential-bright)', color: 'black', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>✅ {shareMsg}</div>
              )}
            </div>

            {/* Delete Confirm */}
            {showDeleteConfirm === current.id && (
              <div style={{ margin: '0 32px 16px', background: 'rgba(233,20,41,0.1)', border: '1px solid rgba(233,20,41,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, color: 'var(--text-base)', fontSize: 14 }}>Delete "<strong>{current.name}</strong>"? This cannot be undone.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => deletePlaylist(current.id)} style={{ padding: '8px 16px', background: '#e91429', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                  <button onClick={() => setShowDeleteConfirm(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'var(--text-subdued)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Tracks */}
            <div style={{ padding: '0 32px' }}>
              {current.tracks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subdued)' }}>
                  <Music size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.2 }} />
                  <h3 style={{ color: 'var(--text-base)', marginBottom: 8 }}>This playlist is empty</h3>
                  <p style={{ fontSize: 14 }}>Add songs by clicking the <strong>⋮</strong> menu on any track</p>
                </div>
              ) : (
                <div>
                  <div className="track-list">
                    <div className="track-list-header">
                      <span className="col-num">#</span>
                      <span className="col-title">TITLE</span>
                      <span className="col-genre hide-mobile">GENRE</span>
                      <span className="col-bpm hide-mobile">BPM</span>
                      <span className="col-actions">ACTIONS</span>
                    </div>
                    {current.tracks.map((track, idx) => {
                      const style   = getGenreStyle(track.genre);
                      const playing = currentTrack?.id === track.id && isPlaying;
                      const active  = currentTrack?.id === track.id;
                      return (
                        <div key={track.id} className={`track-row ${active ? 'active' : ''}`} onDoubleClick={() => playTrack(track, current.tracks)}>
                          <span className="col-num">
                            {playing ? <span style={{ color: 'var(--essential-bright)' }}>▶</span> : <span style={{ color: 'var(--text-subdued)' }}>{idx + 1}</span>}
                          </span>
                          <div className="col-title" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <div className="track-art" style={{ background: `linear-gradient(135deg,${style.c1},${style.c2})`, flexShrink: 0, cursor: 'pointer' }} onClick={() => playTrack(track, current.tracks)}>
                              {playing ? '▶' : style.emoji}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 14, color: active ? 'var(--essential-bright)' : 'var(--text-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'inherit' }}>{track.title}</div>
                              <div style={{ fontSize: 13, color: 'var(--text-subdued)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'inherit' }}>{track.artist}</div>
                            </div>
                          </div>
                          <span className="col-genre hide-mobile">
                            <span style={{ background: `linear-gradient(135deg,${style.c1}33,${style.c2}33)`, color: style.c1, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{track.genre}</span>
                          </span>
                          <span className="col-bpm hide-mobile" style={{ color: 'var(--text-subdued)', fontSize: 13 }}>{track.tempo} BPM</span>
                          <div className="col-actions" style={{ display: 'flex', gap: 6 }}>
                            <button className="icon-btn" onClick={() => playTrack(track, current.tracks)}>{playing ? '⏸' : '▶'}</button>
                            <button className="icon-btn" onClick={() => removeTrack(current.id, track.id)} title="Remove from playlist" style={{ color: '#e91429' }}>
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}