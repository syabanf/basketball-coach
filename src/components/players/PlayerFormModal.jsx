import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField, Select, Textarea, Range } from '../ui/Form.jsx';
import { attributeKeys } from '../../data/players.js';

const POSITIONS = [
  { value: 'PG', label: 'PG — Point Guard' },
  { value: 'SG', label: 'SG — Shooting Guard' },
  { value: 'SF', label: 'SF — Small Forward' },
  { value: 'PF', label: 'PF — Power Forward' },
  { value: 'C',  label: 'C  — Center' }
];

const STATUSES = [
  { value: 'starter',  label: 'Starter' },
  { value: 'rotation', label: 'Rotation' },
  { value: 'bench',    label: 'Bench' }
];

const POSITION_LONG = {
  PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward', PF: 'Power Forward', C: 'Center'
};

const blank = {
  jersey: 0,
  name: '',
  position: 'PG',
  height: 180,
  weight: 78,
  age: 22,
  overall: 70,
  status: 'bench',
  attributes: { shooting: 70, passing: 70, dribbling: 70, defense: 70, athleticism: 70, basketballIQ: 70 },
  notes: ''
};

/**
 * PlayerFormModal — used for both Add and Edit player.
 * Props:
 *   open, onClose
 *   player    — existing player (edit mode) or null/undefined (add mode)
 *   onSubmit  — receives the player payload (without id for add, with id for edit)
 *   nextJersey — suggested jersey number when adding
 */
export function PlayerFormModal({ open, onClose, player, onSubmit, nextJersey = 1 }) {
  const isEdit = Boolean(player);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(isEdit ? { ...blank, ...player } : { ...blank, jersey: nextJersey });
  }, [open, player, isEdit, nextJersey]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setAttr = (key, value) =>
    setForm((f) => ({ ...f, attributes: { ...f.attributes, [key]: Number(value) } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.jersey || form.jersey < 0 || form.jersey > 99) errs.jersey = 'Jersey must be 0–99';
    if (!form.position) errs.position = 'Pick a position';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit?.({
      ...form,
      jersey: Number(form.jersey),
      height: Number(form.height),
      weight: Number(form.weight),
      age: Number(form.age),
      overall: Number(form.overall),
      positionLong: POSITION_LONG[form.position] || form.position,
      name: form.name.trim(),
      notes: form.notes.trim()
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Player' : 'Add Player'}
      description={isEdit ? `Update profile for #${form.jersey} ${form.name}` : 'Create a new player on the roster.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Player'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr_180px] gap-3">
          <FormField label="Jersey #" error={errors.jersey}>
            <Input
              type="number" min="0" max="99"
              value={form.jersey}
              onChange={(e) => update({ jersey: e.target.value })}
            />
          </FormField>
          <FormField label="Full Name" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Jason Hartono"
              autoFocus
            />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => update({ status: e.target.value })}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </FormField>
        </div>

        {/* Physical */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FormField label="Position">
            <Select value={form.position} onChange={(e) => update({ position: e.target.value })}>
              {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Height (cm)">
            <Input type="number" value={form.height} onChange={(e) => update({ height: e.target.value })} />
          </FormField>
          <FormField label="Weight (kg)">
            <Input type="number" value={form.weight} onChange={(e) => update({ weight: e.target.value })} />
          </FormField>
          <FormField label="Age">
            <Input type="number" value={form.age} onChange={(e) => update({ age: e.target.value })} />
          </FormField>
        </div>

        {/* Overall */}
        <FormField label={`Overall Rating — ${form.overall}`} hint="0–100 composite rating">
          <Range value={form.overall} onChange={(e) => update({ overall: Number(e.target.value) })} />
        </FormField>

        {/* Attributes */}
        <div>
          <div className="text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wider">Attributes</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
            {attributeKeys.map((a) => (
              <div key={a.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-ink">{a.label}</span>
                  <span className="text-sm font-bold text-brand-600 w-8 text-right">
                    {form.attributes[a.key]}
                  </span>
                </div>
                <Range
                  value={form.attributes[a.key]}
                  onChange={(e) => setAttr(a.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <FormField label="Notes" hint="Strengths, weaknesses, coaching points">
          <Textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="e.g. Great court vision and leadership."
          />
        </FormField>
      </form>
    </Modal>
  );
}
