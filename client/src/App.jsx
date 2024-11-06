import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:4000");

export default function App() {
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const message = formData.get("message");

    socket.emit("new-message", message);

    event.target.reset();
  };

  // saber cuando se conecta el cliente
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("new-message", (listMessages) => {
      setMessages(listMessages);
    });

    socket.on("get-messages", (listMessages) => {
      setMessages(listMessages);
    });

    return () => {
      socket.off("get-messages");
      socket.off("new-message");
    };
  }, []);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
