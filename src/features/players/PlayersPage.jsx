import { useMemo, useState } from 'react';
import { PlayerTable } from '../../components/players/PlayerTable.jsx';
import { PlayerDetailCard } from '../../components/players/PlayerDetailCard.jsx';
import { PlayerFormModal } from '../../components/players/PlayerFormModal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { KPI, DistributionBar, ComparisonBar } from '../../components/ui/InsightWidgets.jsx';
import { usePlayerStore } from '../../stores/player.store.js';
import {
  positionBreakdown, statusBreakdown, teamAverages, ROLE_AWARDS, topByAttribute, POSITIONS, avg
} from '../../lib/team-insights.js';
import { attributeKeys } from '../../data/players.js';

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
  const openEdit = (p) => { setEditing(p); setFormOpen(true); };
  const handleSubmit = (payload) => {
    if (editing) editPlayer(editing.id, payload);
    else         addPlayer(payload);
    setFormOpen(false);
  };

  // Insights
  const positions = positionBreakdown(players);
  const status = statusBreakdown(players);
  const teamAvgs = useMemo(() => teamAverages(players), [players]);
  const teamAvgMap = useMemo(
    () => Object.fromEntries(teamAvgs.map((a) => [a.key, a.value])),
    [teamAvgs]
  );

  const roleAwards = ROLE_AWARDS.map((r) => {
    const top = topByAttribute(players, r.key, 1)[0];
    return { ...r, player: top, value: top?.attributes?.[r.key] || 0 };
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Players</h1>
          <p className="text-sm text-ink-muted mt-1">Roster, attributes, and individual vs team comparison.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={openAdd}>Add Player</Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Roster"   value={players.length}                                                  hint={`${status.starter} starters, ${status.bench} bench`} tone="navy" icon={<Icon.Players size={18} />} />
        <KPI label="Avg OVR"  value={avg(players, (p) => p.overall)}                                  hint="across roster" tone="brand" icon={<Icon.Analytics size={18} />} />
        <KPI label="Tallest"  value={`${[...players].sort((a, b) => b.height - a.height)[0]?.height || 0} cm`} hint={[...players].sort((a, b) => b.height - a.height)[0]?.name || ''} tone="navy" icon={<Icon.Team size={18} />} />
        <KPI label="Youngest" value={`${[...players].sort((a, b) => a.age - b.age)[0]?.age || 0} yr`} hint={[...players].sort((a, b) => a.age - b.age)[0]?.name || ''} tone="success" icon={<Icon.Schedule size={18} />} />
      </div>

      {/* Role awards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {roleAwards.map((r) =>
          r.player ? (
            <Card key={r.key} className="!p-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">{r.title}</div>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={r.player.name} size="md" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-ink truncate">{r.player.name}</div>
                  <div className="text-xs text-ink-muted">{r.player.position} · #{r.player.jersey}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-extrabold text-brand-600 tabular-nums leading-none">{r.value}</div>
                </div>
              </div>
            </Card>
          ) : null
        )}
      </div>

      {/* Composition */}
      <Card>
        <CardHeader title="Position Distribution" subtitle={`${players.length} players across ${POSITIONS.filter((p) => positions[p] > 0).length} positions`} />
        <DistributionBar
          segments={POSITIONS.map((pos) => ({ label: pos, value: positions[pos] }))}
        />
      </Card>

      {/* Roster + detail with comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <PlayerTable
          players={players}
          selectedId={selectedId}
          onSelect={setSelected}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={(p) => setConfirmingDelete(p)}
        />

        <div className="space-y-5">
          <PlayerDetailCard player={selected} />

          {selected && (
            <Card>
              <CardHeader
                title="vs Team Average"
                subtitle={`How ${selected.name.split(' ')[0]} compares attribute-by-attribute`}
              />
              <div className="space-y-3">
                {attributeKeys.map((a) => (
                  <ComparisonBar
                    key={a.key}
                    label={a.label}
                    a={selected.attributes[a.key]}
                    b={teamAvgMap[a.key] || 0}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" leftIcon={<Icon.Pencil size={14} />} onClick={() => openEdit(selected)}>
                  Edit Player
                </Button>
                <Button variant="danger" leftIcon={<Icon.Trash size={14} />} onClick={() => setConfirmingDelete(selected)}>
                  Remove
                </Button>
              </div>
            </Card>
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
