import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { BoardToolbar } from '../../components/board/BoardToolbar.jsx';
import { TacticalCanvas } from '../../components/board/TacticalCanvas.jsx';
import { PlayLibrary, PlayLibraryHorizontal } from '../../components/plays/PlayLibrary.jsx';
import { PlayMetadata } from '../../components/plays/PlayMetadata.jsx';
import { PlayerTable } from '../../components/players/PlayerTable.jsx';
import { PlayerDetailCard } from '../../components/players/PlayerDetailCard.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { useBoardStore } from '../../stores/board.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { toast } from '../../stores/toast.store.js';

export function BoardPage() {
  const navigate = useNavigate();
  const plays = usePlayStore((s) => s.plays);
  const activePlayId = usePlayStore((s) => s.activePlayId);
  const setActivePlay = usePlayStore((s) => s.setActivePlay);
  const upsertPlay = usePlayStore((s) => s.upsertPlay);
  const deletePlay = usePlayStore((s) => s.deletePlay);
  const activePlay = plays.find((p) => p.id === activePlayId) || plays[0];

  const view = useBoardStore((s) => s.view);
  const setView = useBoardStore((s) => s.setView);
  const selectedObjectId = useBoardStore((s) => s.selectedObjectId);
  const selectObject = useBoardStore((s) => s.selectObject);
  const pushHistory = useBoardStore((s) => s.pushHistory);
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);

  const players = usePlayerStore((s) => s.players);
  const selectedPlayerId = usePlayerStore((s) => s.selectedPlayerId);
  const setSelectedPlayer = usePlayerStore((s) => s.setSelectedPlayer);
  const addPlayer = usePlayerStore((s) => s.addPlayer);
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  const [saving, setSaving] = useState(false);
  const [fitNonce, setFitNonce] = useState(0); // bump to remount canvas (reset transient state)

  const handleSceneChange = (nextScene) => {
    pushHistory(activePlay.scene);
    upsertPlay({ ...activePlay, scene: nextScene });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`Saved "${activePlay.title}"`);
    }, 500);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/board?play=${activePlay.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Share link copied to clipboard');
    } catch {
      toast.info(link);
    }
  };

  const handleNewPlay = () => {
    const title = window.prompt('New play title:', 'Untitled Play');
    if (title === null) return;
    const newPlay = {
      id: `play_${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim() || 'Untitled Play',
      category: 'Offense',
      tags: ['Offense'],
      description: 'New play draft.',
      scene: {
        players: [
          { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
          { id: 't2', label: '2', x: 820, y: 540 },
          { id: 't3', label: '3', x: 180, y: 540 },
          { id: 't4', label: '4', x: 380, y: 360 },
          { id: 't5', label: '5', x: 620, y: 360 }
        ],
        drawings: []
      }
    };
    upsertPlay(newPlay);
    setActivePlay(newPlay.id);
    toast.success(`Created "${newPlay.title}"`);
  };

  const handleRename = (play) => {
    const next = window.prompt('Rename play:', play.title);
    if (!next || next.trim() === '' || next === play.title) return;
    upsertPlay({ ...play, title: next.trim() });
    toast.success(`Renamed to "${next.trim()}"`);
  };

  const handlePlayAction = (action, play) => {
    if (action === 'rename') return handleRename(play);
    if (action === 'share')  return handleShare();
    if (action === 'duplicate') {
      const dup = {
        ...play,
        id: `play_${Math.random().toString(36).slice(2, 8)}`,
        title: `${play.title} (Copy)`
      };
      upsertPlay(dup);
      setActivePlay(dup.id);
      toast.success(`Duplicated "${play.title}"`);
      return;
    }
    if (action === 'delete') {
      if (window.confirm(`Delete "${play.title}"?`)) {
        deletePlay(play.id);
        toast.show(`Deleted "${play.title}"`);
      }
    }
  };

  const handleAddPlayer = () => {
    const name = window.prompt('New player name:');
    if (!name || !name.trim()) return;
    const position = (window.prompt('Position (PG/SG/SF/PF/C):', 'PG') || 'PG').toUpperCase();
    const p = addPlayer({ name: name.trim(), position });
    toast.success(`Added ${p.name} as #${p.jersey}`);
  };

  const handleFitToScreen = () => {
    setFitNonce((n) => n + 1);
    selectObject(null);
    toast.info('Reset to fit');
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Court Board</h1>
          <p className="text-sm text-ink-muted mt-1">Design, visualize, and perfect your game plan.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Icon.Save size={16} />} onClick={handleSave} className="hidden sm:inline-flex">
            {saving ? 'Saving…' : 'Save Play'}
          </Button>
          <Button variant="secondary" leftIcon={<Icon.Share size={16} />} onClick={handleShare} className="hidden sm:inline-flex">
            Share Play
          </Button>
          <Button variant="primary" leftIcon={<Icon.Plus size={16} />} onClick={handleNewPlay}>
            New Play
          </Button>
        </div>
      </div>

      {/* Board workspace card */}
      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="px-4 sm:px-5 pt-4">
          <Tabs
            value={view}
            onChange={setView}
            items={[
              { value: 'court', label: 'Court Board' },
              { value: '3d',    label: '3D View' }
            ]}
          />
        </div>

        <div className="px-4 sm:px-5">
          <BoardToolbar
            onUndo={() => undo(activePlay.scene, (s) => upsertPlay({ ...activePlay, scene: s }))}
            onRedo={() => redo(activePlay.scene, (s) => upsertPlay({ ...activePlay, scene: s }))}
            onClear={() => {
              if (activePlay.scene.drawings.length === 0) return;
              if (window.confirm('Clear all drawings on this play?')) {
                handleSceneChange({ ...activePlay.scene, drawings: [] });
                toast.show('Drawings cleared');
              }
            }}
          />
        </div>

        {view === 'court' ? (
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
            <div className="hidden lg:block">
              <PlayLibrary
                plays={plays}
                activeId={activePlayId}
                onSelect={setActivePlay}
                onNew={handleNewPlay}
                onViewAll={() => navigate('/plays')}
                onPlayAction={handlePlayAction}
              />
            </div>
            <div className="relative">
              <TacticalCanvas
                key={fitNonce}
                scene={activePlay.scene}
                onChange={handleSceneChange}
                selectedObjectId={selectedObjectId}
                onSelect={selectObject}
              />
              {/* Floating canvas controls */}
              <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4">
                <button
                  onClick={handleFitToScreen}
                  className="inline-flex items-center gap-2 px-3 h-9 bg-white/95 border border-line rounded-xl text-sm font-semibold shadow-card hover:bg-white"
                >
                  <Icon.Maximize size={16} /> Fit to Screen
                </button>
              </div>
              <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 flex gap-1.5">
                <IconButton size="sm" variant="secondary" onClick={() => undo(activePlay.scene, (s) => upsertPlay({ ...activePlay, scene: s }))} aria-label="Undo">
                  <Icon.Undo size={16} />
                </IconButton>
                <IconButton size="sm" variant="secondary" onClick={() => redo(activePlay.scene, (s) => upsertPlay({ ...activePlay, scene: s }))} aria-label="Redo">
                  <Icon.Redo size={16} />
                </IconButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/9] grid place-items-center bg-navy-900 text-white">
            <div className="text-center px-8">
              <Icon.Board size={42} />
              <h3 className="text-xl font-bold mt-3">3D View — Coming Soon</h3>
              <p className="text-sm text-navy-200 mt-1 max-w-md">
                A 3D camera perspective for visualizing player rotations and screens. Available in the next release.
              </p>
              <Button variant="primary" className="mt-4" onClick={() => setView('court')}>
                Back to Court Board
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile horizontal play library */}
      <div className="lg:hidden">
        <PlayLibraryHorizontal
          plays={plays}
          activeId={activePlayId}
          onSelect={setActivePlay}
          onNew={handleNewPlay}
        />
      </div>

      {/* Play metadata strip */}
      <PlayMetadata play={activePlay} onRename={handleRename} />

      {/* Player list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <PlayerTable
          players={players}
          selectedId={selectedPlayerId}
          onSelect={setSelectedPlayer}
          onAdd={handleAddPlayer}
          onViewAll={() => navigate('/players')}
        />
        <PlayerDetailCard player={selectedPlayer} />
      </div>
    </div>
  );
}
