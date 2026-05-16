import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField, Select } from '../ui/Form.jsx';
import { toISODate } from '../../lib/calendar.js';

const TYPES = [
  { value: 'training', label: 'Training' },
  { value: 'match',    label: 'Match' },
  { value: 'rest',     label: 'Rest / Recovery' },
  { value: 'meeting',  label: 'Meeting' }
];

const blank = () => ({
  title: '',
  date: toISODate(new Date()),
  time: '18:00',
  type: 'training'
});

export function EventFormModal({ open, onClose, event, onSubmit, onDelete }) {
  const isEdit = Boolean(event && event.id);
  const [form, setForm] = useState(blank());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm({
      ...blank(),
      ...(event || {})
    });
  }, [open, event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date)         errs.date = 'Pick a date';
    if (Object.keys(errs).length) return setErrors(errs);
    onSubmit?.({
      ...form,
      title: form.title.trim()
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Event' : 'Add Event'}
      description={isEdit ? `Update "${event.title}"` : 'Schedule a new event.'}
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
          <FormField label="Date" error={errors.date}>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </FormField>
          <FormField label="Time">
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
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
