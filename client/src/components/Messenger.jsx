import { useContext, useEffect } from "react";
import { AppBar, Toolbar, styled, Box } from "@mui/material";

import { AccountContext } from "../context/AccountProvider";

// components
import ChatDialog from "./chat/ChatDialog";
import LoginDialog from "./account/LoginDialog";

const Component = styled(Box)`
  height: 100vh;
  background: #dcdcdc;
`;

const Header = styled(AppBar)`
  background-color: #00a884;
  height: 125px;
  box-shadow: none;
`;

const LoginHeader = styled(AppBar)`
  background: #00bfa5;
  height: 200px;
  box-shadow: none;
`;

const Messenger = () => {
  const { account, socket, setActiveUsers } = useContext(AccountContext);

  useEffect(() => {
    if (!account?.sub) return;

    // ✅ connect socket
    socket.current.connect();

    socket.current.on("connect", () => {
      console.log("✅ Socket connected:", socket.current.id);

      // ✅ add user ONLY HERE
      socket.current.emit("addUser", account);
    });

    socket.current.on("getUsers", (users) => {
      console.log("🟢 Active users:", users);
      setActiveUsers(users);
    });

    socket.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setActiveUsers([]);
    });

    return () => {
      socket.current.off("getUsers");
      socket.current.disconnect();
    };
  }, [account, setActiveUsers, socket]);

  return (
    <Component>
      {account ? (
        <>
          <Header>
            <Toolbar />
          </Header>
          <ChatDialog />
        </>
      ) : (
        <>
          <LoginHeader>
            <Toolbar />
          </LoginHeader>
          <LoginDialog />
        </>
      )}
    </Component>
  );
};

export default Messenger;
