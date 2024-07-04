import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiFillHome, AiTwotoneBook, AiOutlineMenu } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiBus, BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";

function DefaultLayout({ children }) {
  const [menu, setMenu] = useState(false);
  const { user } = useSelector((state) => state.user);

  const setMenus = () => {
    setMenu((prevMenu) => !prevMenu);
  };

  const userMenu = [
    {
      name: "Home",
      icon: <AiFillHome size={"30px"} />,
      path: "/",
    },
    {
      name: "Booking",
      icon: <AiTwotoneBook size={"30px"} />,
      path: "/",
    },
    {
      name: "Profile",
      icon: <CgProfile size={"30px"} />,
      path: "/",
    },
    {
      name: "Logout",
      icon: <BiLogOut size={"30px"} />,
      path: "/",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      icon: <AiFillHome size={"30px"} />,
      path: "/",
    },
    {
      name: "Buses",
      icon: <BiBus size={"30px"} />,
      path: "/admin/buses",
    },
    {
      name: "Users",
      icon: <CgProfile size={"30px"} />,
      path: "/admin/users",
    },
    {
      name: "Booking",
      icon: <AiTwotoneBook size={"30px"} />,
      path: "/admin/booking",
    },
    {
      name: "Logout",
      icon: <BiLogOut size={"30px"} />,
      path: "/logout",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { md: "20% 80%", sm: "100%" },
        height: "100vh",
      }}
    >
      <Box
        sx={{
          background: "red",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <h2>CB</h2>
          </Box>
          <Box>{user?.name}</Box>
          <Box>Role: {user?.isAdmin ? "Admin" : "User"}</Box>
        </Box>
        {menuToBeRendered.map((data) => (
          <Box
            key={data.name}
            sx={{
              height: "50px",
              color: "white",
              borderBottom: "1px solid white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              to={data.path}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Box sx={{ gap: "15px", display: "flex" }}>
                {data.icon}
                <Box>{menu ? data.name : null}</Box>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
      <Box sx={{ padding: "1vw" }}>
        <Box
          sx={{
            width: "100px",
            height: "13%",
            border: "1px solid black",
            boxShadow: "1px 1px 5px",
            display: "flex",
            alignItems: "center",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {menu ? (
            <ImCancelCircle onClick={setMenus} size={"40px"} />
          ) : (
            <AiOutlineMenu size={"40px"} onClick={setMenus} />
          )}
          <span>Header</span>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
