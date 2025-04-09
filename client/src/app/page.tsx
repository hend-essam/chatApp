import Navbar from "../components/layout/Navbar";
import { Stack, Button, Typography, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <Box component="main">
      <Stack
        direction="column"
        gap="65px"
        bgcolor="black"
        py="24px"
        px={{ xs: "24px", md: "64px" }}
        sx={{ minHeight: "75vh" }}
      >
        <Navbar />

        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
          justifyContent="space-evenly"
          spacing={4}
          gap="40px"
          sx={{ color: "#fff" }}
        >
          <Box sx={{ maxWidth: { md: "50%" } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                width: { xs: "100%", md: "80%", lg: "60%" },
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Connect with ease and chat
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>
              Real time messaging for efficient communication
            </Typography>
            <Link href="/register" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#9a885e",
                  width: "fit-content",
                  borderRadius: "30px",
                  color: "black",
                  px: 4,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#b89f6a" },
                }}
              >
                Get Started
              </Button>
            </Link>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: "450px" },
              height: { xs: "250px", md: "300px" },
              display: "contents",
            }}
          >
            <Box
              sx={{
                height: { xs: 200, md: 300 },
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src="/assets/cat.png"
                alt="Cat"
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "20px -20px 0px 0px #9a885e8f",
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>

      <Stack bgcolor="#b89f6a" p="40px" gap="15px">
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Experience the power of instant messaging with chatify.
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="6px"
        >
          <Image
            src="/assets/girl.png"
            width={50}
            height={50}
            alt="Hend Essam"
          />
          <Typography variant="subtitle1" component="cite">
            Hend Essam
          </Typography>
        </Stack>
      </Stack>

      <Footer />
    </Box>
  );
};

export default Home;
