"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { useAppContext } from "@/context/AppContext";
import Canvas from "@/components/Canvas";

const SocketContext = createContext<any>(null);
export function SocketProvider({ children }: { children: ReactNode }) {
  const [remoteUser, setRemoteUser] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [socketMessages, setSocketMessages] = useState<any[]>([]);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState<RTCIceCandidate[]>([]);
  const [toremove, setToRemove ] = useState(null);
  const { userdata } = useAppContext(); // ✅ from AppContext (you already fetch user info)
  const remoteUserRef = useRef<string | null>(null);

  const [full, setFull] = useState(false)


  useEffect(() => {
    remoteUserRef.current = remoteUser;
  }, [remoteUser]);

  // ✅ Initialize WebSocket and PeerConnection when user is available
  useEffect(() => {
    if (!userdata?.id) return;

    const ws = new WebSocket("wss://signalling-server-ztzs.onrender.com");
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.services.mozilla.com" },
        {
          urls: "turn:relay.metered.ca:80",
          username: "openai",
          credential: "openai123",
        },
        {
          urls: "turn:relay.metered.ca:443",
          username: "openai",
          credential: "openai123",
        },
        {
          urls: "turn:relay.metered.ca:443?transport=tcp",
          username: "openai",
          credential: "openai123",
        },
      ],
    });

    setPeerConnection(pc);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "register", userID: userdata.id }));
      console.log("✅ WebSocket connected for", userdata.id);
    };

    ws.onclose = () => console.log("❌ WebSocket disconnected");
    setSocket(ws);

    pc.onicecandidate = (event) => {
      if (event.candidate && remoteUserRef.current) {
        ws.send(
          JSON.stringify({
            type: "ice_candidate",
            candidate: event.candidate,
            targetUserID: remoteUserRef.current,
            userID: userdata.id,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      console.log("🎥 Remote track received");
      const [remoteStreamObj] = event.streams;
      setRemoteStream(remoteStreamObj);
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Message received:", message);

      if (message.type === "forewarded_message") {
        console.log(message)
        setSocketMessages((prev) => [...prev, message]);
      } else if (message.type === "incoming_call") {
        setRemoteUser(message.fromUserID);
        const askuser = confirm(`Incoming call from ${message.fromUserID}. Accept?`);

        if (askuser) {
          await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(stream);
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(
            JSON.stringify({
              type: "answer",
              targetUserID: message.fromUserID,
              userID: userdata.id,
              answer,
            })
          );
        }
      } else if (message.type === "call_answered") {
        await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
      } else if (message.type === "ice_candidate") {
        const candidate = new RTCIceCandidate(message.candidate);
        if (pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          setIceCandidatesQueue((prev) => [...prev, candidate]);
        }
      }
    };

    return () => {
      ws.close();
      pc.close();
      setSocket(null);
      setPeerConnection(null);
    };
  }, [userdata?.id]);

  // ✅ Process queued ICE after remote description
  useEffect(() => {
    if (peerConnection?.remoteDescription && iceCandidatesQueue.length > 0) {
      iceCandidatesQueue.forEach((candidate) =>
        peerConnection.addIceCandidate(candidate).catch(console.error)
      );
      setIceCandidatesQueue([]);
    }
  }, [peerConnection?.remoteDescription, iceCandidatesQueue]);

  const createCall = async (targetUserID: string) => {
    if (!peerConnection || !socket) return console.error("Missing connection");

    setRemoteUser(targetUserID);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        type: "call",
        targetUserID,
        userID: userdata.id,
        offer,
      })
    );
  };

  const send_message = (targetUserID: string, content: string) => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        targetUserID,
        fromUserID: userdata.id,
        content,
        type: "foreward_message",
      })
    );
  };
  
  if(remoteStream ) return (
    <SocketContext.Provider
      value={{
        createCall,
        send_message,
        remoteUser,
        socketMessages,
        localStream,
        remoteStream,
      }}
    >
      <Canvas toremove={toremove} setFull={setFull} full={full}/>
      {/* ✅ Show video elements when call is active */}
      {(localStream || remoteStream ) && (
        <div className="fixed bottom-4 right-4 z-50">
             {/*@ts-ignore */}
          {remoteStream && ( <video className={`rounded-xl ${full?"w-[320px] h-[240px]":"w-screen h-screen"}`} autoPlay playsInline ref={(el) => el && (el.srcObject = remoteStream)}/>
          )}
        </div>
      )}
    </SocketContext.Provider>
  );



  return <SocketContext.Provider
      value={{
        remoteUser,
        setToRemove,
        createCall,
        send_message,
        socketMessages,
        setSocketMessages,
        localStream,
        remoteStream,
      }}
    >{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);
