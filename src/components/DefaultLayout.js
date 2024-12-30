import React, { useState } from "react";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import {
  Home as HomeIcon,
  Book as BookIcon,
  AccountBox as AccountBoxIcon,
  Logout as LogoutIcon,
  DirectionsBus as DirectionsBusIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

function DefaultLayout({ children }) {
  const [menu, setMenu] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const toggleMenu = () => setMenu((prevMenu) => !prevMenu);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      navigate("/login"); 
    } else {
      alert("You are not logged in!");
    }
  };

  const userMenu = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Booking", icon: <BookIcon />, path: "/" },
    { name: "Profile", icon: <AccountBoxIcon />, path: "/" },
    { name: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  const adminMenu = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Buses", icon: <DirectionsBusIcon />, path: "/admin/buses" },
    { name: "Users", icon: <AccountBoxIcon />, path: "/admin/users" },
    { name: "Booking", icon: <BookIcon />, path: "/admin/booking" },
    { name: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { md: menu ? "280px auto" : "200px auto", xs: "100%" },
        height: "100vh",
        transition: "grid-template-columns 0.3s ease",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(to bottom, rgba(65, 105, 225, 0.84), rgba(72, 118, 255, 0.92), rgba(70, 130, 255, 1))",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "15px",
            padding: "20px",
            color: "#black",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px" }}>VOUGHT BUS</h2>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "max-content auto",
              columnGap: "10px",
              rowGap: "10px",
              alignItems: "center",
            }}
          >
            <Box sx={{ fontWeight: "bold" }}>Name<span style={{ marginLeft: "5px" }}>:</span></Box>
            <Box>{user?.name || "Guest"}</Box>
            <Box sx={{ fontWeight: "bold" }}>Role<span style={{ marginLeft: "15px" }}>:</span></Box>
            <Box>{user?.isAdmin ? "Admin" : "Guest"}</Box>
          </Box>
        </Box>
        {menuToBeRendered.map((item) => (
          <Box
            key={item.name}
            sx={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              padding: "10px 15px",
              color: "white",
              borderBottom: "1px solid white",
            }}
            onClick={item.action || null}
          >
            {item.path ? (
              <Link to={item.path} style={{ textDecoration: "none", color: "white" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    gap: "15px",
                    fontSize: "18px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    {item.icon}
                  </Box>
                  {menu && (<Box sx={{ display: "flex", alignItems: "start", fontWeight: "400" }}>{item.name}</Box>)}
                </Box>
              </Link>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "15px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  {item.icon}
                </Box>
                {menu && (<Box sx={{ display: "flex", alignItems: "start", fontWeight: "400" }}>{item.name}</Box>)}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ padding: "1vw" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
            height: "50px",
            border: "0.5px solid black",
            boxShadow: "1px 1px 1px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {menu ? (
            <CloseIcon sx={{ fontSize: "30px" }} onClick={toggleMenu} />
          ) : (
            <MenuIcon sx={{ fontSize: "30px" }} onClick={toggleMenu} />
          )}
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
