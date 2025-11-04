"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useSocket } from "@/hooks/videosocket";
import { useAppContext } from "@/context/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster, toast } from "sonner"; // ✅ Sonner import

export default function Page() {
  const [request, setRequests] = useState([]);
  const { createCall, setToRemove } = useSocket();
  const appcontxt = useAppContext();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/getschedules", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch scheduled sessions");
      }
    };
    fetchRequests();
  }, []);

  const handleFetch = async (id: string, action: "accept" | "delete") => {
    try {
      const res = await fetch("/api/acceptinvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reqid: id, aord: action }),
      });
      const data = await res.json();

      if (res.ok && data.response === "success") {
        setRequests((prev) => prev.filter((r: any) => r.id !== id));
        toast.success(action === "delete" ? "Session aborted" : "Action successful!");
      } else {
        toast.error(data.error || "Server error");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    }
  };

  return (
    <>
       <Toaster richColors theme="dark" position="top-right" />

      <div className='w-full min-h-screen flex justify-center'>
        <div className='w-2/3 mt-20 h-full'>
          <div className='skillxlogo w-max py-2 text-3xl font-semibold'>
            Sessions Scheduled
          </div>
          <div className="w-full">
            {request.length ? (
              request.map((e: any) => {
                console.log(e)
              return <TutorRequestCard
                  key={e.id}
                  {...e}
                  createCall={createCall}
                  setToRemove={setToRemove}
                  handleFetch={handleFetch}
                  appcontxt={appcontxt}
                />
})
            ) : (
              <div className="text-white text-center py-50">No Scheduled sessions</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function TutorRequestCard(props: any) {
  const { userdata } = useAppContext();

  const increasePoints = async () => {
    try {
      await fetch("/api/increase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userdata.id }),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to increase points");
    }
  };

  return (
    <div className="w-full mt-3 bg-[#141016] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 text-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2">
            <h2 className="text-base font-semibold">{(userdata.name !== props.other.name?  props.other.name:props.user.name) || "FriendName"}</h2>
            <p className="text-sm text-gray-400">{props.other.bio || "Developer"}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-pink-400">{Array(5).fill(1).map(_ => "★")}</span>
              <p className="text-xs text-gray-500">4.9 (127)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={async () => {
              await increasePoints();
              props.setToRemove(props.id);
              props.createCall(
                props.appcontxt.userdata.id !== props.userId ? props.userId : props.friendId
              );
            }}
            className="bg-gradient-to-r from-[#ff4d8d] to-[#a855f7] text-xs px-4 py-1.5 rounded-lg font-extrabold cursor-pointer"
          >
            Start Session
          </button>

          <AlertDialog>
            <AlertDialogTrigger className="text-xs cursor-pointer">Abort Session</AlertDialogTrigger>
            <AlertDialogContent className="transition rounded-3xl border border-white/20
              bg-[linear-gradient(45deg,rgba(255,0,255,0.1),rgba(255,255,255,0.02))]
              backdrop-blur-3xl p-6 text-white shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="skillxlogo">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will abort the session
                  and remove your scheduled session from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="skillxlogo border-purple-500 cursor-pointer shadow-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="skillxlogo2 text-white cursor-pointer shadow-xl"
                  onClick={() => props.handleFetch(props.id, "delete")}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Wants to Learn */}
      <div>
        <p className="text-sm text-gray-400 mb-1">Wants to Learn</p>
        <div className="bg-[#1d1b20] px-4 py-2 rounded-lg text-sm font-medium">{props.skill || "Skills"}</div>
      </div>

      {/* Offering & Requested */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#1d1b20] px-4 py-2 rounded-lg text-sm">
          <p className="text-gray-400 text-xs">Offering</p>
          <p className="text-pink-400 font-semibold">{props.other.Offering || "1"} pt</p>
        </div>
        <div className="flex-1 bg-[#1d1b20] px-4 py-2 rounded-lg text-sm">
          <p className="text-gray-400 text-xs">Requested</p>
          <p className="text-white font-medium">{props.other.timeago || "Few Moments ago"}</p>
        </div>
      </div>

      {/* Message Button */}
      <button className="flex items-center gap-2 border border-[#3b3b3b] rounded-lg px-4 py-2 text-sm font-medium hover:border-purple-400 transition-colors">
        <MessageCircle size={16} />
        <div className="text-xs">{props.desc || "View message"}</div>
      </button>
    </div>
  );
}
