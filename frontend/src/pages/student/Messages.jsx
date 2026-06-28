/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { messagesApi } from "../../services/apiService";
import { getToken } from "../../services/authService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";
import { getImageUrl } from "../../utils/getImageUrl";
import { FiPhone, FiVideo } from "react-icons/fi";

function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("");
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const activeRef = useRef(null);
  const autoOpenedRef = useRef("");

  const loadConversations = async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await messagesApi.conversations(user.id);
    if (res.ok) {
      setConversations(res.data || []);
      setError("");
    } else {
      setError(res.message || "Unable to load conversations.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  useEffect(() => {
    const targetId = location.state?.openConversationId;
    if (!targetId || autoOpenedRef.current === targetId || !conversations.length) return;

    const target = conversations.find(
      (conversation) => (conversation.conversationId || conversation.key || conversation.id) === targetId
    );

    if (target) {
      autoOpenedRef.current = targetId;
      openConversation(target);
    }
  }, [location.state, conversations]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const token = getToken();
    if (!token || !user?.id) return undefined;

    const socket = io("http://localhost:5000", { auth: { token } });
    socketRef.current = socket;

    socket.on("direct_message", (message) => {
      const current = activeRef.current;
      const currentId = current?.conversationId || current?.key || current?.id;
      const incomingId = `${message.senderRole}-${message.senderId}`;
      if (currentId === incomingId) {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
      loadConversations();
    });

    socket.on("incoming_call", (payload) => {
      setIncomingCall(payload);
      setCallStatus(`${payload.callType === "video" ? "Video" : "Voice"} call incoming`);
    });

    socket.on("call_accept", () => setCallStatus("Call accepted. Connecting..."));
    socket.on("call_reject", () => setCallStatus("Call rejected."));
    socket.on("call_end", () => {
      setIncomingCall(null);
      setCallStatus("Call ended.");
    });

    return () => socket.disconnect();
  }, [user?.id]);

  const openConversation = async (conversation) => {
    setActive(conversation);
    setMessagesLoading(true);
    const conversationId = conversation.conversationId || conversation.key || conversation.id;
    const res = await messagesApi.getConversation(conversationId);
    if (res.ok) {
      setMessages(res.data || []);
      await loadConversations();
    }
    setMessagesLoading(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const send = async (event) => {
    event.preventDefault();
    if (!active || !body.trim()) return;

    const conversationId = active.conversationId || active.key || active.id;
    const [receiverRole, receiverId] = conversationId.split("-");

    setSending(true);
    const res = await messagesApi.send({
      receiverRole,
      receiverId: Number(receiverId),
      body,
    });

    if (res.ok) {
      setBody("");
      await openConversation(active);
    }
    setSending(false);
  };

  const getActiveParticipant = () => {
    const conversationId = active?.conversationId || active?.key || active?.id || "";
    const [receiverRole, receiverId] = conversationId.split("-");
    if (!receiverRole || !receiverId) return null;
    return { receiverRole, receiverId: Number(receiverId) };
  };

  const startCall = (callType) => {
    const participant = getActiveParticipant();
    if (!participant) return;
    socketRef.current?.emit("call_invite", { ...participant, callType });
    setCallStatus(`${callType === "video" ? "Video" : "Voice"} call ringing...`);
  };

  const answerCall = (accepted) => {
    if (!incomingCall) return;
    socketRef.current?.emit(accepted ? "call_accept" : "call_reject", {
      receiverRole: incomingCall.callerRole,
      receiverId: incomingCall.callerId,
    });
    setCallStatus(accepted ? "Call accepted. Connecting..." : "Call rejected.");
    if (!accepted) setIncomingCall(null);
  };

  return (
    <PageContainer className="animate-fade-in space-y-5">
      <PageHeader
        title="Messages"
        description="Chat with tutors and students. Real-time updates ready via socket.io."
      />

      {loading ? (
        <LoadingState label="Loading conversations..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadConversations} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card>
            <h2 className="mb-3 font-bold text-gray-950 dark:text-white">Conversations</h2>
            {conversations.length ? (
              conversations.map((conversation) => {
                const conversationId =
                  conversation.conversationId || conversation.key || conversation.id;
                const isActive =
                  (active?.conversationId || active?.key || active?.id) === conversationId;

                return (
                  <button
                    key={conversationId}
                    type="button"
                    onClick={() => openConversation(conversation)}
                    className={`mb-2 w-full rounded-lg border p-3 text-left text-sm transition ${
                      isActive
                        ? "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30"
                        : "border-gray-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-bold text-white">
                          {getImageUrl(conversation.participant?.profileImage) ? (
                            <img
                              src={getImageUrl(conversation.participant.profileImage)}
                              alt={conversation.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (conversation.name || conversation.participant?.name || "U").charAt(0)
                          )}
                        </div>
                        <p className="truncate font-semibold text-gray-950 dark:text-white">
                          {conversation.name || conversation.participant?.name || conversationId}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-gray-500">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                  </button>
                );
              })
            ) : (
              <EmptyState
                title="No conversations"
                description="Message a teacher from their profile to start chatting."
              />
            )}
          </Card>

          <Card className="flex min-h-[32rem] flex-col lg:col-span-2">
            <h2 className="mb-3 font-bold text-gray-950 dark:text-white">
              {active?.name || active?.participant?.name || "Chat Window"}
            </h2>
            {active && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800">
                <div className="text-sm text-gray-500">
                  {callStatus || "Ready for messages and calls"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startCall("voice")}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700"
                  >
                    <FiPhone /> Voice
                  </button>
                  <button
                    type="button"
                    onClick={() => startCall("video")}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700"
                  >
                    <FiVideo /> Video
                  </button>
                </div>
              </div>
            )}
            {incomingCall && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
                <span>
                  Incoming {incomingCall.callType} call from {incomingCall.callerRole}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => answerCall(true)} className="rounded-lg bg-green-600 px-3 py-1.5 font-semibold text-white">
                    Accept
                  </button>
                  <button type="button" onClick={() => answerCall(false)} className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white">
                    Reject
                  </button>
                </div>
              </div>
            )}

            {active ? (
              <>
                <div className="mb-4 flex-1 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
                  {messagesLoading ? (
                    <LoadingState label="Loading messages..." />
                  ) : messages.length ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.senderId === user?.id && message.senderRole === user?.role
                            ? "ml-auto bg-blue-600 text-white"
                            : "bg-white text-gray-900 dark:bg-slate-900 dark:text-white"
                        }`}
                      >
                        <p>{message.body}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No messages yet"
                      description="Send the first message to start the conversation."
                    />
                  )}
                  <div ref={scrollRef} />
                </div>

                <form onSubmit={send} className="flex gap-2">
                  <input
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Type a message"
                    className="h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the left panel to start chatting."
              />
            )}
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

export default Messages;
