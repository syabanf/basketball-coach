import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { FormField } from '../../components/ui/Form.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { useAuthStore } from '../../stores/auth.store.js';
import { mockUsers } from '../../data/mock-users.js';
import { organization } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';
import { cn } from '../../lib/cn.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Bounce away if already signed in
  if (isAuthenticated) {
    const target = location.state?.from || '/board';
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setErrors({});
    if (!form.email.trim()) return setErrors({ email: 'Email is required' });
    setSubmitting(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(location.state?.from || '/board', { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Sign-in failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (user) => {
    setForm({ email: user.email, password: 'demo', remember: true });
    setErrors({});
  };

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-surface-alt">
      {/* Brand side */}
      <div className="lg:w-1/2 lg:min-h-screen bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 h-[280px] w-[280px] rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 grid place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon.Flask size={26} />
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight">{organization.name}</div>
            <div className="text-xs uppercase tracking-wider text-white/80">{organization.tagline}</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md mt-12 lg:mt-0">
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Plan smarter.<br />Coach with conviction.
          </h2>
          <p className="text-white/85 mt-3 text-sm lg:text-base leading-relaxed">
            Design plays on a digital tactical board, manage your roster, track tactical insights, and run every practice from one place.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              'Drag-and-drop tactical board with 2D + 3D views',
              'Per-play analytics and AI tactical insights',
              'Starting lineup editor with synergy scoring',
              'Weekly schedule, scouting library, and full roster CRUD'
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/90 shrink-0" />
                <span className="text-white/90">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} {organization.name}. Mock environment for demo.
        </div>
      </div>

      {/* Form side */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Sign in</h1>
            <p className="text-sm text-ink-muted mt-1">Welcome back. Sign in to your coaching dashboard.</p>
          </div>

          {errors.form && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2.5">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="coach.kevin@4thelab.id"
                autoComplete="email"
                autoFocus
              />
            </FormField>

            <FormField
              label="Password"
              hint={
                <span className="flex items-center justify-between gap-2">
                  <span>Any password works in mock mode</span>
                  <button
                    type="button"
                    onClick={() => toast.info('Password reset — coming soon')}
                    className="text-brand-600 font-semibold hover:text-brand-700"
                  >
                    Forgot?
                  </button>
                </span>
              }
            >
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </FormField>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="peer sr-only"
              />
              <span className="h-5 w-5 rounded-md border border-line bg-white grid place-items-center peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors">
                <svg
                  className={cn('h-3 w-3 text-white', !form.remember && 'opacity-0')}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-sm text-ink">Keep me signed in on this device</span>
            </label>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Demo accounts</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <ul className="space-y-2">
            {mockUsers.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => fillDemo(u)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-line hover:border-brand-300 hover:bg-brand-50/40 transition-colors text-left"
                >
                  <Avatar name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-ink truncate">{u.name}</div>
                    <div className="text-xs text-ink-muted truncate">{u.email}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-brand-600">{u.role}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="text-xs text-ink-muted text-center mt-6">
            By signing in you accept the mock terms of service. No real data is sent anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
