import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api-wov6.onrender.com";

const QUICK_QUESTIONS = [
  "Quels sont vos tarifs ?",
  "Comment ca marche ?",
  "Quel service pour mon besoin ?",
  "Donnez-moi le WhatsApp",
];

function getSessionId() {
  if (typeof window === "undefined") {
    return "session_server";
  }
  const key = "assistant_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }
  const generated = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("session_server");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour. Je suis votre assistant. Je reponds uniquement aux questions sur nos services. Comment puis-je vous aider ?",
    },
  ]);

  const messagesRef = useRef(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async (rawText) => {
    const text = String(rawText || "").trim();
    if (!text) {
      return;
    }

    setLoading(true);
    setMessages((current) => [...current, { role: "user", text }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
        }),
      });
      const result = await response.json().catch(() => ({}));
      const reply =
        result.reply ||
        "Merci pour votre message. Je peux vous aider uniquement sur nos services. WhatsApp: +22892092572";
      setMessages((current) => [...current, { role: "bot", text: reply }]);
    } catch (_error) {
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: "Desole, une erreur temporaire est survenue. Veuillez reessayer. WhatsApp: +22892092572",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  return (
    <>
      <button
        className="assistant-fab"
        type="button"
        aria-label={open ? "Fermer le chat d assistance" : "Ouvrir le chat d assistance"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M7 10h10M7 14h6M20 12c0 4.418-3.582 8-8 8a8.97 8.97 0 0 1-3.32-.63L4 20l.66-4.23A7.98 7.98 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <aside className="assistant-panel" aria-label="Assistant service client">
          <div className="assistant-head">
            <strong>Assistant services</strong>
            <button type="button" className="btn btn-light" onClick={() => setOpen(false)}>
              Fermer
            </button>
          </div>

          <div className="assistant-quick">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="pill-link"
                onClick={() => {
                  setInput("");
                  sendMessage(question);
                }}
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </div>

          <div ref={messagesRef} className="assistant-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`assistant-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="assistant-form" onSubmit={onSubmit}>
            <input
              className="input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Posez votre question sur nos services"
            />
            <button className="btn btn-primary" type="submit" disabled={!canSend}>
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
