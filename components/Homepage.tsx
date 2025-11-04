"use client";

import React, { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { ButtonPrimary, ButtonSecondary } from "./button";
import Link from "next/link";
import {
  CalendarCheck,
  Code,
  Globe,
  Rocket,
  Shield,
  Users,
  Handshake,
  Video,
  TrendingUp
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const refhome = useRef<HTMLDivElement>(null);

  const refhomek = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0)


  // Mouse-follow with GSAP smooth easing
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX - innerWidth / 2) / 30 - 0;
      const y = (e.clientY - innerHeight / 2) / 30 + 0;

      gsap.to(heroTextRef.current, {
        x: -x,
        y: -y,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Using the custom GSAP hook
  useGSAP(() => {
    let progress = { value: 0 };

    gsap.to(progress, {
      value: 100,
      duration: 3,
      ease: "power4.out",
      onUpdate: () => {
        setPercentage(Math.floor(progress.value));
      },
      onComplete: () => {
        const tl = gsap.timeline();

        // Lift the gradient bars
        tl.to(".stgdivs", {
          y: "-100vh",
          duration: 1,
          ease: "power3.inOut",
          stagger: 0.1,
        });


        // Fade-in hero text
        tl.fromTo(
          heroTextRef.current,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
          "-=0.4"
        );
        tl.from(".logo1", {
          y: 100,      // or -100 if you want it from top
          opacity: 0,
          stagger: 0.1,
          ease: "power3.out",
        });
        tl.from(".logo2", {
          y: 100,      // or -100 if you want it from top
          opacity: 0,
          stagger: 0.04,
          ease: "power3.out",
        });

        //  tl.from(".obj", {
        //   scaleX:0,
        //   scaleY:0,     // or -100 if you want it from top
        //   opacity: 0,
        //   duration:1,
        // });

      },
    });
  }, []);


  // Scroll-based per-letter color transition
  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".text-line");

    lines.forEach((line) => {
      // Split the text of each line into individual letters
      const text = line.innerText;
      line.innerHTML = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.color = "#71717a"; // zinc-700
        line.appendChild(span);
      });

      // Animate each letter from gray → white as the line scrolls
      const spans = line.querySelectorAll("span");

      gsap.to(spans, {
        color: "#ffffff",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: line,
          start: "top 85%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    });
  }, []);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const text = container.current;

    gsap.fromTo(
      text,
      { xPercent: 0 },
      {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: text,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
     const elements = gsap.utils.toArray(".rotatescrolltrigger");

  gsap.from(elements, {
    scale: 0.6,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.25, // controls how quickly each one follows the previous
    scrollTrigger: {
      trigger: ".rotatescrolltrigger", // the first element or container
      start: "top 85%",
      end: "bottom 10%",
      scrub: true,
      toggleActions: "play none none reverse",
    },
  });

  }, []);




  return (
    <div ref={refhome} className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* Hero Section */}



      <div className="z-[99999] absolute pointer-events-none w-screen flex h-screen ">

        <div className="from-zinc-800 to-black bg-gradient-to-t w-[25%] h-full stgdivs  "></div>
        <div className="from-zinc-800 to-black bg-gradient-to-t w-[25%] h-full stgdivs  "></div>
        <div className="from-zinc-800 to-black bg-gradient-to-t w-[25%] h-full stgdivs  "></div>
        <div className="from-zinc-800 to-black bg-gradient-to-t w-[25%] h-full stgdivs font-extrabold text-5xl text-white flex flex-col justify-end items-end p-8">
          <div className="z-30 w-full animate-gradient-x bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none mf4
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            style={{
              filter: "brightness(2) contrast(1.0)",
              textShadow: `
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 40px rgba(147, 51, 234, 0.6)
    `,
            }}  >
            <span className="scale-y-[1.2] w-full text-md">LOADING</span>
            <div className="w-full h-[]"></div>
            <span className="scale-y-[1.2] w-full text-[140px]">{percentage}%</span>
          </div>
        </div>

      </div>
      <div
        ref={heroTextRef} className="relative  w-screen  h-screen overflow-hidden bg-black">
        {/* Blur Layer - behind Spline */}
        <div

          className="absolute w-[400px] h-[200px] top-1/2 left-1/3 
               -translate-x-[50%] -translate-y-[20%]  
                bg-pink-500  rounded-full z-[99] blur-[100px] "
        />
        <div
          className="absolute w-[400px] h-[300px] top-1/2 left-1/3 
               -translate-x-[110%] -translate-y-[80%]  
                bg-purple-700  rounded-full z-[99] blur-[100px] "
        />


        {/* Spline 3D Scene */}
        <Spline

          scene="/cube_and_balls.spline"
          className="absolute inset-0 pointer-events-none select-none z-10 obj"
        />

        {/* Hero Text */}
        <div
          className="absolute top-1/2 left-[10%] -translate-y-1/2 z-[99] space-y-4"
        >
          <h1
            className="z-30 animate-gradient-x bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent text-[200px] font-extrabold leading-none mf4 w-max 
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            style={{
              filter: "brightness(2) contrast(1.0)",
              textShadow: `
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 40px rgba(147, 51, 234, 0.6)
    `,
            }}
          >
            {"SKILL X".split("").map((e) => (<span className="logo1">{e}</span>))}
          </h1>


          <div className="hero-subtext flex flex-wrap text-3xl flex-col md:text-4xl font-light space-x-3">
            <span className="pl-3 logo1">
              The <span className="z-30 animate-gradient-x bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none mf4 w-max 
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
                style={{
                  filter: "brightness(2) contrast(1.0) ",
                  textShadow: `
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 40px rgba(147, 51, 234, 0.6)
    `,
                }}> Ultimate</span>
            </span>
            <span className="ml-3 ">
              <strong className="font-semibold text-white mf2 ">{"Mentorship Networking Platform".split("").map((e) => (<span className="logo2">{e}</span>))}</strong>
            </span>
            <span className="pl-4 w-full mt-2 text-lg md:text-xl text-gray-300 mf3 ">
              {"Learn and Grow with Mentors & Peers Worldwide".split("").map((e) => (<span className="logo2">{e}</span>))}
            </span>
          </div>
          <div className="flex flex-wrap mt-6 gap-4">

            <Link href="/signup">
              <ButtonPrimary styles="px-6 py-2 text-base logo2 ">Get Started</ButtonPrimary>
              <div className="absolute -top-5 -right-5">
              </div>
            </Link>
            <Link href="/login" className="relative flex items-center">
              <ButtonSecondary styles="px-6 py-2 text-base logo2">
                Login
              </ButtonSecondary>

            </Link>

          </div>
        </div>
      </div>














      <div className="h-screen p-18 mb-20 .text-line">
        <div className="text-6xl py-2 text-zinc-700">
          <div>
            At <span className="z-30 animate-gradient-x bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none  mf4 w-max 
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
              style={{
                filter: "brightness(2) contrast(1.0) ",
                textShadow: `
                  0 0 10px rgba(255, 255, 255, 0.2),
                  0 0 20px rgba(255, 0, 255, 0.4),
                  0 0 40px rgba(147, 51, 234, 0.6)
                  `,
              }}> SKILLX, </span>


            we’re not just  another <span className="mf1  text-zinc-200"> mentorship platform</span>;

            <div>

              we are the artisans of <span className="mf1 text-zinc-200"> learning and mastery </span>.
            </div>
          </div>
          <div>
            Our pursuit? To transform your potential into<span className="mf1 text-zinc-200"> real-world expertise</span> with <span className="mf1 text-zinc-200">immersive guidance</span> & <span className="mf1 text-zinc-200">unparalleled mentoring</span>.
          </div>
        </div>



        <div className="flex mt-50 justify-evenly">
          <div className="w-max text-[200px] mf2 relative">
            TEAM
            <div className="z-30 w-full animate-gradient-x bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none mf4
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] text-[100px] absolute w-max text-right right-0 -translate-y-27"
              style={{
                filter: "brightness(2) contrast(1.0)",
                textShadow: `
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 40px rgba(147, 51, 234, 0.6)
    `,
              }}  >SKILLX</div>
          </div>

          <span>
            <div
              className="z-30 animate-gradient-x mt-20 bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
                      bg-clip-text text-transparent text-6xl font-extrabold leading-none  mf4 w-max 
                      drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
              style={{
                filter: "brightness(2) contrast(1.0) ",
                textShadow: `
                        0 0 10px rgba(255, 255, 255, 0.2),
                        0 0 20px rgba(255, 0, 255, 0.4),
                        0 0 40px rgba(147, 51, 234, 0.6)
                  `,
              }}>
              created by 
            </div>
            <div className="text-xl pr-5 mf2">

              <div>
                8NT_VIPER - DEVYANSH MANDAL (PROJECT LEAD)
              </div>
              <div>
                8NT_SAIBOT - SOUMYA JAISWAL (FULL STACK DEV)
              </div>
              <div>
                8NT_ANKITOP - ANKIT PANDEY (FRONTEND DEV)
              </div>
              <div>
                8NT_NIDA - NIDA SOHAIL (UI/UX)
              </div>
            </div>
          </span>
        </div>
      </div>

      <div
        ref={container}
        className="whitespace-nowrap  text-[6vw] mt-60 font-extrabold leading-none tracking-tight"
      >
        <div>
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS
        </div>
        <div>
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS
        </div>
        <div>
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;
          BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS&nbsp;BUILDTOEMPOWERLEARNERS
        </div>
      </div>


    {/* Floating Stats Row */}
   <div className="flex justify-center mt-30 py-16 bg-black">
  <div className="flex flex-wrap justify-center gap-16 text-white">
    {/* Mentors */}
    <div className="flex items-center gap-5 mf2  transition-transform duration-300 hover:scale-110 rotatescrolltrigger">
      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_40px_10px_rgba(236,72,153,0.8)] brightness-[1.6] hover:contrast-125">
          <Users className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      <span className="text-2xl font-semibold text-gray-200 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] hover:text-white transition-all duration-300">
        Mentors
      </span>
    </div>

    {/* Community */}
    <div className="flex items-center gap-5 mf2 transition-transform duration-300 hover:scale-110 rotatescrolltrigger">
      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_40px_10px_rgba(236,72,153,0.8)] brightness-[1.6] hover:contrast-125">
          <Handshake className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      <span className="text-2xl font-semibold text-gray-200 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] hover:text-white transition-all duration-300">
        Community
      </span>
    </div>

    {/* Sessions */}
    <div className="flex items-center gap-5 mf2 transition-transform duration-300 hover:scale-110 rotatescrolltrigger">
      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_40px_10px_rgba(236,72,153,0.8)] brightness-[1.6] hover:contrast-125">
          <Video className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      <span className="text-2xl font-semibold text-gray-200 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] hover:text-white transition-all duration-300">
        Sessions
      </span>
    </div>

    {/* Growth */}
    <div className="flex items-center gap-5 mf2 transition-transform duration-300 hover:scale-110 rotatescrolltrigger">
      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_40px_10px_rgba(236,72,153,0.8)] brightness-[1.6] hover:contrast-125">
          <TrendingUp className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      <span className="text-2xl font-semibold text-gray-200 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] hover:text-white transition-all duration-300">
        Growth
      </span>
    </div>
  </div>
