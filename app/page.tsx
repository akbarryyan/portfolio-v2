"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import * as THREE from "three";

const greetings = [
  "selamat datang",
  "welcome",
  "benvenuto",
  "환영합니다",
  "欢迎",
];

const menuItems = [
  "Home",
  "About",
  "Selected Work",
  "Experience",
  "Certificate",
  "Contact",
];

const socialItems = ["LinkedIn", "Instagram", "Github", "Youtube"];

const aboutDescription =
  "I am a fresh graduate in Software Engineering with a strong passion for building innovative solutions in web, backend systems, and AI. With over 3 years of practical experience through projects, intensive learning, and professional exposure, I have built a solid foundation in modern application development, problem-solving, and innovation.";
const aboutWords = aboutDescription.split(" ");
const stackSections: Array<{
  title: string;
  items: Array<{
    name: string;
    icon: string;
    className?: string;
  }>;
}> = [
  {
    title: "Languages",
    items: [
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
    ],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "Bootstrap",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
        className: "invert",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
        className: "invert",
      },
      {
        name: "GSAP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/greensock/greensock-original.svg",
      },
      {
        name: "Three.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
        className: "invert",
      },
    ],
  },
  {
    title: "Databases & ORM",
    items: [
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Redis",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
      },
      {
        name: "Prisma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
      },
      {
        name: "Sequelize",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sequelize/sequelize-original.svg",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
      },
    ],
  },
];

const GREETING_INTERVAL_MS = 2200;
const LAST_GREETING_HOLD_MS = 900;

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

const overlayColumn = {
  hidden: {
    opacity: 0,
    y: 54,
    filter: "blur(14px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const overlayItem = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const overlayTextGroup = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.22,
    },
  },
};

