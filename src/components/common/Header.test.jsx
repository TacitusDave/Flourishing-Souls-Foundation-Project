import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

// Regression test for a real crash found only by running the app: Header
// used to destructure `logout` from useAuth() and call it on click, but
// AuthContext only ever exported `signOut` - every real logout click threw
// a TypeError. This asserts the button calls the function AuthContext
// actually provides.

const signOut = vi.fn();

vi.mock('../../context', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'donor@example.com', fullName: 'Test Donor' },
    isAdmin: false,
    signOut,
    loading: false,
  }),
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe('Header logout', () => {
  it('calls signOut (not a nonexistent `logout`) when Logout is clicked', async () => {
    renderHeader();

    fireEvent.click(screen.getByTestId('headerUserMenuBtn'));
    const logoutBtn = await screen.findByTestId('headerLogoutBtn');
    fireEvent.click(logoutBtn);

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
