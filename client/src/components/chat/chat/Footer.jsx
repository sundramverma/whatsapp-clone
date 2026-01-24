import { EmojiEmotions, AttachFile, Mic } from "@mui/icons-material";
import { Box, styled, InputBase } from "@mui/material";
import { uploadFile } from "../../../service/api";

/* ===== UI (SAME AS OLD) ===== */

const Container = styled(Box)`
  height: 55px;
  background: #ededed;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;

  & > * {
    margin: 5px;
    color: #919191;
  }
`;

const Search = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(94% - 100px);   /* 🔥 OLD UI WIDTH */
`;

const InputField = styled(InputBase)`
  width: 100%;
  padding: 20px;
  padding-left: 25px;
  font-size: 14px;
  height: 20px;
`;

const ClipIcon = styled(AttachFile)`
  transform: rotate(40deg);
  cursor: pointer;
`;

/* ===== LOGIC (NEW & WORKING) ===== */

const Footer = ({ sendText, value, setValue, setFile, setImage }) => {

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // input field me filename dikhane ke liye
    setValue(selectedFile.name);
    setFile(selectedFile);

    // file upload
    const data = new FormData();
    data.append("file", selectedFile);

    const response = await uploadFile(data);

    // 🔥 backend se sirf URL aata hai
    setImage(response.data);
  };

  return (
    <Container>
      <EmojiEmotions />

      <label htmlFor="fileInput">
        <ClipIcon />
      </label>

      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <Search>
        <InputField
          placeholder="Type a message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={sendText}
        />
      </Search>

      <Mic />
    </Container>
  );
};

export default Footer;
