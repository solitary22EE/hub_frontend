"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Upload } from "lucide-react";
import { User } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";


export default function ProfilePage() {
  // Get current user from auth store
  const user = useAuthStore((state) => state.user);
  // Profile form state
  const [fullName, setFullName] = useState(
  user?.full_name ?? ""
 );
 // Password visibility toggles
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
// Password form state
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [phone, setPhone] = useState(
  user?.phone ?? ""
);
/**
   * Handles profile update.
   * Replace console.log with API call later.
   */
const handleSave = () => {
  console.log({
    fullName,
    phone,
  });
};

  return (
    
   <div className="max-w-2xl mx-auto p-6">
     {/* PROFILE INFORMATION CARD*/}

  <div className="card-cixio p-8">
        {/* Avatar Section */}
   <div className="flex flex-col items-center mb-8">

  <div className="relative">
{/* Display uploaded avatar or default user icon */}
    <div className="w-28 h-28 rounded-full border-4 border-cixio-light bg-cixio-light flex items-center justify-center overflow-hidden">

      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <User
          size={48}
          className="text-cixio-muted"
        />
      )}

    </div>
 {/* Avatar upload button */}
    <label
      htmlFor="avatar-upload"
      className="
        absolute
        bottom-0
        right-0
        bg-cixio-blue
        text-white
        p-2
        rounded-full
        cursor-pointer
        hover:bg-cixio-hover
        transition
      "
    >
      <Upload size={16} />
    </label>

    <input
      id="avatar-upload"
      type="file"
      accept="image/*"
      className="hidden"
    />

  </div>

  <h1 className="text-3xl font-bold text-cixio-dark mt-4">
    Profile
  </h1>

  <p className="text-cixio-muted">
    Manage your account information
  </p>

</div>

    <div className="space-y-5">

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          className="input-cixio"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />
      </div>
     {/* Read-only Email */}
      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          className="input-cixio bg-gray-100"
          value={user?.email ?? ""}
          readOnly
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone Number
        </label>

        <input
          className="input-cixio"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />
      </div>

      <button
        onClick={handleSave}
        className="btn-cixio w-full"
      >
        Save Changes
      </button>

    </div>

  </div>
   {/* CHANGE PASSWORD CARD */}
<div className="card-cixio p-8 mt-6">

  <h2 className="text-xl font-semibold text-cixio-dark mb-4">
    Change Password
  </h2>

  <div className="space-y-4">

    {/* Current Password */}
    <div className="relative">
      <input
        type={showCurrentPassword ? "text" : "password"}
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="input-cixio pr-10"
      />
  {/* Toggle current password visibility */}
      <button
        type="button"
        onClick={() =>
          setShowCurrentPassword(!showCurrentPassword)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cixio-muted"
      >
        {showCurrentPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>

    {/* New Password */}
    <div className="relative">
      <input
        type={showNewPassword ? "text" : "password"}
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="input-cixio pr-10"
      />
  {/* Toggle new password visibility */}
      <button
        type="button"
        onClick={() =>
          setShowNewPassword(!showNewPassword)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cixio-muted"
      >
        {showNewPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
{/* Update Password Button */}
    <button className="btn-cixio w-full">
      Update Password
    </button>

  </div>

</div>

</div>
    
  );
}