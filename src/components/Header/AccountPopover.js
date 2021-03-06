import { useState } from "react";
import { Link as RouterLink } from "@reach/router";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
// routes

// hooks
import useIsMountedRef from "../../hooks/useIsMountedRef";

// components

import MenuPopover from "../MenuPopover";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    linkTo: "/",
  },
  {
    label: "Profile",
    linkTo: "",
  },
  {
    label: "Settings",
    linkTo: "/",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ handleLogout }) {
  const isMountedRef = useIsMountedRef();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <Avatar
        alt="Remy Sharp"
        src="https://res.cloudinary.com/minimal-ui/image/upload/v1614655910/upload_minimal/avatar/minimal_avatar.jpg"
        onClick={handleOpen}
      >
        Avatar
      </Avatar>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            UserName
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            User Email
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={() => handleLogout()} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
