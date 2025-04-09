import { Stack, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

const sections = [
  { title: "Profile", items: ["Settings", "Chat", "Business"] },
  { title: "Notifications", items: ["Contacts", "Feature"] },
  { title: "Recent", items: ["Customize", "Job", "Latest"] },
  {
    title: "Personalization",
    items: ["Stay Connected", "Knowledge Base", "Customer"],
  },
  { title: "Chat", items: ["Chat", "Feedback", "Contact"] },
];

const Footer = () => {
  return (
    <Grid
      container
      spacing={6}
      gap={5}
      component="footer"
      py="24px"
      p={{ xs: "24px", md: "64px" }}
    >
      <Grid size={5}>
        <Stack direction="column" gap={3}>
          <Stack direction="column" gap="3px">
            <Typography variant="h5">CHATIFY</Typography>
            <Typography variant="subtitle1" color="gray">
              Effortless chat tool for modern communication.
            </Typography>
          </Stack>
          <Stack gap="3px">
            <Typography variant="subtitle1">User Account Option</Typography>
            <Stack direction="row" gap={2} color="#5E5848">
              <Link href="/messages" underline="none" color="inherit">
                <MarkunreadIcon />
              </Link>
              <Link href="/notifications" underline="none" color="inherit">
                <NotificationsIcon />
              </Link>
              <Link href="/settings" underline="none" color="inherit">
                <SettingsIcon />
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Grid>

      {sections.map((section, index) => (
        <Grid key={index} size="auto">
          <Stack direction="column" gap={1}>
            <Typography variant="h6">{section.title}</Typography>
            <Stack direction="column" gap="3px" color="gray">
              {section.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  underline="none"
                  color="inherit"
                  title={item}
                  sx={{
                    display: "inline-block",
                    "&:hover": {
                      color: "#b89f6a",
                    },
                  }}
                >
                  <Typography variant="subtitle1">{item}</Typography>
                </Link>
              ))}
            </Stack>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default Footer;
