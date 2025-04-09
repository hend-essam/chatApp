import { Stack, Button, Typography } from "@mui/material";
import Link from "next/link";

const Navbar = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ color: "#fff" }}
      component="nav"
    >
      <Link href="/" passHref style={{ textDecoration: "none" }}>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          CHATIFY
        </Typography>
      </Link>

      <Stack direction="row" spacing={2}>
        <Button
          component={Link}
          href="/login"
          variant="text"
          sx={{
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          Login
        </Button>
        <Button
          component={Link}
          href="/register"
          variant="contained"
          sx={{
            backgroundColor: "#9a885e",
            "&:hover": { backgroundColor: "#b89f6a" },
          }}
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
};

export default Navbar;
