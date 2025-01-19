import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

function UserProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    profilePicture: "",
    address: {
      doorNo: "",
      street: "",
      place: "",
      city: "",
      postalCode: "",
    },
    password: "", // Add password field
    newPassword: "", // New password field for updates
  });

  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/get-profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const fetchedProfile = response.data.user;
        setProfile({
          name: fetchedProfile.name || "",
          email: fetchedProfile.email || "",
          phone: fetchedProfile.phone || "",
          dob: fetchedProfile.dob || "",
          profilePicture: fetchedProfile.profilePicture || "",
          avatarColor: fetchedProfile.avatarColor || "",
          avatarInitial: fetchedProfile.avatarInitial || "",
          address: {
            doorNo: fetchedProfile.address?.doorNo || "",
            street: fetchedProfile.address?.street || "",
            place: fetchedProfile.address?.place || "",
            city: fetchedProfile.address?.city || "",
            postalCode: fetchedProfile.address?.postalCode || "",
          },
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name || "");
      formData.append("email", profile.email || "");
      formData.append("phone", profile.phone || "");
      formData.append("dob", profile.dob || "");
      formData.append("address", JSON.stringify(profile.address || {}));
      formData.append("password", profile.password || "");
      formData.append("newPassword", profile.newPassword || ""); // Append new password

      if (profile.profilePicture) {
        formData.append("profilePicture", profile.profilePicture);
      } else if (!profile.profilePicture) {
        formData.append("removeProfilePicture", true);
      }

      const response = await axios.post(
        "http://localhost:5000/users/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
        fetchProfile();
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, PNG, and JPG are allowed.");
        return;
      }

      if (file.size > maxSize) {
        alert("File size should not exceed 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        mt: 6,
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 4,
          marginTop: 2,
          color: "#333",
          position: "relative",
          paddingBottom: "10px",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: "100px",
            height: "3px",
            backgroundColor: "#1976d2",
            transform: "translateX(-50%)",
          },
        }}
      >
        User Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              width: 200,
              height: 200,
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar
              alt="Profile Picture"
              src={profile.profilePicture || undefined}
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: profile.profilePicture
                  ? "transparent"
                  : profile.avatarColor,
                fontSize: "60px",
                color: "#fff",
                transition: "0.3s ease-in-out",
              }}
              onClick={handleAvatarClick}
            >
              {!profile.profilePicture && profile.avatarInitial}
            </Avatar>

            {isHovered && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  borderRadius: "50%",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ marginBottom: 1, cursor: "pointer" }}
                  onClick={handleAvatarClick}
                >
                  Change Photo
                </Typography>
                {profile.profilePicture && (
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer" }}
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Password Fields */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                name="password"
                value={profile.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ marginTop: 3, fontWeight: "bold", color: "#555" }}
            >
              Address
            </Typography>
            {["doorNo", "street", "place", "city", "postalCode"].map(
              (field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    variant="outlined"
                    fullWidth
                    name={`address.${field}`}
                    value={profile.address[field]}
                    onChange={handleChange}
                  />
                </Grid>
              )
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpdate}
                sx={{
                  marginTop: 2,
                  padding: "10px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserProfile;
