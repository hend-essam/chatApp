import Navbar from "../components/layout/Navbar";
import { Stack, Button, Typography, Box, Container } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";

const Home = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Navbar />
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ backgroundColor: "#fff", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={6}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#1976d2",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Connect with ease and chat
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, color: "#666", lineHeight: 1.6 }}
              >
                Real-time messaging for efficient communication. Stay connected
                with your team and friends.
              </Typography>
              <Link
                href="/register"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#1976d2",
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "100%" },
                }}
              >
                <img
                  src="/assets/chatify.png"
                  alt="Chat illustration"
                  style={{
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "16px",
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: "center",
              color: "#333",
            }}
          >
            Why Choose Our Chat App?
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {[
              {
                icon: <SpeedIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
                title: "Lightning Fast",
                description: "Real-time messaging with instant delivery",
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
                title: "Secure & Private",
                description: "Your conversations are encrypted and safe",
              },
              {
                icon: <GroupIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
                title: "Connect Anyone",
                description: "Chat with friends, family, and colleagues",
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  p: 4,
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #e0e0e0",
                  textAlign: "center",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#1976d2" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", color: "#fff" }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 64, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h5"
              sx={{ mb: 3, fontStyle: "italic", lineHeight: 1.6 }}
            >
              "Experience the power of instant messaging. Stay connected, share
              moments, and communicate effortlessly."
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Image
                src="/assets/girl.png"
                width={50}
                height={50}
                alt="Hend Essam"
                style={{ borderRadius: "50%" }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Hend Essam
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Product Designer
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{ py: 4, backgroundColor: "#fff", borderTop: "1px solid #e0e0e0" }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2024 Chatify. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
