"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner"; // ✅ import Sonner

export default function Page() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/getrequests", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (error) {
        toast.error("Failed to fetch requests.");
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Accept / Delete request
  const handleFetch = async (id: string, action: "accept" | "delete") => {
    try {
      setLoading(true);

      const res = await fetch("/api/acceptinvite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reqid: id,
          aord: action,
        }),
      });

      const data = await res.json();

      if (res.ok && data.response === "success") {
        // Optimistically update UI
        setRequests((prev) => prev.filter((r) => r.id !== id));

        // ✅ Show toast notification
        if (action === "accept") {
          toast.success("Request accepted successfully!");
        } else {
          toast("Request rejected.", { description: "The request has been deleted." });
        }
      } else {
        toast.error(data.error || "Server error. Try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Sonner toaster */}
       <Toaster richColors theme="dark" position="top-right" />

      <div className="w-full min-h-screen flex justify-center">
        <div className="w-2/3 mt-20 h-full">
          <div className="skillxlogo w-max py-2 text-3xl font-semibold">
            Learning Requests
          </div>
          <div className="text-white mb-2">
            {requests.length} requests pending
          </div>

          <div className="w-full">
            {requests.length > 0 ? (
              requests.map((e) => (
                <TutorRequestCard
                  key={e.id}
                  {...e}
                  handleFetch={handleFetch}
                  loading={loading}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                No requests at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function TutorRequestCard(props: any) {
  const { id, handleFetch, loading } = props;
  return (
    <div className="w-full mt-3 bg-[#141016] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 text-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2">
            <h2 className="text-base font-semibold">
              {props.other?.name || "FriendName"}
            </h2>
            <p className="text-sm text-gray-400">
              {props.other?.bio || "Developer"}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-pink-400">
                {Array(props.other?.stars || 0)
                  .fill(1)
                  .map((_, i) => "★")}
              </span>
              <p className="text-xs text-gray-500">4.9 (127)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleFetch(id, "accept")}
            disabled={loading}
            className="bg-gradient-to-r from-[#ff4d8d] to-[#a855f7] text-xs px-4 py-1.5 rounded-lg font-extrabold cursor-pointer disabled:opacity-60"
          >
            Accept
          </button>
          <button
            onClick={() => handleFetch(id, "delete")}
            disabled={loading}
            className="border border-[#3b3b3b] px-4 py-1.5 cursor-pointer rounded-lg text-xs font-extrabold hover:border-red-400 transition-colors disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Wants to Learn */}
      <div>
        <p className="text-sm text-gray-400 mb-1">Wants to Learn</p>
        <div className="bg-[#1d1b20] px-4 py-2 rounded-lg text-sm font-medium">
          {props.skill || "Skills"}
        </div>
      </div>

      {/* Offering & Requested */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#1d1b20] px-4 py-2 rounded-lg text-sm">
          <p className="text-gray-400 text-xs">Offering</p>
          <p className="text-pink-400 font-semibold">
            {props.other?.Offering || "10"} pts
          </p>
        </div>
        <div className="flex-1 bg-[#1d1b20] px-4 py-2 rounded-lg text-sm">
          <p className="text-gray-400 text-xs">Requested</p>
          <p className="text-white font-medium">
            {props.other?.timeago || "Few moments ago"}
          </p>
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
