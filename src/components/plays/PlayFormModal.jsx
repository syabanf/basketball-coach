import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField, Select, Textarea } from '../ui/Form.jsx';

const CATEGORIES = ['Offense', 'Defense', 'Sets', 'ATO', 'Tagged'];

const blank = {
  title: '',
  category: 'Offense',
  tagsText: '',          // comma-separated input form
  description: ''
};

/**
 * PlayFormModal — used for both New play and Edit play metadata.
 * Props:
 *   open, onClose
 *   play     — existing play (edit) or null (create)
 *   onSubmit — receives { title, category, tags[], description }
 */
export function PlayFormModal({ open, onClose, play, onSubmit }) {
  const isEdit = Boolean(play);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      isEdit
        ? {
            title: play.title || '',
            category: play.category || 'Offense',
            tagsText: (play.tags || []).join(', '),
            description: play.description || ''
          }
        : blank
    );
  }, [open, play, isEdit]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (Object.keys(errs).length) return setErrors(errs);

    const tags = form.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit?.({
      title: form.title.trim(),
      category: form.category,
      tags: tags.length ? tags : [form.category],
      description: form.description.trim()
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Play' : 'New Play'}
      description={isEdit ? `Update "${play.title}"` : 'Add a play to the library.'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Create Play'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="e.g. High Pick and Roll"
            autoFocus
          />
        </FormField>

        <FormField label="Category">
          <Select value={form.category} onChange={(e) => update({ category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>

        <FormField label="Tags" hint="Comma separated · e.g. Pick & Roll, Early Offense">
          <Input
            value={form.tagsText}
            onChange={(e) => update({ tagsText: e.target.value })}
            placeholder="Pick & Roll, Early Offense"
          />
        </FormField>

        <FormField label="Description" hint="Coaching notes for this play">
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="After the screen, PG attacks downhill looking to score or kick out…"
          />
        </FormField>
      </form>
    </Modal>
  );
}
