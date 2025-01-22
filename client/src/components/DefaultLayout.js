import React, { useState, useEffect } from "react";
import { Box, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import {
  Home as HomeIcon,
  Book as BookIcon,
  AccountBox as AccountBoxIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  DirectionsBus as DirectionsBusIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

function DefaultLayout({ children }) {
  const [menu, setMenu] = useState(
    () => JSON.parse(localStorage.getItem("menuState")) || false
  );
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("menuState", JSON.stringify(menu));
  }, [menu]);

  const toggleMenu = () => setMenu((prevMenu) => !prevMenu);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userMenu = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Booking", icon: <BookIcon />, path: "/bookings" },
    { name: "Profile", icon: <AccountBoxIcon />, path: "/profile" },
  ];

  const adminMenu = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Buses", icon: <DirectionsBusIcon />, path: "/admin/buses" },
    { name: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { name: "Booking", icon: <BookIcon />, path: "/admin/bookings" },
    { name: "Profile", icon: <AccountBoxIcon />, path: "/admin/profile" },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        transition: "0.3s",
      }}
    >
      <Box
        sx={{
          width: menu ? "250px" : "170px",
          background: "linear-gradient(to bottom, #3a47d5, #567af0)",
          transition: "0.3s",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Box>
          <Box
            sx={{
              padding: "20px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              whiteSpace: "nowrap",
            }}
          >
            VOUGHT BUS
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "20px 10px",
              gap: "10px",
              background: "black",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
              color: "#fff",
              width: menu ? "85%" : "80%",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ffcc33",
                mb: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: "30px", color: "#ffffff", ml: 2 }} />
              {user?.name || "Guest"}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "16px",
                fontWeight: "500",
                ml: 2,
                color: user?.isAdmin ? "#ffcc33" : "#33c9ff",
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                Role :
              </span>
              {user?.isAdmin ? "Admin" : "User"}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
            }}
          >
            {menuToBeRendered.map((item, index) => (
              <Box
                key={index}
                onClick={item.action || null}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#ffffff33",
                  },
                }}
              >
                <Link
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Box sx={{ fontSize: "20px" }}>{item.icon}</Box>
                  {menu && <Box>{item.name}</Box>}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ padding: "10px", textAlign: "center", fontSize: "12px" }}>
          © 2025 Vought Bus
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            background: "white",
            borderRadius: "5px",
            padding: "10px 20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Box onClick={toggleMenu} sx={{ cursor: "pointer" }}>
            {menu ? (
              <CloseIcon sx={{ fontSize: "30px" }} />
            ) : (
              <MenuIcon sx={{ fontSize: "30px" }} />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                alt={user?.name || "Guest"}
                src={user?.profilePicture || undefined}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: user?.profilePicture
                    ? "transparent"
                    : user?.avatarColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                }}
              >
                {!user?.profilePicture && user?.avatarInitial}
              </Avatar>
              <Box>Welcome, {user?.name || "Guest"}</Box>
            </Box>
            <Box
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                color: "#3a47d5",
                "&:hover": { color: "#567af0" },
              }}
            >
              <LogoutIcon sx={{ fontSize: "20px" }} />
              Logout
            </Box>
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
