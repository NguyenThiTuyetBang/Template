import { useState, useEffect, useRef } from "react";
import Banner from "./components/Banner";
import Header from "./components/Header";
import PromptBox from "./components/PromptBox";
// Styled
import "./App.css";

interface Message {
  id?: number;
  role: "user" | "ai";
  content: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat history
  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
        return err;
      });
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handlePromptSubmit = async (prompt: string) => {
    const userMsg: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
      } else {
        console.error("API error:", data.message);
        return data.message;
      }
    } catch (error) {
      console.error("Submission failed:", error);
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Banner />
      <Header />
      <main
        style={{
          padding: "20px",
          flex: 1,
          paddingBottom: "220px",
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className={`chat-message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="loader">Generative AI is typing...</div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>
      <PromptBox onSubmit={handlePromptSubmit} isLoading={isLoading} />
    </div>
  );
};
export default App;
