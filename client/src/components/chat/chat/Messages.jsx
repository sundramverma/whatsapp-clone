import { useState, useEffect, useContext, useRef } from "react";
import { Box, styled } from "@mui/material";

import { getMessages, newMessages } from "../../../service/api";
import { AccountContext } from "../../../context/AccountProvider";

// components
import Message from "./Message";
import Footer from "./Footer";

/* ===== STYLES (SAME AS OLD) ===== */

const Wrapper = styled(Box)`
  background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-size: 50%;
`;

const Component = styled(Box)`
  height: 80vh;
  overflow-y: scroll;
`;

const Container = styled(Box)`
  padding: 1px 80px;
`;

/* ===== MAIN COMPONENT ===== */

const Messages = ({ person, conversation }) => {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  const scrollRef = useRef();

  const { account, socket, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  /* ===== SOCKET LISTENER ===== */
  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    });
  }, []);

  /* ===== FETCH MESSAGES ===== */
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(conversation?._id);
      setMessages(data);
    };
    fetchMessages();
  }, [conversation?._id, person?._id, newMessageFlag]);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===== REALTIME INCOMING MESSAGE ===== */
  useEffect(() => {
    incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage, conversation]);

  const receiverId = conversation?.members?.find(
    (member) => member !== account.sub
  );

  /* ===== SEND TEXT / FILE ===== */
  const sendText = async (e) => {
    let code = e.keyCode || e.which;
    if (!value && !file) return;

    if (code === 13) {
      let message = {};

      if (!file) {
        message = {
          senderId: account.sub,
          receiverId,
          conversationId: conversation._id,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          receiverId,
          conversationId: conversation._id,
          type: "file",
          text: image, // 🔥 image = URL string
        };
      }

      socket.current.emit("sendMessage", message);
      await newMessages(message);

      setValue("");
      setFile(null);
      setImage("");
      setNewMessageFlag((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      <Component>
        {messages &&
          messages.map((message) => (
            <Container ref={scrollRef} key={message._id}>
              <Message message={message} />
            </Container>
          ))}
      </Component>

      <Footer
        sendText={sendText}
        value={value}
        setValue={setValue}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Messages;
