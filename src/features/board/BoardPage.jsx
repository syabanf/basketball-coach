import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { BoardToolbar } from '../../components/board/BoardToolbar.jsx';
import { TacticalCanvas } from '../../components/board/TacticalCanvas.jsx';
import { Court3DView } from '../../components/board/Court3DView.jsx';
import { PlayLibrary, PlayLibraryHorizontal } from '../../components/plays/PlayLibrary.jsx';
import { PlayMetadata } from '../../components/plays/PlayMetadata.jsx';
import { PlayFormModal } from '../../components/plays/PlayFormModal.jsx';
import { PlayerTable } from '../../components/players/PlayerTable.jsx';
import { PlayerDetailCard } from '../../components/players/PlayerDetailCard.jsx';
import { PlayerFormModal } from '../../components/players/PlayerFormModal.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { useBoardStore } from '../../stores/board.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { toast } from '../../stores/toast.store.js';

const DEFAULT_SCENE = () => ({
  players: [
    { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
    { id: 't2', label: '2', x: 820, y: 540 },
    { id: 't3', label: '3', x: 180, y: 540 },
    { id: 't4', label: '4', x: 380, y: 360 },
    { id: 't5', label: '5', x: 620, y: 360 }
  ],
  drawings: []
});

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
  const editPlayer = usePlayerStore((s) => s.editPlayer);
  const removePlayer = usePlayerStore((s) => s.removePlayer);
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  const nextJersey = (players.reduce((a, p) => Math.max(a, p.jersey || 0), 0) || 0) + 1;

  const [playForm, setPlayForm] = useState({ open: false, play: null });
  const [playerForm, setPlayerForm] = useState({ open: false, player: null });
  const [confirmPlayDelete, setConfirmPlayDelete] = useState(null);
  const [confirmPlayerDelete, setConfirmPlayerDelete] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [fitNonce, setFitNonce] = useState(0);

  const handleSceneChange = (nextScene) => {
    pushHistory(activePlay.scene);
    upsertPlay({ ...activePlay, scene: nextScene });
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

  // ── Play CRUD ──────────────────────────────────────────────
  const openNewPlay  = () => setPlayForm({ open: true, play: null });
  const openEditPlay = (p) => setPlayForm({ open: true, play: p });

  const submitPlayForm = (payload) => {
    if (playForm.play) {
      upsertPlay({ ...playForm.play, ...payload });
    } else {
      const id = `play_${Math.random().toString(36).slice(2, 8)}`;
      const newPlay = { id, ...payload, scene: DEFAULT_SCENE() };
      upsertPlay(newPlay);
      setActivePlay(id);
    }
    setPlayForm({ open: false, play: null });
  };

  const duplicatePlay = (p) => {
    const dup = {
      ...p,
      id: `play_${Math.random().toString(36).slice(2, 8)}`,
      title: `${p.title} (Copy)`
    };
    upsertPlay(dup);
    setActivePlay(dup.id);
  };

  const handlePlayAction = (action, p) => {
    if (action === 'rename')    return openEditPlay(p);
    if (action === 'share')     return handleShare();
    if (action === 'duplicate') return duplicatePlay(p);
    if (action === 'delete')    return setConfirmPlayDelete(p);
  };

  // ── Player CRUD ────────────────────────────────────────────
  const openAddPlayer  = () => setPlayerForm({ open: true, player: null });
  const openEditPlayer = (p) => setPlayerForm({ open: true, player: p });

  const submitPlayerForm = (payload) => {
    if (playerForm.player) editPlayer(playerForm.player.id, payload);
    else                   addPlayer(payload);
    setPlayerForm({ open: false, player: null });
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
          <Button variant="secondary" leftIcon={<Icon.Save size={16} />} onClick={() => openEditPlay(activePlay)} className="hidden sm:inline-flex">
            Edit Play
          </Button>
          <Button variant="secondary" leftIcon={<Icon.Share size={16} />} onClick={handleShare} className="hidden sm:inline-flex">
            Share Play
          </Button>
          <Button variant="primary" leftIcon={<Icon.Plus size={16} />} onClick={openNewPlay}>
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
            onClear={() => activePlay.scene.drawings.length > 0 && setConfirmClear(true)}
          />
        </div>

        {view === 'court' ? (
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
            <div className="hidden lg:block">
              <PlayLibrary
                plays={plays}
                activeId={activePlayId}
                onSelect={setActivePlay}
                onNew={openNewPlay}
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
              <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4">
                <button
                  onClick={() => { setFitNonce((n) => n + 1); selectObject(null); }}
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
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">3D Preview</h3>
                <p className="text-xs text-ink-muted">
                  Drawings work in 3D. Switch to Court Board to move player tokens.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setView('court')}>
                Edit in 2D →
              </Button>
            </div>
            <Court3DView
              scene={activePlay.scene}
              onChange={handleSceneChange}
              selectedObjectId={selectedObjectId}
              onSelect={selectObject}
            />
          </div>
        )}
      </div>

      {/* Mobile horizontal play library */}
      <div className="lg:hidden">
        <PlayLibraryHorizontal
          plays={plays}
          activeId={activePlayId}
          onSelect={setActivePlay}
          onNew={openNewPlay}
        />
      </div>

      {/* Play metadata strip — pencil opens edit modal */}
      <PlayMetadata play={activePlay} onRename={openEditPlay} />

      {/* Player list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <PlayerTable
          players={players}
          selectedId={selectedPlayerId}
          onSelect={setSelectedPlayer}
          onAdd={openAddPlayer}
          onEdit={openEditPlayer}
          onDelete={(p) => setConfirmPlayerDelete(p)}
          onViewAll={() => navigate('/players')}
        />
        <PlayerDetailCard player={selectedPlayer} />
      </div>

      {/* Modals */}
      <PlayFormModal
        open={playForm.open}
        onClose={() => setPlayForm({ open: false, play: null })}
        play={playForm.play}
        onSubmit={submitPlayForm}
      />
      <PlayerFormModal
        open={playerForm.open}
        onClose={() => setPlayerForm({ open: false, player: null })}
        player={playerForm.player}
        nextJersey={nextJersey}
        onSubmit={submitPlayerForm}
      />
      <ConfirmDialog
        open={Boolean(confirmPlayDelete)}
        onClose={() => setConfirmPlayDelete(null)}
        title="Delete play?"
        description={confirmPlayDelete ? `"${confirmPlayDelete.title}" will be removed permanently.` : ''}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => deletePlay(confirmPlayDelete.id)}
      />
      <ConfirmDialog
        open={Boolean(confirmPlayerDelete)}
        onClose={() => setConfirmPlayerDelete(null)}
        title="Remove player?"
        description={confirmPlayerDelete
          ? `"${confirmPlayerDelete.name}" (#${confirmPlayerDelete.jersey}) will be removed from the roster.`
          : ''}
        confirmLabel="Remove"
        tone="danger"
        onConfirm={() => removePlayer(confirmPlayerDelete.id)}
      />
      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all drawings?"
        description="All arrows, circles, rectangles, and text on this play will be removed. Players stay where they are."
        confirmLabel="Clear"
        tone="danger"
        onConfirm={() => handleSceneChange({ ...activePlay.scene, drawings: [] })}
      />
    </div>
  );
}
