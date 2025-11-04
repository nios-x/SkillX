"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Mic, Paperclip, Voicemail, VoicemailIcon } from "lucide-react";

type Msg = { text: string; sent: boolean };
type ChatMap = Record<string, Msg[]>;

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState("Milli 🤖");
  const [contacts, setContacts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMap>({
    "Milli 🤖": [
      { text: "Hey! I'm Milli, your AI assistant 🤖. How can I help you today?", sent: false },
    ],
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const {userdata} = useAppContext()
  const receiverId:any = searchParams.get("id");
  
  // 🔹 Scroll always to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory]);

  useEffect(() => { 
    const fetchContacts = async () => {
      const res = await fetch(`/api/messages/contacts?userId=${userdata.id}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    };
    fetchContacts();
});

useEffect(() => {
  if (!receiverId || !userdata?.id) return;

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/get?senderId=${userdata.id}&receiverId=${receiverId}`);
    const data = await res.json();
    const msgs: Msg[] = data.messages.map((m: any) => ({
      text: m.content,
      sent: m.senderId === userdata.id,
    }));
    setChatHistory({ [receiverId]: msgs });
    setSelectedChat(receiverId);
  };

  fetchMessages();
}, [userdata?.id, receiverId]);


  // 🔹 Send message (AI or User)
  const sendMessage = async () => {
    if (!input.trim()) return;
    const chatKey = receiverId || "Milli 🤖";
    const newMsg = { text: input, sent: true };

    setChatHistory((prev) => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), newMsg],
    }));

    const messageText = input;
    setInput("");

    if (receiverId) {
      // Send to user
      await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userdata.id,
          receiverId,
          content: messageText,
        }),
      });
    } else {
      setChatHistory((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), { text: "Thinking...", sent: false }],
      }));

      try {
        const res = await fetch("/api/gemeniapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: messageText }),
        });
        const data = await res.json();
        const aiText = data.text || "No response.";
        setChatHistory((prev) => {
          const arr = [...(prev[chatKey] || [])];
          arr[arr.length - 1] = { text: aiText, sent: false };
          return { ...prev, [chatKey]: arr };
        });
      } catch {
        setChatHistory((prev) => ({
          ...prev,
          [chatKey]: [...(prev[chatKey] || []), { text: "Error getting response.", sent: false }],
        }));
      }
    }
  };

  return (
    <div className="h-[94vh] mt-15 w-full flex bg-black text-white">
      {/* Sidebar Contacts */}
      <div className="w-1/4 border-r border-gray-700 p-4">
        <div className="text-lg font-semibold text-pink-400 mb-3">Chats</div>
        <div
          onClick={() => setSelectedChat("Milli 🤖")}
          
          className={`p-2 rounded cursor-pointer ${
            selectedChat === "Milli 🤖" ? "bg-[#1e1e1e]" : "hover:bg-[#1e1e1e]"
          }`}
        >
          Milli (Your AI Assistant) 🤖
        </div>
        {contacts.map((user) => (
          <a
            key={user.id}
            href={`/messages?id=${user.id}`}
            className={`block p-2 rounded mt-2 ${
              receiverId === user.id ? "bg-[#1e1e1e]" : "hover:bg-[#1e1e1e]"
            }`}
          >
            {user.name}
          </a>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 text-pink-400 font-semibold">
          {receiverId ? `Chat with ${receiverId}` : selectedChat}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#0f0f0f]">
          {(chatHistory[receiverId || selectedChat] || []).map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] p-2 rounded-lg ${
                msg.sent
                  ? "self-end bg-gradient-to-r from-pink-500 to-purple-600"
                  : "self-start bg-[#1e1e1e]"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="p-4 flex relative gap-3 border-t border-gray-700 bg-[#111]">
          <div className="absolute right-30 flex gap-4   top-1/3"><Paperclip/> <Mic/> </div>
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-[#1b1b1b] rounded p-2 px-3 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
