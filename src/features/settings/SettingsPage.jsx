import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { organization, team, coach } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';

export function SettingsPage() {
  const onSave = (label) => (e) => {
    e?.preventDefault?.();
    toast.success(`${label} saved`);
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">Manage organization, subscription, users, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Organization" subtitle="Public profile and branding" />
          <div className="space-y-3">
            <Field label="Name"     defaultValue={organization.name} />
            <Field label="Tagline"  defaultValue={organization.tagline} />
            <Field label="Team"     defaultValue={team.name} />
            <Field label="Season"   defaultValue={team.season} />
          </div>
          <div className="mt-4 text-right">
            <Button onClick={onSave('Organization')}>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subscription" subtitle="Current plan and billing" action={<Badge tone="brand">Pro</Badge>} />
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-ink-muted">Plan</span><span className="font-semibold">4TheLab Pro</span></li>
            <li className="flex justify-between"><span className="text-ink-muted">Seats</span><span className="font-semibold">10 / 15</span></li>
            <li className="flex justify-between"><span className="text-ink-muted">Renews</span><span className="font-semibold">Sep 30, 2024</span></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => toast.info('Opening billing portal…')}>Manage Billing</Button>
            <Button onClick={() => toast.success('Upgrade flow — coming soon')}>Upgrade</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Coach Profile" subtitle="Your personal information" />
          <div className="space-y-3">
            <Field label="Name"  defaultValue={coach.name} />
            <Field label="Role"  defaultValue={coach.role} />
            <Field label="Email" defaultValue="coach.alex@4thelab.id" />
          </div>
          <div className="mt-4 text-right">
            <Button onClick={onSave('Profile')}>Update Profile</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" subtitle="Choose what you want to be alerted about" />
          <ul className="space-y-3">
            {[
              ['Play shared with you', true],
              ['New scouting report', true],
              ['Training reschedule', false],
              ['Weekly performance digest', true]
            ].map(([label, on]) => (
              <li key={label} className="flex items-center justify-between">
                <span className="text-sm text-ink">{label}</span>
                <Toggle
                  defaultChecked={on}
                  onChange={(e) => toast.info(`${label}: ${e.target.checked ? 'on' : 'off'}`)}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }) {
  return (
    <label className="block">
      <div className="text-xs text-ink-muted font-semibold mb-1">{label}</div>
      <Input defaultValue={defaultValue} />
    </label>
  );
}

function Toggle({ defaultChecked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="w-10 h-6 rounded-full bg-line peer-checked:bg-brand-500 relative transition-colors">
        <span className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow-card peer-checked:translate-x-4 transition-transform" />
      </span>
    </label>
  );
}
