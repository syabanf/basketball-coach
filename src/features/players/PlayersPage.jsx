import { useState } from 'react';
import { PlayerTable } from '../../components/players/PlayerTable.jsx';
import { PlayerDetailCard } from '../../components/players/PlayerDetailCard.jsx';
import { PlayerFormModal } from '../../components/players/PlayerFormModal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { usePlayerStore } from '../../stores/player.store.js';

export function PlayersPage() {
  const players = usePlayerStore((s) => s.players);
  const selectedId = usePlayerStore((s) => s.selectedPlayerId);
  const setSelected = usePlayerStore((s) => s.setSelectedPlayer);
  const addPlayer = usePlayerStore((s) => s.addPlayer);
  const editPlayer = usePlayerStore((s) => s.editPlayer);
  const removePlayer = usePlayerStore((s) => s.removePlayer);
  const selected = players.find((p) => p.id === selectedId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const nextJersey = (players.reduce((a, p) => Math.max(a, p.jersey || 0), 0) || 0) + 1;

  const openAdd  = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p) => { setEditing(p);    setFormOpen(true); };

  const handleSubmit = (payload) => {
    if (editing) editPlayer(editing.id, payload);
    else addPlayer(payload);
    setFormOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Players</h1>
          <p className="text-sm text-ink-muted mt-1">Manage roster, attributes, and player notes.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={openAdd}>Add Player</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <PlayerTable
          players={players}
          selectedId={selectedId}
          onSelect={setSelected}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={(p) => setConfirmingDelete(p)}
        />
        <div className="space-y-3">
          <PlayerDetailCard player={selected} />
          {selected && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" leftIcon={<Icon.Pencil size={14} />} onClick={() => openEdit(selected)}>
                Edit Player
              </Button>
              <Button variant="danger" leftIcon={<Icon.Trash size={14} />} onClick={() => setConfirmingDelete(selected)}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>

      <PlayerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        player={editing}
        nextJersey={nextJersey}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(confirmingDelete)}
        onClose={() => setConfirmingDelete(null)}
        title="Remove player?"
        description={confirmingDelete
          ? `"${confirmingDelete.name}" (#${confirmingDelete.jersey}) will be removed from the roster. This cannot be undone.`
          : ''}
        confirmLabel="Remove"
        tone="danger"
        onConfirm={() => removePlayer(confirmingDelete.id)}
      />
    </div>
  );
}
