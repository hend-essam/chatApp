import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import AuthHeader from "../auth/AuthHeader";
import { Padding } from "@mui/icons-material";

const Sidebar = () => {
  return (
    <Stack
      sx={{
        padding: "20px 32px",
        borderTopRightRadius: "50px",
        borderBottomRightRadius: "50px",
        backgroundColor: "beige",
      }}
    >
      <AuthHeader withLine={false} link={"/main"} />
      <Stack
        justifyContent="space-between"
        height="100%"
        sx={{ padding: "5px 8px" }}
      >
        <Stack>
          <Link href="/main/chat">
            <Typography variant="h6">Chat</Typography>
          </Link>
          <Link href="/main/settings">
            <Typography variant="h6">Settings</Typography>
          </Link>
        </Stack>
        <Button>Logout</Button>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
