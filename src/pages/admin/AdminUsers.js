import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { Block as BlockIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { useDispatch } from "react-redux";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const updateUserPermission = async (user, action) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/update-user-permission",
        { selectedUserId: user._id, action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  isAdmin: action === "toggleAdmin" ? !u.isAdmin : u.isAdmin,
                  isBlocked:
                    action === "toggleBlock" ? !u.isBlocked : u.isBlocked,
                }
              : u
          )
        );
      }
    } catch (error) {
      console.error("Failed to update user permission:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/get-all-users",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Box>
      <Box sx={{ marginBottom: 3 }}>
        <PageTitle
          title="Users"
          sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
        />
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="users table">
            <TableHead>
              <TableRow
                sx={{ background: "rgb(101,101,101,.2)", height: "80px" }}
              >
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Role
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">
                      {user.isAdmin ? "Admin" : "User"}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip
                          title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                        >
                          <IconButton
                            onClick={() =>
                              updateUserPermission(user, "toggleAdmin")
                            }
                            sx={{
                              color: user.isAdmin ? "#007bff" : "#6c757d",
                            }}
                          >
                            {user.isAdmin ? (
                              <AdminPanelSettingsIcon
                                sx={{ fontSize: "1.7rem" }}
                              />
                            ) : (
                              <VerifiedUserIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          <IconButton
                            onClick={() =>
                              updateUserPermission(user, "toggleBlock")
                            }
                            sx={{
                              color: user.isBlocked ? "#c82333" : "#6c757d",
                            }}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminUsers;
