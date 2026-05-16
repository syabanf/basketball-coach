import { PlayerTable } from '../../components/players/PlayerTable.jsx';
import { PlayerDetailCard } from '../../components/players/PlayerDetailCard.jsx';
import { usePlayerStore } from '../../stores/player.store.js';
import { toast } from '../../stores/toast.store.js';

export function PlayersPage() {
  const players = usePlayerStore((s) => s.players);
  const selectedId = usePlayerStore((s) => s.selectedPlayerId);
  const setSelected = usePlayerStore((s) => s.setSelectedPlayer);
  const addPlayer = usePlayerStore((s) => s.addPlayer);
  const selected = players.find((p) => p.id === selectedId);

  const handleAdd = () => {
    const name = window.prompt('New player name:');
    if (!name || !name.trim()) return;
    const position = (window.prompt('Position (PG/SG/SF/PF/C):', 'PG') || 'PG').toUpperCase();
    const p = addPlayer({ name: name.trim(), position });
    toast.success(`Added ${p.name} as #${p.jersey}`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Players</h1>
        <p className="text-sm text-ink-muted mt-1">Manage roster, attributes, and player notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <PlayerTable
          players={players}
          selectedId={selectedId}
          onSelect={setSelected}
          onAdd={handleAdd}
          onViewAll={() => toast.info('Already viewing full roster')}
        />
        <PlayerDetailCard player={selected} />
      </div>
    </div>
  );
}
