import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField, Select, Textarea } from '../ui/Form.jsx';
import { LIBRARY_TYPES } from '../../data/library.js';

const blank = () => ({
  title: '',
  type: 'document',
  description: '',
  tagsText: '',
  bodyText: ''
});

/**
 * LibraryFormModal — used for both Upload (new) and Edit (existing).
 * For simplicity body input is a single multi-line textarea; lines starting
 * with "## " become headings and "- " become bullets when persisted.
 */
export function LibraryFormModal({ open, onClose, item, onSubmit }) {
  const isEdit = Boolean(item);
  const [form, setForm] = useState(blank());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (isEdit) {
      setForm({
        title: item.title || '',
        type: item.type || 'document',
        description: item.description || '',
        tagsText: (item.tags || []).join(', '),
        bodyText: bodyToText(item.body || [])
      });
    } else {
      setForm(blank());
    }
  }, [open, item, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setErrors({ title: 'Title is required' });

    const tags = form.tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const body = textToBody(form.bodyText);

    onSubmit?.({
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      tags,
      body
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Library Item' : 'Upload to Library'}
      description={isEdit ? `Update "${item.title}"` : 'Add a scouting report, template, document, or video reference.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add to Library'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
          <FormField label="Title" error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Garuda BC — scouting"
              autoFocus
            />
          </FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(LIBRARY_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label="Description" hint="One-line summary shown on the list">
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this and why is it here?"
          />
        </FormField>

        <FormField label="Tags" hint="Comma separated">
          <Input
            value={form.tagsText}
            onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
            placeholder="Opponent, Match, Scouting"
          />
        </FormField>

        <FormField
          label="Body"
          hint='Plain text. Start a line with "## " for a heading or "- " for a bullet.'
        >
          <Textarea
            rows={10}
            value={form.bodyText}
            onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
            placeholder={`Opening paragraph describing the item.\n\n## Key Players\n- #7 R. Halim — PG, drag-screen pull-up\n- #14 A. Suryadi — SG, force left\n\n## Keys to the Game\n- ICE the side ball-screens.\n- Crash from the corner.`}
          />
        </FormField>
      </form>
    </Modal>
  );
}

// ── Body <-> text helpers ────────────────────────────────────────────────

function bodyToText(body) {
  return body
    .map((section) => {
      if (section.type === 'heading')  return `## ${section.text}`;
      if (section.type === 'paragraph') return section.text;
      if (section.type === 'bullets')  return section.items.map((i) => `- ${i}`).join('\n');
      if (section.type === 'table')    return ''; // edit not supported here
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

function textToBody(text) {
  const sections = [];
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.every((l) => l.startsWith('- '))) {
      sections.push({ type: 'bullets', items: lines.map((l) => l.slice(2).trim()) });
    } else if (lines.length === 1 && lines[0].startsWith('## ')) {
      sections.push({ type: 'heading', text: lines[0].slice(3).trim() });
    } else {
      // Mixed lines — keep heading on its own line, paragraph for the rest
      const headingIdx = lines.findIndex((l) => l.startsWith('## '));
      if (headingIdx === -1) {
        sections.push({ type: 'paragraph', text: lines.join(' ') });
      } else {
        if (headingIdx > 0) sections.push({ type: 'paragraph', text: lines.slice(0, headingIdx).join(' ') });
        sections.push({ type: 'heading', text: lines[headingIdx].slice(3).trim() });
        if (headingIdx < lines.length - 1) {
          sections.push({ type: 'paragraph', text: lines.slice(headingIdx + 1).join(' ') });
        }
      }
    }
  }
  return sections;
}