</div>


      {/* How it Works Section */}
      
    <section
      ref={worksRef}
      className="flex flex-col items-center justify-center min-h-[500px] mt-24 px-6"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          How <span className="text-purple-400"> <span className="z-30 animate-gradient-x bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none  mf4 w-max 
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
              style={{
                filter: "brightness(2) contrast(1.0) ",
                textShadow: `
                  0 0 10px rgba(255, 255, 255, 0.2),
                  0 0 20px rgba(255, 0, 255, 0.4),
                  0 0 40px rgba(147, 51, 234, 0.6)
                  `,
              }}> SKILLX </span>
 </span> works
        </h2>
        <p className="text-gray-400 mt-4 text-base md:text-lg">
          Earn credits by helping, spend credits to get help. Simple.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center items-stretch gap-20 max-w-7xl">
        {[
          {
            icon: Users,
            title: "Create your profile",
            desc: "Create your profile, share your expertise, and set your learning goals.",
          },
          {
            icon: CalendarCheck,
            title: "Schedule a Session",
            desc: "Chat, call, or meet online to start your mentorship journey.",
          },
          {
            icon: Rocket,
            title: "Grow Together",
            desc: "Build skills, share experiences, and track your progress.",
          },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="flex flex-col bg-gradient-to-br from-[#1c0a20] to-[#140014] p-8 rounded-3xl border border-gray-800 w-full sm:w-[360px] hover:shadow-[0_0_25px_rgba(180,0,255,0.4)] transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full mr-4 shadow-lg transition-all duration-500 hover:shadow-[0_0_25px_6px_rgba(236,72,153,0.6)]">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

      {/* Categories Section */}
       <section
      ref={categoryRef}
      className="flex flex-col items-center justify-center text-center py-0"
    >
<div className="h-screen relative w-full">
  <div className="absolute top-1/2 left-1/2 -translate-x-[150%]">
        <div className="text-[80px] mf2">MEET</div>
      <span className="z-30 animate-gradient-x bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none  mf4 w-max 
  text-[160px]
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] -translate-y-12 absolute"
  style={{
                filter: "brightness(2) contrast(1.0) ",
                textShadow: `
                0 0 10px rgba(255, 255, 255, 0.2),
                  0 0 20px rgba(255, 0, 255, 0.4),
                  0 0 40px rgba(147, 51, 234, 0.6)
                  `,
                }}> milli.ai  </span>
        </div>

       <Spline

scene="/robot_follow_cursor_for_landing_page.spline"
className="h-screen"
/>
</div>
      {/* Header */}
      <div className="mb-12">
        <h2 className="text4xl md:text-4xl font-extrabold text-white">
          Popular <span className="z-30 animate-gradient-x bg-gradient-to-r text-md from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none  mf4 w-max 
  text-4xl
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
  style={{
                filter: "brightness(2) contrast(1.0) ",
                textShadow: `
                0 0 10px rgba(255, 255, 255, 0.2),
                  0 0 20px rgba(255, 0, 255, 0.4),
                  0 0 40px rgba(147, 51, 234, 0.6)
                  `,
                }}>categories </span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Discover active communities ready to learn.
        </p>
      </div>

      {/* Category Row */}
      <div className="flex justify-center items-center gap-8 px-8 flex-nowrap overflow-x-auto no-scrollbar">
        {[
          { icon: Code, tag: "Hot", title: "Web Development" },
          { icon: Rocket, tag: "Trending", title: "UI/UX Design" },
          { icon: Globe, tag: "Active", title: "Marketing" },
          { icon: Shield, tag: "New", title: "Career Coaching" },
        ].map(({ icon: Icon, tag, title }, i) => (
          <div
            key={i}
            className="flex items-center bg-gradient-to-br from-[#1a0b1e] to-[#130015] px-6 py-5 rounded-2xl border border-gray-800 hover:shadow-[0_0_20px_rgba(180,0,255,0.35)] transition-all duration-300 flex-shrink-0"
          >
            <div className="bg-gradient-to-br from-pink-600 to-purple-700 p-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:shadow-[0_0_18px_5px_rgba(236,72,153,0.6)]">
              <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="ml-4 text-left">
              <p className="text-sm md:text-base text-gray-400 font-medium">
                {tag}
              </p>
              <p className="text-white font-semibold text-base md:text-lg leading-tight">
                {title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
    
      {/* Footer */}
      <footer className="w-full bg-[#0b0a0c] border-t border-gray-800 py-4 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
          <p className="text-gray-400 text-sm">
            © 2025 <span className="text-white font-medium">SkillX</span>. All
            rights reserved.
          </p>
        </div>
      </footer>
      
</div>
  );
}
