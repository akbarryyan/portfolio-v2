"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import * as THREE from "three";

const greetings = [
  "selamat datang",
  "welcome",
  "bienvenue",
  "willkommen",
  "bienvenido",
  "benvenuto",
  "yokoso",
  "ahlan wa sahlan",
  "namaste",
  "olaa",
];

const GREETING_INTERVAL_MS = 2200;
const INTRO_EXIT_BUFFER_MS = 1200;

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroItem = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const sectionItem = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const backgroundBands = [
  {
    className: "left-[-10%] top-[-6%] h-40 w-[70vw] rotate-[18deg]",
    duration: 18,
    delay: 0,
  },
  {
    className: "right-[-12%] top-[12%] h-44 w-[78vw] -rotate-[24deg]",
    duration: 22,
    delay: 0.8,
  },
  {
    className: "left-[-18%] top-[44%] h-52 w-[88vw] rotate-[10deg]",
    duration: 24,
    delay: 0.4,
  },
  {
    className: "right-[-16%] bottom-[8%] h-40 w-[72vw] -rotate-[14deg]",
    duration: 20,
    delay: 1.2,
  },
];

export default function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  const introRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<HTMLDivElement | null>(null);
  const overlaySectionRef = useRef<HTMLElement | null>(null);
  const greetingStageRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressValueRef = useRef<HTMLSpanElement | null>(null);

  const { scrollYProgress: overlayProgress } = useScroll({
    target: overlaySectionRef,
    offset: ["start end", "start start"],
  });

  const springConfig = {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  };

  const overlayTranslateY = useSpring(
    useTransform(overlayProgress, [0, 1], [96, 0]),
    springConfig,
  );
  const overlayScale = useSpring(
    useTransform(overlayProgress, [0, 1], [0.975, 1]),
    springConfig,
  );
  const overlayOpacity = useSpring(
    useTransform(overlayProgress, [0, 1], [0.72, 1]),
    springConfig,
  );
  const overlayRadius = useSpring(
    useTransform(overlayProgress, [0, 1], [48, 24]),
    springConfig,
  );
  const heroTranslateY = useSpring(
    useTransform(overlayProgress, [0, 1], [0, -32]),
    springConfig,
  );
  const heroScale = useSpring(
    useTransform(overlayProgress, [0, 1], [1, 0.985]),
    springConfig,
  );
  const heroOpacity = useSpring(
    useTransform(overlayProgress, [0, 1], [1, 0.86]),
    springConfig,
  );

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      gestureOrientation: "vertical",
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!threeRef.current || isIntroFinished) {
      return;
    }

    const container = threeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const particleCount = 96;
    const positions = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 24;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: "#d8dee9",
      size: 0.07,
      transparent: true,
      opacity: 0.35,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const glowGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#243041",
      transparent: true,
      opacity: 0.16,
    });

    const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
    glowPlane.position.z = -4;
    scene.add(glowPlane);

    const clock = new THREE.Clock();

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      particles.rotation.z = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.12) * 0.08;
      particles.position.y = Math.sin(elapsed * 0.32) * 0.12;
      glowPlane.material.opacity = 0.1 + Math.sin(elapsed * 0.45) * 0.03;
      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderFrame);

    const handleResize = () => {
      if (!container) {
        return;
      }

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(renderFrame);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isIntroFinished]);

  useEffect(() => {
    if (!mainRef.current || !introRef.current) {
      return;
    }

    gsap.set(mainRef.current, {
      autoAlpha: 0,
      y: 64,
    });

    gsap.fromTo(
      introRef.current.querySelectorAll("[data-intro-chrome]"),
      {
        autoAlpha: 0,
        y: 16,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
      },
    );
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.32,
        ease: "power2.out",
      });
    }

    if (progressValueRef.current) {
      gsap.to(progressValueRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [progress]);

  useEffect(() => {
    if (isIntroFinished) {
      return;
    }

    const introStartedAt = window.performance.now();
    const totalIntroDuration =
      greetings.length * GREETING_INTERVAL_MS + INTRO_EXIT_BUFFER_MS;

    const greetingTimer = window.setInterval(() => {
      setGreetingIndex((current) => (current + 1) % greetings.length);
    }, GREETING_INTERVAL_MS);

    const progressTimer = window.setInterval(() => {
      const elapsed = window.performance.now() - introStartedAt;
      const nextProgress = Math.min(
        Math.round((elapsed / totalIntroDuration) * 100),
        100,
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(progressTimer);
      }
    }, 80);

    return () => {
      window.clearInterval(greetingTimer);
      window.clearInterval(progressTimer);
    };
  }, [isIntroFinished]);

  useEffect(() => {
    if (progress < 100 || !introRef.current || !mainRef.current) {
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "power4.inOut",
      },
      onComplete: () => {
        setIsIntroFinished(true);
      },
    });

    timeline
      .to(
        greetingStageRef.current,
        {
          autoAlpha: 0,
          y: -16,
          filter: "blur(8px)",
          duration: 0.35,
        },
        0,
      )
      .to(
        introRef.current.querySelectorAll("[data-intro-bottom]"),
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.28,
          stagger: 0.04,
        },
        0,
      )
      .to(
        introRef.current,
        {
          yPercent: -100,
          duration: 1.35,
        },
        0.2,
      )
      .to(
        mainRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
        },
        0.55,
      );

    return () => {
      timeline.kill();
    };
  }, [progress]);

  const currentGreeting = greetings[greetingIndex];

  return (
    <main className="bg-[#050505] text-[#f2f2f2]">
      <div
        ref={mainRef}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(78,67,91,0.18),transparent_28%),linear-gradient(180deg,#09080b_0%,#0b090d_48%,#09080b_100%)]"
      >
        <div className="portfolio-vignette" />
        <div className="portfolio-noise" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />
        {backgroundBands.map((band) => (
          <motion.div
            key={band.className}
            aria-hidden="true"
            className={`portfolio-band ${band.className}`}
            animate={{
              x: [0, 24, -18, 0],
              y: [0, -18, 14, 0],
            }}
            transition={{
              duration: band.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: band.delay,
            }}
          />
        ))}
        <motion.section
          variants={heroContainer}
          initial="hidden"
          animate={isIntroFinished ? "show" : "hidden"}
          className="pointer-events-auto relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-5 pb-6 pt-5 sm:px-8 lg:px-10"
          style={{
            y: heroTranslateY,
            scale: heroScale,
            opacity: heroOpacity,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <motion.div
              variants={heroItem}
              className="flex items-center gap-5 text-[0.72rem] uppercase tracking-[0.28em] text-white/42"
            >
              <svg
                viewBox="0 0 120 120"
                className="h-20 w-20 shrink-0 text-white/88"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="portfolio-badge-path"
                    d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                  />
                </defs>
                <text
                  fill="currentColor"
                  fontSize="12"
                  letterSpacing="3.4"
                  fontWeight="600"
                >
                  <textPath href="#portfolio-badge-path">
                    FULLSTACK DEVELOPER • AKBAR RAYYAN •
                  </textPath>
                </text>
              </svg>
              <div className="hidden items-center gap-6 lg:flex">
                <span>Portfolio 2026</span>
                <span className="h-px w-8 bg-white/16" />
                <span>Indonesia</span>
                <span className="h-px w-8 bg-white/16" />
                <span className="inline-flex items-center gap-2 normal-case tracking-normal text-white/72">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                  Available for work
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={heroItem}
              className="flex items-center gap-5 text-sm font-medium text-white/64"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-white/52">ID</span>
                <span>/</span>
                <span className="text-[#796bff]">EN</span>
              </div>
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
                aria-label="Open menu"
              >
                <span className="flex flex-col gap-2">
                  <span className="h-0.5 w-7 bg-white" />
                  <span className="h-0.5 w-7 bg-white" />
                </span>
              </button>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 xl:block">
            <motion.p
              variants={heroItem}
              className="portfolio-side-label"
            >
              sys.intt(2026) // loaded
            </motion.p>
          </div>
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 xl:block">
            <motion.p
              variants={heroItem}
              className="portfolio-side-label portfolio-side-label--right"
            >
              index // rifki.dev
            </motion.p>
          </div>

          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-10 self-end pb-10 sm:pb-14 lg:pb-18">
              <motion.h1
                variants={heroItem}
                className="max-w-5xl text-[4rem] leading-[0.9] tracking-[-0.035em] text-white sm:text-[6.2rem] lg:text-[8.4rem] xl:text-[9.8rem]"
                style={{ fontFamily: 'var(--font-bungee)' }}
              >
                Akbar
                <br />
                Rayyan
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="max-w-xl text-lg leading-[1.6] text-white/58 sm:text-[1.05rem]"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                Professional Developer — passionate about building clean, fast,
                and scalable digital experiences.
              </motion.p>
            </div>

            <div className="grid h-full items-start pt-16 lg:justify-items-end lg:pt-24 xl:pt-28">
              <motion.div
                variants={heroContainer}
                className="w-full max-w-[21rem] space-y-7 text-right xl:translate-y-8"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Role
                  </p>
                  <p className="text-[1.2rem] leading-[1.38] font-semibold text-white/78 sm:text-[1.62rem]">
                    Fullstack Developer
                    <br />
                    Mobile App Developer
                  </p>
                </motion.div>
                <motion.div
                  variants={heroItem}
                  className="ml-auto h-px w-full max-w-[16rem] bg-white/10"
                />
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Focus
                  </p>
                  <p className="text-[1.18rem] leading-[1.46] font-semibold text-white/68 sm:text-[1.5rem]">
                    Web, Mobile Apps
                    <br />&amp; APIs
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="grid items-end gap-8 border-b border-white/8 pb-6 lg:grid-cols-[1fr_auto_1fr]">
            <motion.div
              variants={heroItem}
              className="max-w-xl text-sm uppercase tracking-[0.24em] text-white/26"
            >
              Smooth intro, cinematic landing, and carefully paced motion.
            </motion.div>

            <motion.div
              variants={heroItem}
              className="hidden items-center justify-center gap-3 self-center lg:flex"
            >
              <span className="text-sm uppercase tracking-[0.32em] text-white/30">
                Scroll
              </span>
              <span className="text-white/42">↓</span>
            </motion.div>

            <motion.div
              variants={heroContainer}
              className="flex flex-wrap justify-start gap-3 lg:justify-end"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <motion.a
                variants={heroItem}
                href="#about"
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
              >
                Download CV
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://linkedin.com"
                className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white"
              >
                LinkedIn ↗
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://github.com"
                className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white"
              >
                GitHub ↗
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://youtube.com"
                className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white"
              >
                Youtube ↗
              </motion.a>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <div className="relative z-10 h-screen min-h-screen" aria-hidden="true" />

      <div className="relative z-20">
        <motion.section
          ref={overlaySectionRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={heroContainer}
          id="about"
          className="portfolio-overlay-section relative min-h-screen px-0"
        >
          <motion.div
            className="portfolio-overlay-shell"
            style={{
              y: overlayTranslateY,
              scale: overlayScale,
              opacity: overlayOpacity,
              borderTopLeftRadius: overlayRadius,
              borderTopRightRadius: overlayRadius,
            }}
          >
            <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
              <div className="bg-black px-6 py-14 sm:px-10 lg:px-12 xl:px-16">
                <motion.div
                  variants={heroContainer}
                  className="flex h-full flex-col"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.p
                    variants={sectionItem}
                    className="text-[0.78rem] uppercase tracking-[0.48em] text-[#6f6148]"
                  >
                    About
                  </motion.p>
                  <motion.h2
                    variants={sectionItem}
                    className="mt-12 max-w-[14ch] text-[3.1rem] leading-[1.08] font-semibold tracking-[-0.05em] text-white sm:text-[4.3rem] lg:text-[4.8rem]"
                  >
                    Building things for the web and mobile app.
                  </motion.h2>
                  <motion.div
                    variants={sectionItem}
                    className="mt-10 h-px w-14 bg-white/18"
                  />
                  <motion.p
                    variants={sectionItem}
                    className="mt-14 max-w-[22ch] text-[1.15rem] leading-[1.52] text-white sm:text-[1.55rem] lg:text-[1.85rem]"
                  >
                    I am a fresh graduate in Software Engineering with a strong
                    passion for building innovative solutions in web, mobile,
                    and AI. With over 3 years of practical experience through
                    projects, intensive learning, and professional exposure, I
                    have built a solid foundation in modern application
                    development, problem-solving, and innovation.
                  </motion.p>
                </motion.div>
              </div>

              <div className="bg-[#6f5bf3] px-6 py-14 text-black sm:px-10 lg:px-12 xl:px-16">
                <motion.div
                  variants={heroContainer}
                  className="flex h-full flex-col gap-18"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.div variants={sectionItem} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-black/45">
                      01 — I Am
                    </p>
                    <div className="inline-block bg-black px-5 py-3">
                      <h3 className="text-[3rem] leading-[0.92] font-black tracking-[-0.06em] text-[#6f5bf3] sm:text-[4.3rem] lg:text-[5.3rem]">
                        Fullstack &amp; App
                        <br />
                        Mobile Dev.
                      </h3>
                    </div>
                  </motion.div>

                  <motion.div variants={sectionItem} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-black/45">
                      02 — Education
                    </p>
                    <div className="inline-block bg-black px-5 py-3">
                      <h3 className="text-[2.25rem] leading-[0.95] font-black tracking-[-0.06em] text-[#6f5bf3] sm:text-[3.35rem] lg:text-[4rem]">
                        Politeknik Negeri Indramayu
                      </h3>
                    </div>
                    <div className="space-y-1 text-black/72">
                      <p className="text-[1.35rem] font-semibold">
                        Software Engineering
                      </p>
                      <p className="text-lg text-black/48">
                        Graduated Oct - 2025
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={sectionItem} className="space-y-6">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-black/45">
                      03 — Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {[
                        "Web Programming",
                        "Mobile Programming",
                        "AI & ML Enthusiast",
                        "UI/UX Design",
                      ].map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-full bg-black px-6 py-3 text-lg font-medium text-[#6f5bf3]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {!isIntroFinished && (
        <div ref={introRef} className="intro-shell">
          <div ref={threeRef} className="intro-webgl" />

          <div className="intro-grid">
            <header className="flex items-start justify-between">
              <p
                data-intro-chrome
                className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
              >
                rifki.dev
              </p>
              <p
                data-intro-chrome
                className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
              >
                2026
              </p>
            </header>

            <div className="flex flex-1 items-center justify-center">
              <div
                ref={greetingStageRef}
                className="overflow-hidden px-6 text-center"
              >
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentGreeting}
                    initial={{
                      opacity: 0,
                      y: "42%",
                      filter: "blur(14px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: "0%",
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: "-18%",
                      filter: "blur(12px)",
                    }}
                    transition={{
                      duration: 1.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[2.9rem] leading-none font-medium tracking-tight text-white sm:text-[4.8rem] lg:text-[5.8rem]"
                  >
                    {currentGreeting}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              <div
                data-intro-bottom
                className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.08)_8%,rgba(255,255,255,0.06)_100%)]"
              >
                <div
                  ref={progressBarRef}
                  className="intro-progress-fill"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center justify-between">
                <p
                  data-intro-bottom
                  className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
                >
                  loading
                </p>
                <span
                  ref={progressValueRef}
                  data-intro-bottom
                  className="translate-y-1 text-[0.72rem] uppercase tracking-[0.36em] text-white/52"
                >
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
