import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';

/**
 * ConfirmDialog — generic yes/no with a destructive default for delete flows.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="Delete play?"
 *     description={`"${play.title}" will be removed permanently.`}
 *     confirmLabel="Delete"
 *     tone="danger"
 *     onConfirm={() => deletePlay(play.id)}
 *   />
 */
export function ConfirmDialog({
  open,
  onClose,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-ink-muted" />
    </Modal>
  );
}
