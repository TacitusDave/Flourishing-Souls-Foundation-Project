import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHeart, FiShield, FiRepeat, FiEye } from "react-icons/fi";
import { PaystackButton } from "../components/payments/PaystackButton";
import { getPaystackPublicKey } from "../lib/paystack";
import useSettings, { formatNaira } from "../hooks/useSettings";
import SEO from "../components/common/SEO";
import Notification from "../components/common/Notification";

const REASSURANCES = [
  {
    icon: FiShield,
    title: "Secure payments",
    text: "Processed by Paystack — we never see your card details.",
  },
  {
    icon: FiEye,
    title: "Full transparency",
    text: "Every donation is recorded and reportable.",
  },
  {
    icon: FiRepeat,
    title: "Direct to programs",
    text: "Funds go straight to the children and communities who need them.",
  },
];

function Donate() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState(null);
  const settings = useSettings();
  const tiers = Array.isArray(settings?.donation_tiers) && settings.donation_tiers.length
    ? settings.donation_tiers
    : [];

  const publicKey = getPaystackPublicKey();

  const handlePaystackSuccess = () => {
    setNotice({
      type: "success",
      message: `Thank you, ${name || "friend"}! Your donation of ₦{Number(amount).toLocaleString()} has been received. A receipt has been sent to ${email}.`,
    });
    setAmount("");
    setName("");
    setEmail("");
  };

  const handlePaystackClose = () => {
    setNotice({
      type: "warning",
      message: "The donation was not completed. You can try again whenever you're ready.",
    });
  };

  const quickAmounts = [1000, 2500, 5000, 10000, 25000];

  return (
    <div className="pb-16">
      <SEO
        path="/donate"
        title="Donate"
        description="Give securely through Paystack. Every donation funds orphan care, education, healthcare, and community programs — fully transparent, instantly receipted."
      />

      {notice && (
        <div className="mx-auto max-w-md mb-8">
          <Notification {...notice} onClose={() => setNotice(null)} />
        </div>
      )}

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-neutral-50/50">
        <div className="absolute inset-0 bg-[url('/images/brand-assets/footer-texture.png')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 text-center">
          <p className="eyebrow eyebrow--center">Give today</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900">
            Your gift changes a life
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500">
            Every donation goes directly to orphan care, education, healthcare,
            and community programs — securely processed and fully accounted for.
          </p>
        </div>
      </section>

      {/* ---- Main Donation Section ---- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
            {/* Left: reassurances */}
            <div className="space-y-4">
              {REASSURANCES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-5 transition hover:border-brand-200"
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-base text-neutral-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
                  </div>
                </div>
              ))}

              {/* Impact tiers */}
              {tiers.length > 0 && (
                <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                    What your gift does
                  </p>
                  <ul className="mt-4 space-y-3">
                    {tiers.slice(0, 3).map((item) => (
                      <li key={`${item.amount}-${item.tag}`} className="flex items-baseline gap-3 text-sm">
                        <span className="font-display text-base font-semibold text-brand-700">
                          {formatNaira(item.amount)}
                        </span>
                        <span className="text-neutral-600">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: simple donation */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 shadow-warm-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                Make a donation
              </p>
              <h2 className="mt-2 font-display text-2xl text-neutral-900">
                Support Flourishing Souls Foundation
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Choose an amount, enter your details, and pay securely via Paystack.
              </p>

              <div className="mt-6 space-y-5">
                {/* Quick amount buttons */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select amount (₦)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`rounded-lg px-3 py-2.5 text-sm font-medium border transition ${
                          amount === amt
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-neutral-200 text-neutral-700 hover:border-brand-300"
                        }`}
                      >
                        {formatNaira(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Or enter a custom amount (₦)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 outline-none transition"
                  />
                </div>

                {/* Name & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 outline-none transition"
                    />
                  </div>
                </div>

                {/* Donate button */}
                <div className="pt-2">
                  <PaystackButton
                    publicKey={publicKey}
                    amount={amount ? Number(amount) : 0}
                    email={email || ""}
                    name={name || ""}
                    metadata={{ organization: "Flourishing Souls Foundation" }}
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition active:scale-[0.98] shadow-warm-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!amount || !email}
                  >
                    Donate {formatNaira(amount || 0)}
                  </PaystackButton>
                  <p className="mt-3 text-center text-xs text-neutral-400">
                    Secured by Paystack · Card, bank transfer & USSD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="full-bleed border-t border-neutral-100 bg-brand-50/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500">
            Every gift, no matter the size, brings us closer to our mission of
            empowering vulnerable children and communities.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/donate"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:bg-brand-700"
            >
              Donate now
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              Volunteer with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Donate;
