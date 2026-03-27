"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  motion, useInView, AnimatePresence,
  useScroll, useTransform, useMotionValue, useSpring,
} from "framer-motion";
import {
  Bed, Bath, MapPin, Wifi, Zap, Droplets, Car, Shield,
  Flame, UtensilsCrossed, Trees, ChefHat, Home as HomeIcon,
  Users, CalendarDays, ArrowRight, Sun, Sofa,
  Play,
} from "lucide-react";

/* ── font shorthand ── */
const F = { fontFamily: "var(--font-fraunces)" } as const;
const O = { fontFamily: "var(--font-outfit)" } as const;

/* ── palette constants ── */
const TERRA   = "#B86840";
const INK     = "#1C1510";
const CREAM   = "#FAF7F2";
const STONE   = "#7A6A58";
const RULE    = "#D5C9B8";

/* ══════════════════════════════════════════════
   SCROLL REVEAL WRAPPER
══════════════════════════════════════════════ */
function Reveal({
  children, delay = 0, className = "", style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════ */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { l: "Overview",  h: "#overview"  },
    { l: "Gallery",   h: "#gallery"   },
    { l: "Amenities", h: "#amenities" },
    { l: "Location",  h: "#location"  },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#FAF7F2]/96 backdrop-blur-md border-b border-[#D5C9B8]" : ""
    }`}>
      <div className="section-container flex items-center justify-between h-20">
        <a href="#" style={{ ...F, fontWeight: 700, fontSize: "1.1rem",
            color: scrolled ? INK : "#fff",
            letterSpacing: "-0.02em",
            transition: "color 0.4s ease",
          } as React.CSSProperties}>
          Kitisuru Estate
        </a>
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.h}>
              <a href={l.h} style={O}
                className={`text-[11px] tracking-[0.24em] uppercase transition-colors duration-300 hover:text-[#B86840] ${
                  scrolled ? "text-[#7A6A58]" : "text-white/75"
                }`}>{l.l}</a>
            </li>
          ))}
        </ul>
        <a href="#enquire" style={O}
          className={`hidden md:inline-flex items-center gap-2 px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase border transition-all duration-300 ${
            scrolled
              ? "border-[#B86840] text-[#B86840] hover:bg-[#B86840] hover:text-white"
              : "border-white/60 text-white hover:bg-white hover:text-[#1C1510]"
          }`}>
          Arrange Viewing
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 flex flex-col gap-1.5" aria-label="menu">
          <span className={`block w-6 h-px transition-all ${scrolled ? "bg-[#1C1510]" : "bg-white"} ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-px transition-all ${scrolled ? "bg-[#1C1510]" : "bg-white"} ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px transition-all ${scrolled ? "bg-[#1C1510]" : "bg-white"} ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF7F2] border-t border-[#D5C9B8] px-8 py-6 overflow-hidden">
            {links.map((l) => (
              <a key={l.h} href={l.h} onClick={() => setOpen(false)}
                className="block py-4 text-[11px] tracking-[0.24em] uppercase text-[#7A6A58] hover:text-[#B86840] border-b border-[#EBE3D5] last:border-0"
                style={O}>{l.l}</a>
            ))}
            <a href="#enquire" onClick={() => setOpen(false)}
              className="block mt-5 text-center py-4 bg-[#B86840] text-white text-[11px] tracking-[0.22em] uppercase" style={O}>
              Arrange Viewing
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  const stats = [
    { num: "4",   label: "Bedrooms"          },
    { num: "4",   label: "Ensuite"           },
    { num: null,  label: "New Kitisuru"      },
    { num: null,  label: "Private Residence" },
  ];

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Parallax background */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
        <Image
          src="/images/exterior-hero.jpeg"
          alt="Kitisuru Residence — New Kitisuru Estate"
          fill priority className="object-cover object-center" sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1510]/85 via-[#1C1510]/30 to-[#1C1510]/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1510]/55 via-[#1C1510]/15 to-transparent" />

      {/* Content — anchored to bottom */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-80 w-full text-left" style={{ maxWidth: "900px", marginLeft: "100px", marginRight: "auto", paddingLeft: "0px", paddingRight: "40px" }}>

        {/* Location label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={O} className="text-[11px] tracking-[0.48em] uppercase text-[#D4A882] mb-6">
          New Kitisuru Estate · Nairobi, Kenya
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...F, fontWeight: 700, fontSize: "clamp(4.5rem, 10vw, 10.5rem)", lineHeight: 0.87, letterSpacing: "-0.03em" }}
          className="text-white mb-8">
          Kitisuru<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "#D4A882" }}>Residence</span>
        </motion.h1>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap items-stretch border border-white/15 divide-x divide-white/15 mb-14">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col justify-center px-10 py-8">
              {s.num && (
                <span style={{ ...F, fontWeight: 700, fontSize: "1.9rem", color: "#E8C49A", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {s.num}
                </span>
              )}
              <span style={O} className="text-[10px] tracking-[0.32em] uppercase text-white/60 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs — large, side by side */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-4">
          <a href="#enquire"
            className="inline-flex items-center justify-center gap-3 px-14 py-5 bg-[#B86840] text-white group hover:bg-[#C97848] active:bg-[#9E5A30] transition-colors duration-300 w-full sm:w-auto"
            style={{ ...O, fontSize: "13px", letterSpacing: "0.26em", textTransform: "uppercase", minHeight: "60px" }}>
            Arrange a Private Viewing
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
          <a href="#gallery"
            className="inline-flex items-center justify-center gap-3 px-14 py-5 border-2 border-white/70 text-white hover:border-white hover:bg-white/12 active:bg-white/20 transition-all duration-300 w-full sm:w-auto"
            style={{ ...O, fontSize: "13px", letterSpacing: "0.26em", textTransform: "uppercase", minHeight: "60px" }}>
            View the Gallery
            <ArrowRight size={16} className="opacity-60" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
        className="absolute bottom-10 right-16 hidden lg:flex flex-col items-center gap-3 z-10">
        <span style={O} className="text-[9px] tracking-[0.4em] uppercase text-white/30 [writing-mode:vertical-rl] mb-4">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-[#B86840]/60 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   OVERVIEW
══════════════════════════════════════════════ */
function Overview() {
  const stats = [
    { value: 4,   suffix: "",  label: "Bedrooms",          icon: <Bed  size={22} strokeWidth={1.5} /> },
    { value: 4,   suffix: "",  label: "Ensuite Bathrooms", icon: <Bath size={22} strokeWidth={1.5} /> },
    { value: 1,   suffix: "",  label: "Private Residence", icon: <HomeIcon size={22} strokeWidth={1.5} /> },
  ];

  return (
    <section id="overview" className="bg-[#FAF7F2] py-20 lg:py-40 scroll-mt-20">
      <div className="section-container">

        {/* Section label + headline — full width */}
        <Reveal className="pt-8 mb-10">
          <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
            The Residence
          </span>
          <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6.5vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
            className="text-[#1C1510] mt-2 mb-8">
            Where Luxury<br className="hidden lg:block" /> Meets{" "}
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Serenity</span>
          </h2>
        </Reveal>

        {/* Intro paragraph */}
        <Reveal delay={0.15} className="mb-24">
          <div className="flex items-start gap-10 pt-8 border-t border-[#EBE3D5]">
            <div className="w-10 h-px bg-[#B86840] shrink-0 mt-[0.55rem]" />
            <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-xl leading-relaxed max-w-3xl">
              Nestled within the exclusive New Kitisuru Estate, this meticulously crafted residence offers
              four en-suite bedrooms, a dedicated study, lush mature gardens, and unhurried calm —
              the hallmarks of truly elevated living in Nairobi.
            </p>
          </div>
        </Reveal>

        {/* Animated stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#D5C9B8]">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.09}>
              <div className="bg-[#FAF7F2] px-8 py-16 text-center group hover:bg-[#F3EDE3] transition-colors duration-500">
                <div className="flex justify-center text-[#B86840] mb-8 group-hover:scale-110 transition-transform duration-500">
                  {s.icon}
                </div>
                <div style={{ ...F, fontWeight: 700, fontSize: "4.5rem", lineHeight: 1 }} className="text-[#1C1510] mb-4">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div style={O} className="text-[10px] tracking-[0.3em] uppercase text-[#AFA090] mt-2">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   INTERIOR LIVING
══════════════════════════════════════════════ */
function InteriorLiving() {
  return (
    <section id="interior" className="bg-[#F3EDE3] scroll-mt-20">
      <div className="grid lg:grid-cols-[55fr_45fr] min-h-[760px]">

        {/* Left — full-bleed image */}
        <motion.div
          className="relative overflow-hidden min-h-[480px] lg:min-h-full"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}>
          <Image
            src="/images/living-room.jpeg"
            alt="Interior living room with stone fireplace"
            fill className="object-cover object-center" sizes="(max-width:1024px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F3EDE3]/25" />
        </motion.div>

        {/* Right — text */}
        <Reveal delay={0.22} className="flex items-center">
          <div className="px-10 md:px-20 py-20 lg:py-32">
            <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
              Interior Living
            </span>
            <h3 style={{ ...F, fontWeight: 700, fontSize: "clamp(2.8rem, 5vw, 5.5rem)", lineHeight: 0.9, letterSpacing: "-0.025em" }}
              className="text-[#1C1510] mb-8 mt-2">
              Built Around<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>The Hearth</span>
            </h3>
            <div className="w-10 h-px bg-[#B86840] mb-8" />
            <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-lg leading-relaxed mb-10">
              The heart of the home is a generous formal living room anchored by a stone-clad fireplace —
              an inviting focal point during Nairobi's cool evenings. Warm caramel tones, bespoke furnishings,
              and generous natural light create an atmosphere of effortless luxury.
            </p>
            <ul className="space-y-5">
              {[
                "Stone-clad wood-burning fireplace",
                "Original hardwood flooring throughout",
                "Formal seating for 8+ guests",
                "Adjoining dining room and sun room",
              ].map((item) => (
                <li key={item} className="flex items-start gap-4"
                  style={{ ...O, fontWeight: 300, color: "#7A6A58", fontSize: "1rem" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B86840] shrink-0 mt-[0.55rem] opacity-80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   AMENITIES — "What's Included"
══════════════════════════════════════════════ */
function Amenities() {
  const items = [
    { icon: <Flame size={24} strokeWidth={1.5} />,          t: "Stone Fireplace"      },
    { icon: <Sofa size={24} strokeWidth={1.5} />,           t: "Hardwood Floors"      },
    { icon: <Wifi size={24} strokeWidth={1.5} />,           t: "Fibre Internet"       },
    { icon: <UtensilsCrossed size={24} strokeWidth={1.5} />,t: "Fitted Kitchen"       },
    { icon: <ChefHat size={24} strokeWidth={1.5} />,        t: "BBQ Terrace"          },
    { icon: <Trees size={24} strokeWidth={1.5} />,          t: "Mature Gardens"       },
    { icon: <Users size={24} strokeWidth={1.5} />,          t: "Staff Quarters"       },
    { icon: <Bath size={24} strokeWidth={1.5} />,           t: "4 Ensuite Bedrooms"   },
    { icon: <HomeIcon size={24} strokeWidth={1.5} />,       t: "Study Room"           },
    { icon: <Sun size={24} strokeWidth={1.5} />,            t: "Formal Dining Room"   },
    { icon: <HomeIcon size={24} strokeWidth={1.5} />,       t: "Sun Room"             },
    { icon: <Car size={24} strokeWidth={1.5} />,            t: "Ample Parking"        },
    { icon: <Droplets size={24} strokeWidth={1.5} />,       t: "6,000L Water Storage" },
    { icon: <Droplets size={24} strokeWidth={1.5} />,       t: "Rainwater Collection" },
    { icon: <Shield size={24} strokeWidth={1.5} />,         t: "24-Hour Security"     },
    { icon: <Zap size={24} strokeWidth={1.5} />,            t: "Solar Backup"         },
    { icon: <Bed size={24} strokeWidth={1.5} />,            t: "Private Compound"     },
  ];

  return (
    <section id="amenities" className="bg-[#FAF7F2] py-20 lg:py-40 scroll-mt-20">
      <div className="section-container">

        <Reveal className="mb-16">
          <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
            What's Included
          </span>
          <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6.5vw, 7.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            className="text-[#1C1510] mt-2">
            Every Comfort,{" "}
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Appointed</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
          {items.map((a, i) => (
            <Reveal key={a.t} delay={(i % 3) * 0.055}>
              <div className="flex items-center gap-4">
                <span className="text-[#B86840] shrink-0">{a.icon}</span>
                <span style={{ ...O, fontWeight: 400 }} className="text-[#3C3028] text-base">{a.t}</span>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   OUTDOOR LIVING
══════════════════════════════════════════════ */
function OutdoorLiving() {
  const thumbs = [
    { src: "/images/garden-lawn.jpeg",  label: "Lower Garden"  },
    { src: "/images/lower-garden.jpeg", label: "Upper Garden"  },
    { src: "/images/gazebo.jpeg",       label: "Garden Gazebo" },
  ];

  return (
    <section id="outdoor" className="bg-[#F3EDE3] py-20 lg:py-40 scroll-mt-20">
      <div className="section-container">

        {/* Split: text left, image right */}
        <div className="grid lg:grid-cols-[44fr_56fr] gap-20 items-center mb-16">

          {/* Text */}
          <Reveal>
            <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
              Outdoor Living
            </span>
            <h3 style={{ ...F, fontWeight: 700, fontSize: "clamp(2.8rem, 5.5vw, 6rem)", lineHeight: 0.9, letterSpacing: "-0.025em" }}
              className="text-[#1C1510] mb-8 mt-2">
              The Garden &<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Terrace</span>
            </h3>
            <div className="w-10 h-px bg-[#B86840] mb-8" />
            <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-lg leading-relaxed mb-10">
              Sweeping lawns give way to indigenous trees while a covered terrace serves as the ultimate
              entertainment space — complete with a fitted BBQ kitchen and sheltered lounge for alfresco
              dining year-round.
            </p>
            <ul className="space-y-5">
              {[
                "Covered terrace with built-in BBQ kitchen",
                "Upper and lower tiered garden levels",
                "Mature trees providing natural privacy",
                "Ample space for children and pets",
              ].map((item) => (
                <li key={item} className="flex items-start gap-4"
                  style={{ ...O, fontWeight: 300, color: "#7A6A58", fontSize: "1rem" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B86840] shrink-0 mt-[0.55rem] opacity-80" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Main image */}
          <motion.div
            className="relative overflow-hidden"
            style={{ height: "600px" }}
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <Image
              src="/images/terrace.jpeg"
              alt="Covered terrace with BBQ and garden views"
              fill className="object-cover object-center" sizes="(max-width:1024px) 100vw, 56vw"
            />
            <div className="absolute top-5 right-5 w-12 h-12 border-t-2 border-r-2 border-[#B86840]/50" />
            <div className="absolute bottom-5 left-5 w-12 h-12 border-b-2 border-l-2 border-[#B86840]/50" />
          </motion.div>
        </div>

        {/* Three thumbnails */}
        <div className="grid grid-cols-3 gap-4" style={{ height: "260px" }}>
          {thumbs.map((t, i) => (
            <motion.div
              key={t.label}
              className="relative overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
              <Image src={t.src} alt={t.label} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw" />
              <div className="absolute inset-0 bg-[#1C1510]/0 group-hover:bg-[#1C1510]/25 transition-colors duration-500" />
              <span className="absolute bottom-4 left-4 text-white/0 group-hover:text-white/90 transition-colors duration-400
                text-[10px] tracking-[0.15em] uppercase bg-[#1C1510]/50 px-3 py-1" style={O}>
                {t.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   GALLERY (minimal, placeholder grid)
══════════════════════════════════════════════ */
function Gallery() {
  const exterior = [
    { src: "/images/exterior-hero.jpeg",        label: "Front Elevation"       },
    { src: "/images/exterior-front-day.jpeg",   label: "Front — Day"           },
    { src: "/images/exterior-angle-day.jpeg",   label: "Side Elevation"        },
    { src: "/images/entrance-path-stone.jpeg",  label: "Stone Entrance Path"   },
    { src: "/images/entrance-steps-front.jpeg", label: "Entrance Steps"        },
    { src: "/images/exterior-balcony.jpeg",     label: "Upper Balcony"         },
  ];

  const living = [
    { src: "/images/living-room-wide.jpeg",    label: "Living Room"           },
    { src: "/images/living-room.jpeg",         label: "Lounge & Fireplace"    },
    { src: "/images/living-room-fireplace.jpeg",label: "Stone Fireplace Wall" },
    { src: "/images/living-dining-arch.jpeg",  label: "Living → Dining"       },
    { src: "/images/fireplace.jpeg",           label: "Hearth Detail"         },
  ];

  const dining = [
    { src: "/images/dining-room-3.jpeg",  label: "Formal Dining — Day"    },
    { src: "/images/dining-room.jpeg",    label: "Formal Dining Room"     },
    { src: "/images/dining-room-2.jpeg",  label: "Dining — Wide"          },
    { src: "/images/dining-room-4.jpeg",  label: "Dining with Cabinet"    },
  ];

  const kitchen = [
    { src: "/images/kitchen.jpeg",         label: "Fitted Kitchen"        },
    { src: "/images/kitchen-wide.jpeg",    label: "Kitchen — Garden View" },
    { src: "/images/kitchen-bar.jpeg",     label: "Kitchen Island"        },
    { src: "/images/kitchen-bar-wide.jpeg",label: "Bar & Dining Nook"     },
    { src: "/images/kitchen-2.jpeg",       label: "Kitchen Detail"        },
  ];

  const outdoor = [
    { src: "/images/terrace-covered.jpeg", label: "Covered Terrace"       },
    { src: "/images/terrace.jpeg",         label: "Terrace — BBQ"         },
    { src: "/images/garden-lawn.jpeg",     label: "Upper Garden"          },
    { src: "/images/garden-lawn-2.jpeg",   label: "Lawn & Trees"          },
    { src: "/images/gazebo.jpeg",          label: "Garden Gazebo"         },
    { src: "/images/lower-garden.jpeg",    label: "Upper Garden"          },
  ];

  type GalleryItem = { src: string; label: string };

  function GalleryGroup({ title, items }: { title: string; items: GalleryItem[] }) {
    return (
      <div className="mb-12">
        <Reveal>
          <p style={O} className="text-[10px] tracking-[0.38em] uppercase text-[#AFA090] mb-5">{title}</p>
        </Reveal>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {items.map((img, i) => (
            <motion.div key={img.src}
              className="relative overflow-hidden group break-inside-avoid"
              style={{ aspectRatio: i % 3 === 0 ? "4/5" : "4/3" }}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}>
              <Image src={img.src} alt={img.label} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={85} />
              <div className="absolute inset-0 bg-[#1C1510]/0 group-hover:bg-[#1C1510]/30 transition-colors duration-500" />
              <span className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                text-white text-[10px] tracking-[0.12em] uppercase bg-[#1C1510]/55 px-2.5 py-1" style={O}>
                {img.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="gallery" className="bg-[#FAF7F2] py-20 lg:py-40 scroll-mt-20">
      <div className="section-container">

        <Reveal className="mb-14">
          <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
            The Property
          </span>
          <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6.5vw, 7.5rem)", lineHeight: 0.88, letterSpacing: "-0.03em" }}
            className="text-[#1C1510] mt-2 mb-8">
            Spaces &{" "}
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Light</span>
          </h2>
        </Reveal>

        {/* Hero — large featured exterior */}
        <div className="grid grid-cols-12 gap-3 mb-12" style={{ height: "560px" }}>
          <motion.div
            className="col-span-12 lg:col-span-8 relative overflow-hidden group"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <Image src="/images/entrance-path-stone.jpeg" alt="Stone Entrance Path" fill priority
              className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="70vw" />
            <span className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              text-white text-[11px] tracking-[0.14em] uppercase bg-[#1C1510]/60 px-3 py-1.5" style={O}>
              Stone Entrance Path
            </span>
          </motion.div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
            {[
              { src: "/images/exterior-front-day.jpeg", label: "Front Elevation" },
              { src: "/images/terrace-covered.jpeg",    label: "Covered Terrace" },
            ].map((img, i) => (
              <motion.div key={img.src}
                className="relative flex-1 overflow-hidden group"
                initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.85, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
                <Image src={img.src} alt={img.label} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="30vw" loading="lazy" />
                <span className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  text-white text-[10px] tracking-[0.12em] uppercase bg-[#1C1510]/55 px-2.5 py-1" style={O}>{img.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#EBE3D5] pt-12 space-y-12">
          <GalleryGroup title="Exterior & Grounds"   items={exterior} />
          <GalleryGroup title="Living Spaces"         items={living}   />
          <GalleryGroup title="Formal Dining"         items={dining}   />
          <GalleryGroup title="Kitchen"               items={kitchen}  />
          <GalleryGroup title="Garden & Terrace"      items={outdoor}  />
        </div>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p style={O} className="text-[10px] tracking-[0.28em] uppercase text-[#AFA090]">
            Photographs are representative — full gallery available upon private viewing
          </p>
        </Reveal>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   LOCATION
══════════════════════════════════════════════ */
function Location() {
  const nearby = [
    { p: "Village Market",                d: "8 min"  },
    { p: "Westgate Shopping Mall",        d: "12 min" },
    { p: "Gigiri UN Complex",             d: "10 min" },
    { p: "International School of Kenya", d: "5 min"  },
    { p: "Nairobi Arboretum",             d: "15 min" },
    { p: "JKIA Airport",                  d: "35 min" },
    { p: "Rosslyn Riviera",               d: "5 min"  },
    { p: "ABC Place Westlands",           d: "15 min" },
  ];

  return (
    <section id="location" className="bg-[#FAF7F2] py-20 lg:py-40 scroll-mt-20">
      <div className="section-container">

        <Reveal className="mb-16">
          <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">Location</span>
          <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6.5vw, 7.5rem)", lineHeight: 0.88, letterSpacing: "-0.03em" }}
            className="text-[#1C1510] mt-2 mb-8">
            The Heart of{" "}
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>New Kitisuru</span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-20">

          {/* Map placeholder + description */}
          <Reveal>
            <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-lg leading-relaxed mb-12">
              Kitisuru is among Nairobi's most prestigious residential addresses — a tranquil, verdant suburb
              offering proximity to diplomatic missions, international schools, premium retail and the city's
              finest restaurants, while maintaining the feel of a private retreat.
            </p>
            <div className="relative bg-[#EBE3D5] border border-[#D5C9B8] overflow-hidden flex items-center justify-center"
              style={{ height: "300px" }}>
              {/* Grid lines texture */}
              <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 36px,#B86840 36px,#B86840 37px),repeating-linear-gradient(90deg,transparent,transparent 36px,#B86840 36px,#B86840 37px)" }} />
              <Image
                src="https://placehold.co/700x300/D5C9B8/EBE3D5?text=+"
                alt="Map — New Kitisuru Estate"
                fill className="object-cover opacity-80" sizes="50vw" unoptimized
              />
              <div className="relative z-10 text-center">
                <MapPin size={24} strokeWidth={1.5} className="text-[#B86840] mx-auto mb-3" />
                <p style={{ ...F, fontWeight: 500, fontSize: "1.3rem" }} className="text-[#1C1510] mb-1">New Kitisuru Estate</p>
                <p style={O} className="text-[#AFA090] text-[10px] tracking-[0.28em] uppercase">Nairobi, Kenya</p>
              </div>
            </div>
          </Reveal>

          {/* Distances table */}
          <Reveal delay={0.15}>
            <p style={O} className="text-[10px] tracking-[0.3em] uppercase text-[#AFA090] mb-8">Nearby Destinations</p>
            <div>
              {nearby.map((n, i) => (
                <div key={n.p}
                  className={`flex items-center justify-between py-5 group hover:pl-3 transition-all duration-300 ${
                    i < nearby.length - 1 ? "border-b border-[#EBE3D5]" : ""
                  }`}>
                  <span style={{ ...O, fontWeight: 300 }}
                    className="text-[#3C3028] text-base group-hover:text-[#B86840] transition-colors duration-300">
                    {n.p}
                  </span>
                  <span style={{ ...O, fontWeight: 500, color: "#B86840" }} className="text-sm tabular-nums">{n.d}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ARRANGE A VIEWING — AGENT VERSION
══════════════════════════════════════════════ */
function EnquiryForm() {
  return (
    <section id="enquire" className="bg-[#FAF7F2] scroll-mt-20 py-20 lg:py-32">
      <div className="section-container">
        <div className="grid lg:grid-cols-[1fr_minmax(0,560px)] gap-16 lg:gap-20 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
                Arrange a Viewing
              </span>
              <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(2.8rem, 5vw, 5.5rem)", lineHeight: 1.0, letterSpacing: "-0.03em" }}
                className="text-[#1C1510] mt-2 mb-8">
                Speak to Your<br />
                <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Agent</span>
              </h2>
              <div className="w-8 h-px bg-[#B86840] mb-8" />
              <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-base leading-relaxed mb-12">
                To schedule a private viewing of this residence, please speak with your agent.
                They will coordinate access and arrange a time at your convenience.
              </p>

            </Reveal>
          </div>

          {/* ── RIGHT — parchment card ── */}
          <Reveal delay={0.15}>
            <div className="bg-[#EBE3D5] flex flex-col items-center justify-center py-20 px-10 md:px-14 text-center"
              style={{ minHeight: "560px" }}>
              <div className="w-20 h-20 rounded-full bg-[#B86840]/10 flex items-center justify-center mb-10">
                <CalendarDays size={34} strokeWidth={1.25} className="text-[#B86840]" />
              </div>
              <h3 style={{ ...F, fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.05 }}
                className="text-[#1C1510] mb-5">
                Ready to View?
              </h3>
              <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-base leading-relaxed max-w-[260px] mb-10">
                Ask your agent to arrange a private viewing of this residence.
              </p>
              <div className="w-12 h-px bg-[#C8BBA8] mb-8" />
              <p style={O} className="text-[10px] tracking-[0.3em] uppercase text-[#AFA090]">
                Private viewings available Monday – Saturday
              </p>
              <p style={O} className="text-[10px] tracking-[0.3em] uppercase text-[#AFA090] mt-1.5">
                9 am – 6 pm
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   VIDEO SHOWCASE
══════════════════════════════════════════════ */
function VideoShowcase() {
  const videos = [
    { src: "/videos/video-13.mp4", label: "Garden Gazebo"   },
    { src: "/videos/video-14.mp4", label: "Backyard Walk"   },
    { src: "/videos/video-15.mp4", label: "Lower Garden"    },
    { src: "/videos/video-07.mp4", label: "Kitchen"         },
    { src: "/videos/video-03.mp4", label: "Interior"        },
    { src: "/videos/video-12.mp4", label: "Interior"        },
  ];

  const [active, setActive] = useState<{ src: string; label: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [active]);

  return (
    <>
      <section id="videos" className="bg-[#1C1510] py-20 lg:py-40 scroll-mt-20">
        <div className="section-container">

          <Reveal className="mb-14">
            <span style={O} className="block text-[11px] tracking-[0.45em] uppercase text-[#B86840] mb-4">
              In Motion
            </span>
            <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6.5vw, 7.5rem)", lineHeight: 0.88, letterSpacing: "-0.03em" }}
              className="text-white mt-2 mb-8">
              Experience the{" "}
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Residence</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v, i) => (
              <Reveal key={v.src} delay={i * 0.07}>
                <button
                  onClick={() => setActive(v)}
                  className="relative overflow-hidden group bg-[#231A12] w-full cursor-pointer"
                  style={{ aspectRatio: "16/9" }}>
                  <video
                    src={v.src}
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1510]/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:scale-110 transition-transform duration-300">
                      <Play size={18} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-4" style={O as React.CSSProperties}>
                    <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase">{v.label}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* Video lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="video-lightbox"
            className="fixed inset-0 z-[9998] flex items-center justify-center p-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}>

            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />

            {/* Video container */}
            <motion.div
              className="relative w-full max-w-5xl z-10"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}>

              {/* Close button */}
              <button
                onClick={() => setActive(null)}
                className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200"
                style={{ ...O, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Close <span className="text-lg leading-none">×</span>
              </button>

              {/* Video */}
              <div style={{ aspectRatio: "16/9" }} className="w-full bg-black overflow-hidden">
                <video
                  key={active.src}
                  src={active.src}
                  autoPlay controls playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Label */}
              <p className="mt-4 text-white/50 text-[11px] tracking-[0.28em] uppercase" style={O}>
                {active.label}
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  const nav = ["Overview", "Gallery", "Amenities", "Location"];

  return (
    <footer className="bg-[#18120D] pt-24 pb-16">
      <div className="section-container">

        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-16 pb-16 border-b border-white/[0.08]">

          {/* Left — branding */}
          <div>
            <p style={O} className="text-[10px] tracking-[0.45em] uppercase text-[#7A6A58] mb-5">
              New Kitisuru Estate
            </p>
            <h2 style={{ ...F, fontWeight: 700, fontSize: "clamp(3rem, 6vw, 6rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
              className="text-white mb-4">
              A Residence <span style={{ fontStyle: "italic", fontWeight: 300, color: "#B86840" }}>Apart</span>
            </h2>
            <p style={{ ...O, fontWeight: 300 }} className="text-[#7A6A58] text-sm max-w-sm leading-relaxed mt-10">
              An exceptional 4-bedroom en-suite residence with study in the heart of New Kitisuru Estate,
              Nairobi — available for private let.
            </p>
          </div>

          {/* Right — CTA */}
          <div className="shrink-0">
            <a href="#enquire"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#B86840]/60 text-[#B86840] group hover:bg-[#B86840] hover:text-white hover:border-[#B86840] transition-all duration-400"
              style={{ ...O, fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
              Arrange a Viewing
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Navigation */}
          <div>
            <p style={O} className="text-[10px] tracking-[0.35em] uppercase text-[#7A6A58] mb-5">Navigation</p>
            <ul className="flex flex-col gap-3">
              {nav.map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} style={O}
                    className="text-[#AFA090] text-sm hover:text-[#B86840] transition-colors duration-300">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Location */}
          <div>
            <p style={O} className="text-[10px] tracking-[0.35em] uppercase text-[#7A6A58] mb-5">Address</p>
            <div className="flex items-start gap-3">
              <MapPin size={14} strokeWidth={1.5} className="text-[#B86840] shrink-0 mt-0.5" />
              <p style={O} className="text-[#AFA090] text-sm leading-relaxed">
                New Kitisuru Estate<br />
                Nairobi, Kenya
              </p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p style={O} className="text-[10px] tracking-[0.18em] uppercase text-[#4A3C30]">
            © 2025 Kitisuru Residence · All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   STICKY BOTTOM BAR — mobile only
══════════════════════════════════════════════ */
function StickyBottomBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#FAF7F2] border-t border-[#D5C9B8] px-6 py-3">
          <a href="#enquire"
            className="w-full flex items-center justify-center gap-2 h-14 bg-[#B86840] text-white"
            style={{ ...O, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Arrange a Viewing
            <ArrowRight size={13} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <InteriorLiving />
        <Amenities />
        <OutdoorLiving />
        <Gallery />
        <VideoShowcase />
        <Location />
        <EnquiryForm />
      </main>
      <Footer />
      <StickyBottomBar />
    </>
  );
}
