import React, { useEffect, useRef, useState } from "react";

const roleLabel = (r) =>
  ({
    tenant: "Tenant",
    superintendent: "Superintendent",
    management: "Management",
    landlord: "Landlord",
  }[r] || "");

// Liquid-glass chat thread. `myName` decides which bubbles align right.
const ChatWindow = ({ conversations = [], myName, onSend, disabled }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [conversations]);

  const send = async () => {
    const msg = text.trim();
    if (!msg) return;
    setSending(true);
    await onSend(msg);
    setText("");
    setSending(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="lux-chat">
      <div className="lux-chat-body" ref={bodyRef}>
        {conversations.length === 0 && (
          <p className="lux-muted" style={{ margin: "auto" }}>No messages yet.</p>
        )}
        {conversations.map((c, i) => {
          const mine = c.sender === myName;
          return (
            <div key={i} className={`lux-bubble ${mine ? "mine" : "theirs"}`}>
              <div className="meta">
                {c.sender}
                {c.senderRole ? ` · ${roleLabel(c.senderRole)}` : ""} ·{" "}
                {c.msgAt ? new Date(c.msgAt).toLocaleString() : ""}
              </div>
              {c.message}
            </div>
          );
        })}
      </div>

      {!disabled && (
        <div className="lux-chat-input">
          <textarea
            className="lux-textarea"
            rows={1}
            style={{ resize: "none" }}
            placeholder="Write a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="lux-btn" onClick={send} disabled={sending || !text.trim()}>
            {sending ? <span className="lux-spinner" /> : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
