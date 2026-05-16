import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField, Select } from '../ui/Form.jsx';

const DAYS = [
  { value: 'Mon', date: '13' },
  { value: 'Tue', date: '14' },
  { value: 'Wed', date: '15' },
  { value: 'Thu', date: '16' },
  { value: 'Fri', date: '17' },
  { value: 'Sat', date: '18' },
  { value: 'Sun', date: '19' }
];

const TYPES = [
  { value: 'training', label: 'Training' },
  { value: 'match',    label: 'Match' },
  { value: 'rest',     label: 'Rest / Recovery' },
  { value: 'meeting',  label: 'Meeting' }
];

const blank = { title: '', day: 'Mon', time: '18:00', type: 'training' };

export function EventFormModal({ open, onClose, event, onSubmit, onDelete }) {
  const isEdit = Boolean(event);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(isEdit ? { ...blank, ...event } : blank);
  }, [open, event, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setErrors({ title: 'Title is required' });
    const day = DAYS.find((d) => d.value === form.day) || DAYS[0];
    onSubmit?.({
      ...form,
      title: form.title.trim(),
      date: day.date
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Event' : 'Add Event'}
      description={isEdit ? `Update "${event.title}"` : 'Schedule a new event for this week.'}
      size="md"
      footer={
        <>
          {isEdit && onDelete && (
            <Button variant="danger" onClick={() => { onDelete(); onClose?.(); }} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Event'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Practice — Zone Defense"
            autoFocus
          />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Day">
            <Select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {DAYS.map((d) => <option key={d.value} value={d.value}>{d.value}</option>)}
            </Select>
          </FormField>
          <FormField label="Time">
            <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