const overlayTextWord = {
  hidden: {
    opacity: 1,
    color: "rgba(255,255,255,0.12)",
    filter: "blur(1px)",
  },
  show: {
    opacity: 1,
    color: "rgba(255,255,255,0.98)",
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const overlayMaskBox = {
  hidden: {
    clipPath: "inset(0 100% 0 0 round 0px)",
  },
  show: {
    clipPath: "inset(0 0% 0 0 round 0px)",
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const overlayMaskText = {
  hidden: {
    opacity: 0,
    x: -34,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      delay: 0.14,
      ease: [0.16, 1, 0.3, 1] as const,
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

function StackGlyph({
  name,
  icon,
  className,
}: Readonly<{
  name: string;
  icon: string;
  className?: string;
}>) {
  return (
    <div className="flex h-28 min-w-28 items-center justify-center px-2">
      <Image
        src={icon}
        alt={name}
        width={96}
        height={96}
        unoptimized
        className={`h-20 w-20 object-contain sm:h-24 sm:w-24 ${className ?? ""}`}
      />
    </div>
  );
}

export default function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const introRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<HTMLDivElement | null>(null);
  const overlaySectionRef = useRef<HTMLElement | null>(null);
  const rightOverlayRef = useRef<HTMLDivElement | null>(null);
  const greetingStageRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressValueRef = useRef<HTMLSpanElement | null>(null);

  const { scrollYProgress: overlayProgress } = useScroll({
    target: overlaySectionRef,
    offset: ["start end", "start start"],
  });
  const isRightOverlayInView = useInView(rightOverlayRef, {
    once: true,
    amount: 0.25,
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
    useTransform(overlayProgress, [0, 0.3, 1], [1, 0.22, 0.04]),
    springConfig,
  );
  const heroBlur = useSpring(
    useTransform(overlayProgress, [0, 1], [0, 18]),
    springConfig,
  );
  const heroFilter = useTransform(heroBlur, (value) => `blur(${value}px)`);

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
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
      (greetings.length - 1) * GREETING_INTERVAL_MS + LAST_GREETING_HOLD_MS;

    const greetingTimer = window.setInterval(() => {
      setGreetingIndex((current) => {
        if (current >= greetings.length - 1) {
          window.clearInterval(greetingTimer);
          return current;
        }

        return current + 1;
      });
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
        className="fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(78,67,91,0.18),transparent_28%),linear-gradient(180deg,#09080b_0%,#0b090d_48%,#09080b_100%)]"
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
          className="pointer-events-auto relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5 lg:px-10"
          style={{
            y: heroTranslateY,
            scale: heroScale,
            opacity: heroOpacity,
            filter: heroFilter,
          }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <motion.div
              variants={heroItem}
              className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/42 sm:gap-5 sm:text-[0.72rem] sm:tracking-[0.28em]"
            >
              <svg
                viewBox="0 0 120 120"
                className="h-14 w-14 shrink-0 text-white/88 sm:h-20 sm:w-20"
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
              className="flex items-center gap-3 text-xs font-medium text-white/64 sm:gap-5 sm:text-sm"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-white/52">ID</span>
                <span>/</span>
                <span className="text-[#796bff]">EN</span>
              </div>
              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.03] sm:h-20 sm:w-20"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => {
                  setIsMenuOpen((current) => !current);
                }}
              >
                <span className="flex flex-col gap-1.5 sm:gap-2">
                  <span
                    className={`h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen
                        ? "w-5 translate-y-[4px] rotate-45 sm:w-7 sm:translate-y-[5px]"
                        : "w-5 sm:w-7"
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen
                        ? "w-5 -translate-y-[4px] -rotate-45 sm:w-7 sm:-translate-y-[5px]"
                        : "w-5 sm:w-7"
                    }`}
                  />
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
              index // akbar.dev
            </motion.p>
          </div>

          <div className="grid flex-1 items-end gap-8 pt-6 sm:gap-10 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5 self-end pb-8 sm:space-y-10 sm:pb-14 lg:pb-18">
              <motion.div
                variants={heroItem}
                className="space-y-2 sm:hidden"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/42">
                  Portfolio 2026
                  <span className="mx-2 text-white/28">—</span>
                  Indonesia
                </p>
                <p className="inline-flex items-center gap-2 text-sm text-white/78">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                  Available for work
                </p>
              </motion.div>
              <motion.h1
                variants={heroItem}
                className="max-w-5xl text-[3.4rem] leading-[0.92] tracking-[-0.03em] text-white sm:text-[6.2rem] sm:leading-[0.9] sm:tracking-[-0.035em] lg:text-[8.4rem] xl:text-[9.8rem]"
                style={{ fontFamily: 'var(--font-bungee)' }}
              >
                Akbar
                <br />
                Rayyan
              </motion.h1>

              <motion.div
                variants={heroItem}
                className="space-y-1.5 sm:hidden"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <p className="text-[1.05rem] font-semibold text-white/86">
                  Fullstack Developer
                </p>
                <p className="text-[1.05rem] font-semibold text-white/72">
                  Backend & API Developer
                </p>
              </motion.div>

              <motion.p
                variants={heroItem}
                className="max-w-md text-sm leading-7 text-white/62 sm:max-w-xl sm:text-[1.05rem] sm:leading-[1.6]"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                Fullstack Developer — focused on building fast, reliable, and
                scalable digital products.
              </motion.p>
            </div>

            <div className="hidden h-full items-start pt-2 lg:grid lg:justify-items-end lg:pt-24 xl:pt-28">
              <motion.div
                variants={heroContainer}
                className="w-full max-w-none space-y-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-left backdrop-blur-sm sm:max-w-[21rem] sm:space-y-7 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-right xl:translate-y-8"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Role
                  </p>
                  <p className="text-[1rem] leading-[1.42] font-semibold text-white/82 sm:text-[1.62rem]">
                    Fullstack Developer
                  </p>
                </motion.div>
                <motion.div
                  variants={heroItem}
                  className="h-px w-full bg-white/10 sm:ml-auto sm:max-w-[16rem]"
                />
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Focus
                  </p>
                  <p className="text-[1rem] leading-[1.46] font-semibold text-white/72 sm:text-[1.5rem]">
                    Web Platforms
                    <br />&amp; APIs
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="grid items-end gap-5 border-b border-white/8 pb-4 sm:gap-8 sm:pb-6 lg:grid-cols-[1fr_auto_1fr]">
            <div className="hidden lg:block" aria-hidden="true" />

            <motion.div
              variants={heroItem}
              className="hidden items-center justify-center gap-3 self-center lg:col-start-2 lg:flex"
            >
              <span className="text-sm uppercase tracking-[0.32em] text-white/30">
                Scroll
              </span>
              <span className="text-white/42">↓</span>
            </motion.div>

            <motion.div
              variants={heroContainer}
              className="flex flex-wrap gap-2 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-3 lg:col-start-3 lg:justify-end"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <motion.a
                variants={heroItem}
                href="#about"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 sm:h-12 sm:justify-start sm:px-7"
              >
                Download CV
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://linkedin.com"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white sm:h-12 sm:justify-start sm:px-6"
              >
                LinkedIn ↗
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://github.com"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white sm:h-12 sm:justify-start sm:px-6"
              >
                GitHub ↗
              </motion.a>
              <motion.a
                variants={heroItem}
                href="https://youtube.com"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white sm:h-12 sm:justify-start sm:px-6"
              >
                Youtube ↗
              </motion.a>
            </motion.div>

            <motion.div
              variants={heroItem}
              className="flex items-center justify-center gap-3 pt-12 sm:hidden"
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-white/28">
                Scroll
              </span>
              <span className="text-white/34">↓</span>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <div
        className="pointer-events-none relative z-10 h-screen min-h-screen"
        aria-hidden="true"
      />

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
              <motion.div
                variants={overlayColumn}
                className="flex min-h-screen bg-black px-6 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16"
              >
                <motion.div
                  variants={overlayColumn}
                  className="flex h-full w-full flex-col justify-start sm:justify-center"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.p
                    variants={overlayItem}
                    className="hidden text-[0.78rem] uppercase tracking-[0.48em] text-[#6f6148] sm:block"
                  >
                    About
                  </motion.p>
                  <motion.h2
                    variants={overlayItem}
                    className="mt-2 max-w-[10ch] text-[2.95rem] leading-[1.02] font-semibold tracking-[-0.06em] text-white sm:mt-12 sm:max-w-[14ch] sm:text-[4.3rem] lg:text-[4.8rem]"
                  >
                    Building things for the web and backend systems.
                  </motion.h2>
                  <motion.div
                    variants={overlayItem}
                    className="mt-9 h-px w-14 bg-white/18 sm:mt-10"
                  />
                  <motion.p
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.45 }}
                    className="mt-12 max-w-none text-[1.02rem] leading-[1.72] text-white/92 sm:mt-14 sm:max-w-[22ch] sm:text-[1.55rem] sm:leading-[1.52] lg:text-[1.85rem]"
                  >
                    <motion.span variants={overlayTextGroup} className="block">
                      {aboutWords.map((word, index) => (
                        <motion.span
                          key={`${word}-${index}`}
                          variants={overlayTextWord}
                          className="inline-block pr-[0.24em] align-top sm:pr-[0.28em]"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.span>
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div
                ref={rightOverlayRef}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={overlayColumn}
                className="portfolio-blue-panel min-h-screen px-4 py-10 text-black sm:px-10 sm:py-14 lg:px-12 xl:px-16"
                animate={
                  isRightOverlayInView
                    ? {
                        backgroundPosition: [
                          "0% 0%, 0% 0%",
                          "100% 0%, 0% 100%",
                          "0% 0%, 0% 0%",
                        ],
                      }
                    : {
                        backgroundPosition: "0% 0%, 0% 0%",
                      }
                }
                transition={
                  isRightOverlayInView
                    ? {
                        duration: 14,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : undefined
                }
              >
                <motion.div
                  variants={overlayColumn}
                  className="flex h-full flex-col justify-start gap-10 sm:gap-18"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.div variants={overlayItem} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      01 — I Am
                    </p>
                    <motion.div
                      variants={overlayMaskBox}
                      className="inline-block overflow-hidden bg-black px-4 py-2 sm:px-5 sm:py-3"
                    >
                      <motion.h3
                        variants={overlayMaskText}
                        className="text-[2rem] leading-[0.94] font-black tracking-[-0.06em] text-[#6f5bf3] sm:text-[4.3rem] lg:text-[5.3rem]"
                      >
                        Fullstack &amp;
                        <br />
                        Backend Dev.
                      </motion.h3>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={overlayItem} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      02 — Education
                    </p>
                    <motion.div
                      variants={overlayMaskBox}
                      className="inline-block overflow-hidden bg-black px-4 py-2 sm:px-5 sm:py-3"
                    >
                      <motion.h3
                        variants={overlayMaskText}
                        className="text-[1.5rem] leading-[0.98] font-black tracking-[-0.05em] text-[#6f5bf3] sm:text-[3.35rem] lg:text-[4rem]"
                      >
                        Politeknik Negeri Indramayu
                      </motion.h3>
                    </motion.div>
                    <div className="space-y-1 text-white/92">
                      <p className="text-[1.05rem] font-semibold sm:text-[1.35rem]">
                        Teknik Informatika
                      </p>
                      <p className="text-base text-white/72 sm:text-lg">
                        Graduated Oct - 2025
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={overlayItem} className="space-y-6">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      03 — Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {[
                        "Web Programming",
                        "Backend Development",
                        "AI & ML Enthusiast",
                        "UI/UX Design",
                      ].map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-[#6f5bf3] sm:px-6 sm:py-3 sm:text-lg"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                </motion.div>
              </motion.div>
            </div>

            <motion.section
              variants={overlayItem}
              className="bg-black px-4 py-10 text-white sm:px-10 sm:py-12 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <h2
                  className="text-4xl font-black tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  STACK
                </h2>

                {stackSections.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-5 sm:space-y-8">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78 sm:px-5 sm:py-3 sm:text-[12px] sm:tracking-[0.16em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6f5bf3]" />
                      {section.title}
                    </div>

                    <div className="stack-marquee">
                      <motion.div
                        className="stack-marquee__track"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                          duration: 26 + sectionIndex * 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        {[...section.items, ...section.items].map((item, index) => (
                          <div
                            key={`${section.title}-${item.name}-${index}`}
                            className="stack-marquee__item"
                          >
                            <StackGlyph
                              name={item.name}
                              icon={item.icon}
                              className={item.className}
                            />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
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
                akbar.dev
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] bg-black/62 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                x: "100%",
                borderTopLeftRadius: 48,
                borderBottomLeftRadius: 48,
              }}
              animate={{
                x: 0,
                borderTopLeftRadius: 32,
                borderBottomLeftRadius: 32,
              }}
              exit={{
                x: "100%",
                borderTopLeftRadius: 48,
                borderBottomLeftRadius: 48,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto my-3 mr-3 flex min-h-[calc(100vh-1.5rem)] w-[calc(100%-1rem)] max-w-[31rem] flex-col overflow-hidden bg-black px-4 py-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:my-5 sm:mr-5 sm:min-h-[calc(100vh-2.5rem)] sm:w-[min(31rem,calc(100%-2.5rem))] sm:max-w-[33rem] sm:px-7 sm:py-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className="flex h-12 items-center text-xs leading-none uppercase tracking-[0.12em] text-white/68 sm:h-14 sm:text-sm sm:tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  <span className="text-white/52">ID</span>
                  <span className="mx-2 text-white/38">/</span>
                  <span className="text-[#796bff]">EN</span>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] text-white transition-transform duration-300 hover:scale-[1.03] sm:h-14 sm:w-14"
                >
                  <span className="relative block h-4.5 w-4.5 sm:h-5 sm:w-5">
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-45 bg-white" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 -rotate-45 bg-white" />
                  </span>
                </button>
              </div>

              <div className="mt-6 border-t border-white/18 pt-8 sm:mt-8 sm:pt-10">
                <p
                  className="mb-4 text-[0.68rem] uppercase tracking-[0.11em] text-[#756246] sm:mb-5 sm:text-[0.78rem] sm:tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  Navigation
                </p>
                <nav>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 36 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 18 }}
                        transition={{
                          delay: 0.08 + index * 0.05,
                          duration: 0.48,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                          }}
                          className="text-left text-[1.72rem] leading-[1.02] tracking-[0.01em] text-white transition-opacity duration-300 hover:opacity-70 sm:text-[2.85rem] sm:leading-[0.98] sm:tracking-[0.015em]"
                          style={{ fontFamily: "var(--font-bungee)" }}
                        >
                          {item}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-auto border-t border-white/10 pt-6"
              >
                <p
                  className="mb-3 text-[0.68rem] uppercase tracking-[0.11em] text-[#756246] sm:text-[0.78rem] sm:tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  Social
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-[0.72rem] text-white sm:text-[0.9rem]">
                  {socialItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}
