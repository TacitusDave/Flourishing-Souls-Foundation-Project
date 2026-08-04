import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import DonationForm from "../components/payments/DonationForm";
import { getPaystackPublicKey } from "../lib/paystack";

function Donate() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <Helmet>
        <title>Donate | Flourishing Souls Foundation</title>
        <meta
          name="description"
          content="Support Flourishing Souls Foundation with your donation. Every gift changes lives—help orphans, fund education, healthcare and strengthen our community."
        />
      </Helmet>

      <header className="w-full bg-white dark:bg-slate-900 shadow-sm px-4 py-7 md:py-10 flex flex-col items-center">
        <img
          src="/images/logo.png"
          alt="Flourishing Souls Foundation Logo"
          className="h-14 w-14 mb-3"
        />
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight text-center">
          Donate to Flourishing Souls Foundation
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl text-center">
          Your support transforms lives. Give a secure donation via Paystack and empower children, families and communities in need.
        </p>
      </header>

      <main className="w-full flex flex-col items-center px-4 mt-0 sm:mt-4">
        <section className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow p-6 sm:p-10 mx-auto">
          <DonationForm
            publicKey={getPaystackPublicKey()}
            organization="Flourishing Souls Foundation"
          />
        </section>
      </main>

      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Flourishing Souls Foundation.
      </footer>
    </div>
  );
}

export default Donate;
