import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { FiShield, FiRepeat, FiEye } from "react-icons/fi";
import DonationForm from "../components/payments/DonationForm";
import { getPaystackPublicKey } from "../lib/paystack";

const REASSURANCES = [
  { icon: FiShield, text: "Payments secured and processed by Paystack" },
  { icon: FiEye, text: "Every donation is recorded and reportable" },
  { icon: FiRepeat, text: "Funds go directly to active programs" },
];

function Donate() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-10">
      <Helmet>
        <title>Donate | Flourishing Souls Foundation</title>
        <meta
          name="description"
          content="Support Flourishing Souls Foundation with your donation. Every gift changes lives—help orphans, fund education, healthcare and strengthen our community."
        />
      </Helmet>

      <header className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
          Give today
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
          Your donation changes a life
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-neutral-600 dark:text-neutral-400">
          Every gift goes directly toward orphan care, education, healthcare, and
          community programs — securely processed and fully accounted for.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] max-w-5xl mx-auto items-start">
        <div className="order-2 lg:order-1 space-y-4">
          {REASSURANCES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 shadow-warm-sm"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <DonationForm
            publicKey={getPaystackPublicKey()}
            organization="Flourishing Souls Foundation"
          />
        </div>
      </div>
    </div>
  );
}

export default Donate;
