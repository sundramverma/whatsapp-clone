import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);

  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessageFlag, setNewMessageFlag] = useState(false);

  const socket = useRef(null);

  // 🔥 socket sirf yahin banao
  useEffect(() => {
    socket.current = io("ws://localhost:9000", {
      autoConnect: false,
      transports: ["websocket"],
    });
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        showloginButton,
        setShowloginButton,
        showlogoutButton,
        setShowlogoutButton,
        socket,
        activeUsers,
        setActiveUsers,
        newMessageFlag,
        setNewMessageFlag,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
