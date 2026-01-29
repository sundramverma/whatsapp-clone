import { useContext } from "react";

import {
  Dialog,
  Typography,
  List,
  ListItem,
  Box,
  styled,
} from "@mui/material";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { addUser } from "../../service/api";
import { AccountContext } from "../../context/AccountProvider";
import { qrCodeImage } from "../../constants/data";

const Component = styled(Box)`
  display: flex;
`;

const Container = styled(Box)`
  padding: 56px 0 56px 56px;
`;

const QRCode = styled("img")({
  margin: "50px 0 0 50px",
  height: 264,
  width: 264,
});

const Title = styled(Typography)`
  font-size: 26px;
  margin-bottom: 25px;
  color: #525252;
  font-weight: 300;
`;

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 15px;
    font-size: 18px;
    line-height: 28px;
    color: #4a4a4a;
  }
`;

const dialogStyle = {
  marginTop: "12%",
  height: "95%",
  width: "60%",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 0,
  boxShadow: "none",
  overflow: "hidden",
};

const LoginDialog = () => {
  const {
    setAccount,
    showloginButton,
    setShowloginButton,
    setShowlogoutButton,
  } = useContext(AccountContext);

  // ✅ FINAL FIX HERE
  const onLoginSuccess = async (res) => {
    const decoded = jwtDecode(res.credential);

    // 🔥 normalize user object
    const user = {
      sub: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture:
        decoded.picture ||
        decoded.avatar ||
        decoded.pictureUrl ||
        null,
    };

    setAccount(user);
    setShowloginButton(false);
    setShowlogoutButton(true);

    await addUser(user);
  };

  const onLoginFailure = (error) => {
    console.log("❌ Login Failed:", error);
  };

  return (
    <Dialog
      open={true}
      BackdropProps={{ style: { backgroundColor: "unset" } }}
      maxWidth="md"
      PaperProps={{ sx: dialogStyle }}
    >
      <Component>
        <Container>
          <Title>To use WhatsApp on your computer:</Title>
          <StyledList>
            <ListItem>1. Open WhatsApp on your phone</ListItem>
            <ListItem>
              2. Tap Menu Settings and select WhatsApp Web
            </ListItem>
            <ListItem>
              3. Point your phone to this screen to capture the code
            </ListItem>
          </StyledList>
        </Container>

        <Box style={{ position: "relative" }}>
          <QRCode src={qrCodeImage} alt="QR Code" />
          <Box
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateX(25%) translateY(-25%)",
            }}
          >
            {showloginButton && (
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onError={onLoginFailure}
              />
            )}
          </Box>
        </Box>
      </Component>
    </Dialog>
  );
};

export default LoginDialog;
