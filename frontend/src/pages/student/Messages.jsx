import { useEffect, useState } from "react";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.conversations();
    if (res.ok) {
      setConversations(res.data || []);
      setError("");
    } else setError(res.message || "Unable to load conversations.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openConversation = async (conversation) => {
    setActive(conversation);
    const [role, id] = conversation.key.split("-");
    const res = await studentApi.messages(role, id);
    if (res.ok) setMessages(res.data || []);
  };

  const send = async (event) => {
    event.preventDefault();
    if (!active || !body.trim()) return;
    const [receiverRole, receiverId] = active.key.split("-");
    const res = await studentApi.sendMessage({ receiverRole, receiverId, body });
    if (res.ok) {
      setBody("");
      openConversation(active);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Messages" description="Socket-ready conversation UI for student-teacher chat." />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card>
            <h2 className="mb-3 font-bold text-gray-950 dark:text-white">Conversations</h2>
            {conversations.length ? conversations.map((conversation) => (
              <button key={conversation.key} onClick={() => openConversation(conversation)} className="mb-2 w-full rounded-lg border border-gray-200 p-3 text-left text-sm dark:border-slate-800">
                <p className="font-semibold">{conversation.key}</p>
                <p className="truncate text-gray-500">{conversation.lastMessage?.body}</p>
              </button>
            )) : <EmptyState title="No conversations" description="Message a teacher from their profile." />}
          </Card>
          <Card className="lg:col-span-2">
            <h2 className="mb-3 font-bold text-gray-950 dark:text-white">Chat Window</h2>
            {active ? (
              <>
                <div className="mb-4 h-80 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
                  {messages.map((message) => (
                    <div key={message.id} className={`mb-3 max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.senderRole === "student" ? "ml-auto bg-blue-600 text-white" : "bg-white dark:bg-slate-900"}`}>
                      {message.body}
                    </div>
                  ))}
                </div>
                <form onSubmit={send} className="flex gap-2">
                  <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message" className="h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Send</button>
                </form>
              </>
            ) : <EmptyState title="Select a conversation" description="Choose a conversation to start chatting." />}
          </Card>
        </div>
      )}
    </div>
  );
}

export default Messages;
