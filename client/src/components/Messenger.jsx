import { useContext, useEffect } from 'react';
import { AppBar, Toolbar, styled, Box } from '@mui/material';

import { AccountContext } from '../context/AccountProvider';
import socket from '../socket';

// components
import ChatDialog from './chat/ChatDialog';
import LoginDialog from './account/LoginDialog';

const Component = styled(Box)`
    height: 100vh;
    background: #DCDCDC;
`;

const Header = styled(AppBar)`
    background-color: #00A884;
    height: 125px;
    box-shadow: none;
`;

const LoginHeader = styled(AppBar)`
    background: #00bfa5;
    height: 200px;
    box-shadow: none;
`;

const Messenger = () => {
    const { account } = useContext(AccountContext);

    // ---------- SOCKET CONNECTION ----------
    useEffect(() => {
        if (account) {
            socket.emit("addUser", account);
        }

        socket.on("getMessage", (data) => {
            console.log("📩 Real-time message:", data);
            // yahan baad me messages state me add karenge
        });

        return () => {
            socket.off("getMessage");
        };
    }, [account]);

    return (
        <Component>
            {
                account ? 
                <>
                    <Header>
                        <Toolbar></Toolbar>
                    </Header>
                    <ChatDialog />
                </>
                :
                <>
                    <LoginHeader>
                        <Toolbar></Toolbar>
                    </LoginHeader>
                    <LoginDialog />
                </>
            }
        </Component>
    );
};

export default Messenger;
