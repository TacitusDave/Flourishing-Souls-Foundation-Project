import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './AppRouter';

let mockAuth = {};
vi.mock('../context', () => ({
  useAuth: () => mockAuth,
}));

function renderProtected({ requiredRole, initialPath = '/dashboard' } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route
          path={initialPath}
          element={
            <RequireAuth requiredRole={requiredRole}>
              <div>Protected Content</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('RequireAuth', () => {
  it('redirects to /login when there is no user', () => {
    mockAuth = { user: null, loading: false };
    renderProtected();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows a loading state instead of redirecting while auth is still resolving', () => {
    mockAuth = { user: null, loading: true };
    renderProtected();
    expect(screen.getByText(/checking access/i)).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders children when authenticated with no role requirement', () => {
    mockAuth = { user: { id: 'u1', role: 'member' }, loading: false };
    renderProtected();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects non-admins away from an admin-only route', () => {
    mockAuth = { user: { id: 'u1', role: 'member' }, loading: false };
    renderProtected({ requiredRole: 'admin', initialPath: '/admin' });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders admin content for a user with the admin role', () => {
    mockAuth = { user: { id: 'u1', role: 'admin' }, loading: false };
    renderProtected({ requiredRole: 'admin', initialPath: '/admin' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
