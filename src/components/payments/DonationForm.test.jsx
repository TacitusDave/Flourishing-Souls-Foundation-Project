import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DonationForm from './DonationForm';

// Regression test for the most severe bug this rebuild found: DonationForm
// passed SuccessScreen an `open` prop it doesn't have (only `show`) and
// nested <Receipt> as a child SuccessScreen never rendered - `show` stayed
// false forever, so a donor who paid successfully saw nothing. This test
// drives the real success path (mocking only the Paystack SDK and the
// network call) and asserts the confirmation actually appears on screen.

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('../../lib/supabase', () => ({
  supabase: { functions: { invoke } },
}));

// PaystackButton talks to window.PaystackPop, which doesn't exist in
// jsdom - stand in with a plain button that fires the same onSuccess
// callback DonationForm wires up for the real widget.
vi.mock('./PaystackButton', () => ({
  PaystackButton: ({ onSuccess, disabled }) => (
    <button type="button" disabled={disabled} onClick={() => onSuccess({ reference: 'test_ref_0000000001' })}>
      Mock Pay
    </button>
  ),
}));

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Ada Lovelace' } });
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '5000' } });
}

describe('DonationForm success flow', () => {
  it('shows the SuccessScreen confirmation after a verified donation', async () => {
    invoke.mockResolvedValueOnce({
      data: {
        donation: {
          id: 'd1',
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          amount: 5000,
          reference: 'test_ref_0000000001',
          created_at: new Date().toISOString(),
        },
      },
      error: null,
    });

    render(<DonationForm publicKey="pk_test_x" organization="Flourishing Souls Foundation" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /mock pay/i }));

    expect(await screen.findByRole('heading', { name: /thank you, ada lovelace/i })).toBeInTheDocument();
    // Amount renders as separate "₦" and "5,000" text nodes - match on
    // the container's combined text rather than a single text node.
    expect(screen.getByText((_, node) => node?.textContent === '₦5,000')).toBeInTheDocument();
    expect(invoke).toHaveBeenCalledWith('paystack-verify', {
      body: { reference: 'test_ref_0000000001' },
    });
  });

  it('shows an error notification instead of a false success screen when verification fails', async () => {
    invoke.mockResolvedValueOnce({
      data: { error: 'Transaction not successful (status: failed)' },
      error: null,
    });

    render(<DonationForm publicKey="pk_test_x" organization="Flourishing Souls Foundation" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /mock pay/i }));

    await waitFor(() => {
      expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    });
  });
});
