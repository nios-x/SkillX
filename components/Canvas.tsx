"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/videosocket";
import {
  Pencil,
  Eraser,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Phone,
} from "lucide-react";

export default function Canvas(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isActivePen = useRef<boolean>(false);
  const listOfStrokes = useRef<
    Array<{ sc_X: number; sc_Y: number; tool: "pen" | "eraser" }>
  >([]);
  const [leave, setLeave] = useState(0);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (props.toremove) {
      fetch("/api/acceptinvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reqid: props.toremove, aord: "delete" }),
      }).catch(() => {});
    }
  }, [props.toremove]);

  useEffect(() => {
    if (!socket.socketMessages?.length) return;
    const latest = socket.socketMessages.at(-1);
    if (!latest) return;
    try {
      const data = JSON.parse(latest.content || latest.message || "{}");
      if (Array.isArray(data.strokes)) drawRemoteStrokes(data.strokes);
    } catch (err) {
      console.warn("Failed to parse incoming stroke data:", err);
    }
  }, [socket.socketMessages]);

  const resizeAndFill = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    resizeAndFill(canvas);
    const handleResize = () => resizeAndFill(canvasRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let prevx: number | null = null;
    let prevy: number | null = null;
    let pending = false;

    const draw = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (tool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        if (prevx !== null && prevy !== null) ctx.moveTo(prevx, prevy);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        // 🧽 Large eraser (100x100) working as line
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 100; // Eraser width
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        if (prevx !== null && prevy !== null) ctx.moveTo(prevx, prevy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      prevx = x;
      prevy = y;

      const sc_X = (x * 100) / rect.width;
      const sc_Y = (y * 100) / rect.height;
      listOfStrokes.current.push({ sc_X, sc_Y, tool });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActivePen.current || pending) return;
      pending = true;
      requestAnimationFrame(() => {
        draw(e);
        pending = false;
      });
    };

    const handleMouseUp = () => {
      prevx = null;
      prevy = null;
    };

    const activatePen = () => (isActivePen.current = true);
    const deactivatePen = () => {
      if (!isActivePen.current) return;
      isActivePen.current = false;
      if (socket.remoteUser && listOfStrokes.current.length > 0) {
        socket.send_message(
          socket.remoteUser,
          JSON.stringify({ strokes: listOfStrokes.current })
        );
      }
      listOfStrokes.current = [];
      setLeave((p) => p + 1);
    };

    document.addEventListener("mousedown", activatePen);
    document.addEventListener("mouseup", deactivatePen);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", activatePen);
      document.removeEventListener("mouseup", deactivatePen);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [leave, tool]);

  const drawRemoteStrokes = (
    strokes: { sc_X: number; sc_Y: number; tool: "pen" | "eraser" }[]
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let prev: { x: number; y: number } | null = null;

    for (const { sc_X, sc_Y, tool } of strokes) {
      const x = (sc_X * rect.width) / 100;
      const y = (sc_Y * rect.height) / 100;
      if (tool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (prev) ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 100;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        if (prev) ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      prev = { x, y };
    }
  };

  return (
    <div className="relative w-screen mt-10 h-screen flex items-center justify-center bg-zinc-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${
          tool === "pen" ? "cursor-crosshair" : "cursor-crosshair"
        }`}
      ></canvas>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md shadow-md">
        <button
          onClick={() => setTool("pen")}
          className={`p-3 rounded-full transition-all ${
            tool === "pen"
              ? "bg-white text-black shadow-lg"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <Pencil size={20} />
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`p-3 rounded-full transition-all ${
            tool === "eraser"
              ? "bg-white text-black shadow-lg"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <Eraser size={20} />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 z-9999 -translate-x-1/2 flex items-center gap-6 bg-black/60 px-6 py-3 rounded-full backdrop-blur-md shadow-lg">
        <button
          onClick={() => setVideoOn(!videoOn)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
        >
          {videoOn ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
        >
          {muted ? (
            <MicOff className="w-6 h-6 text-red-500" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={() => props.setFull(!props.full)}
          className={`p-3 rounded-full transition-all ${
            props.full
              ? "bg-gradient-to-r from-pink-500 to-purple-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <MonitorUp className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => (window.location.href = "/sessions")}
          className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-80 transition-all"
        >
          <Phone className="w-6 h-6 text-white rotate-135" />
        </button>
      </div>
    </div>
  );
}
