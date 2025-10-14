"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  // Animated counters
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = useRef([1200, 4800, 320, 98]); // users, posts, streaks, satisfaction
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1400; // ms
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCounts(targets.current.map((target) => Math.floor(target * easeOutCubic(p))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  // FAQ
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Background purple drops (generated on mount to avoid hydration mismatch)
  const [drops, setDrops] = useState<
    Array<{ left: number; delay: number; duration: number; size: number; opacity: number; rotate: number }>
  >([]);
  useEffect(() => {
    const N = 22;
    const arr = Array.from({ length: N }).map(() => ({
      left: Math.random() * 100, // percent
      delay: Math.random() * 6, // seconds
      duration: 8 + Math.random() * 8, // 8s - 16s
      size: 10 + Math.random() * 14, // px
      opacity: 0.12 + Math.random() * 0.25,
      rotate: -15 + Math.random() * 30,
    }));
    setDrops(arr);
  }, []);

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Background falling purple drops */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {drops.map((d, i) => (
          <span
            key={i}
            className="drop"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              width: `${d.size}px`,
              height: `${Math.round(d.size * 1.8)}px`,
              opacity: d.opacity,
              transform: `translateY(-110%) rotate(${d.rotate}deg)`,
            }}
          />
        ))}
      </div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 zoom-pulse">
                Make every day meaningful with DailyQuest
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Get a fresh daily challenge, share your proof, and get inspired by the community.
                Stay consistent. Have fun. Level up your life.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow"
                >
                  Get Started
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50"
                >
                  View Today’s Task
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 via-indigo-50 to-white shadow-sm grid place-items-center text-gray-500">
                <div className="text-center p-6">
                  <div className="text-5xl mb-2">🗓️</div>
                  <div className="font-semibold">Daily Quests</div>
                  <div className="text-sm text-gray-600 mt-1">Complete. Share. Celebrate.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Three simple steps to build a daily habit.</p>
        </div>

        <div className="mt-12 relative">
          {/* connector line for large screens */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-10 h-1 w-10/12 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-indigo-200 rounded-full" />

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-purple-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="absolute -top-3 -left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold shadow-md">1</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">🗓️</div>
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">Get your quest</h3>
              </div>
              <p className="mt-3 text-gray-600 text-sm">A fresh daily prompt to nudge you into action.</p>
              <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-fuchsia-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="absolute -top-3 -left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white font-bold shadow-md">2</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">📷</div>
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">Do it, snap it</h3>
              </div>
              <p className="mt-3 text-gray-600 text-sm">Complete the task and share a quick photo.</p>
              <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="absolute -top-3 -left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white font-bold shadow-md">3</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">🔥</div>
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">Keep the streak</h3>
              </div>
              <p className="mt-3 text-gray-600 text-sm">Earn kudos, build consistency, and inspire others.</p>
              <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Why you’ll love it</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <div className="text-3xl">🎯</div>
            <h3 className="mt-3 text-lg font-semibold">Daily Challenges</h3>
            <p className="mt-2 text-gray-600 text-sm">Stay motivated with a new, fun prompt every day.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <div className="text-3xl">📸</div>
            <h3 className="mt-3 text-lg font-semibold">Share Proof</h3>
            <p className="mt-2 text-gray-600 text-sm">Post a photo with a short story and inspire others.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <div className="text-3xl">🏆</div>
            <h3 className="mt-3 text-lg font-semibold">Earn Kudos</h3>
            <p className="mt-2 text-gray-600 text-sm">Get likes and build your streaks over time.</p>
          </div>
        </div>
      </section> */}

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-fuchsia-50 p-8">
          {/* Animated flash overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 -left-1/3 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl animate-shimmer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{counts[0]}+</div>
              <div className="text-sm text-gray-600 mt-1">Adventurers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{counts[1]}+</div>
              <div className="text-sm text-gray-600 mt-1">Photos shared</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{counts[2]}+</div>
              <div className="text-sm text-gray-600 mt-1">Active streaks</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{counts[3]}%</div>
              <div className="text-sm text-gray-600 mt-1">User satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (two animated rows) */}
      <section className="mx-auto max-w-7xl px-8 py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">What our users say</h2>
        <div className="mt-10 space-y-8">
          {/* Row 1: left ➜ right */}
          <div className="overflow-hidden">
            <div className="marquee animate-marquee-ltr flex gap-6 whitespace-nowrap will-change-transform" style={{animationDuration: '28s'}}>
              {testimonials.map((t, i) => (
                <blockquote key={`r1-${i}`} className="min-w-[320px] sm:min-w-[420px] rounded-2xl h-[150px] border border-gray-200 bg-white p-6 shadow-md">
                  <p className="text-gray-700 text-base">“{t.quote}”</p>
                  <footer className="mt-3 text-sm text-gray-500">— {t.author}</footer>
                </blockquote>
              ))}
              {testimonials.map((t, i) => (
                <blockquote key={`r1-dup-${i}`} className="min-w-[320px] sm:min-w-[420px] rounded-2xl h-[150px] border border-gray-200 bg-white p-6 shadow-md">
                  <p className="text-gray-700 text-base">“{t.quote}”</p>
                  <footer className="mt-3 text-sm text-gray-500">— {t.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
          {/* Row 2: right ➜ left */}
          <div className="overflow-hidden">
            <div className="marquee animate-marquee-rtl flex gap-6 whitespace-nowrap will-change-transform" style={{animationDuration: '30s'}}>
              {testimonialsAlt.map((t, i) => (
                <blockquote key={`r2-${i}`} className="min-w-[320px] sm:min-w-[420px] rounded-2xl h-[150px] border border-gray-200 bg-white p-6 shadow-md">
                  <p className="text-gray-700 text-base">“{t.quote}”</p>
                  <footer className="mt-3 text-sm text-gray-500">— {t.author}</footer>
                </blockquote>
              ))}
              {testimonialsAlt.map((t, i) => (
                <blockquote key={`r2-dup-${i}`} className="min-w-[320px] sm:min-w-[420px] rounded-2xl h-[150px] border border-gray-200 bg-white p-6 shadow-md">
                  <p className="text-gray-700 text-base">“{t.quote}”</p>
                  <footer className="mt-3 text-sm text-gray-500">— {t.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((f, idx) => (
            <div key={idx}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
              >
                <span className="font-medium text-gray-900">{f.q}</span>
                <span className="text-xl text-gray-500">{openIdx === idx ? "–" : "+"}</span>
              </button>
              <div className={`px-5 pb-4 text-gray-600 text-sm transition-all ${openIdx === idx ? "block" : "hidden"}`}>
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-fuchsia-50 via-purple-50 to-indigo-50 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Ready to start your streak?</h3>
            <p className="text-gray-600">Join now and complete your first DailyQuest today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow">
              Create Account
            </Link>
            <Link href="/" className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-800 hover:bg-white/60">
              Explore Today’s Task
            </Link>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx>{`
        @keyframes marqueeRTL {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeLTR {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee { animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-marquee-rtl { animation-name: marqueeRTL; }
        .animate-marquee-ltr { animation-name: marqueeLTR; }
        .marquee:hover { animation-play-state: paused; }
        /* Hero headline zoom pulse */
        @keyframes zoomPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
        .zoom-pulse { animation: zoomPulse 4.5s ease-in-out infinite; transform-origin: center; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .zoom-pulse { animation: none; }
        }
        /* Falling purple drops */
        @keyframes dropFall {
          0% { top: -15%; }
          100% { top: 115%; }
        }
          .drop {
  position: absolute;
  top: -15%;
  display: block;
  background: linear-gradient(180deg, rgba(128, 0, 255, 0.8), rgba(75, 0, 130, 0.9));
  border-radius: 40% 40% 60% 60% / 30% 30% 70% 70%;
  box-shadow: 0 8px 25px rgba(128, 0, 255, 0.4);
  animation-name: dropFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: top;
}

        // .drop {
        //   position: absolute;
        //   top: -15%;
        //   display: block;
        //   background: linear-gradient(180deg, rgba(55, 3, 104, 0.35), rgba(34, 1, 54, 0.35));
        //   border-radius: 40% 40% 60% 60% / 30% 30% 70% 70%;
        //   box-shadow: 0 6px 18px rgba(147,51,234,0.15);
        //   animation-name: dropFall;
        //   animation-timing-function: linear;
        //   animation-iteration-count: infinite;
        //   will-change: top;
        // }
        @media (prefers-reduced-motion: reduce) {
          .drop { animation-duration: 0.001s; opacity: 0.06; }
        }
        /* Shimmer flash for stats card */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 2.6s ease-in-out infinite; }
      `}</style>
    </main>
  );
}

type Testimonial = { quote: string; author: string };

const testimonials: Testimonial[] = [
  { quote: "DailyQuest got  wins every day.", author: "Priya" },
  { quote: "Love the, one proof, big motivation.", author: "Rahul" },
  { quote: "The streaaccountable!", author: "Ananya" },
  { quote: "I never ld be this fun.", author: "Karthik" },
  { quote: "DailyQuest got meins every day.", author: "Priya" },
  { quote: "Love the simplicity. One prompt, one proof, big motivation.", author: "Rahul" },
  { quote: "The streaks and !", author: "Ananya" },
  { quote: "I never thought .", author: "Karthik" },
];

const testimonialsAlt: Testimonial[] = [
  { quote: "Small wins add up. DailyQuest keeps me consistent.", author: "Sara" },
  { quote: "It’s my favorite 5 minutes of the day.", author: "Vikram" },
  { quote: "Community vibes are unmatched.", author: "Leah" },
  { quote: "Simple idea, powerful habit.", author: "Arun" },
];

const faqs = [
  { q: "Is DailyQuest free?", a: "Yes, you can start for free. We may add optional perks later." },
  { q: "Do I have to post every day?", a: "No, but posting daily helps you build momentum and streaks." },
  { q: "What kind of tasks are there?", a: "Simple, uplifting prompts like 'Take a photo of something that made you smile today.'" },
  { q: "Can I use the camera in the app?", a: "Yes, head to the Camera page or use your device camera while uploading." },
];
