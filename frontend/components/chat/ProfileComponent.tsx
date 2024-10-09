"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  GET_USER_DETAILS_ROUTE,
  HANDLE_LOGOUT_ROUTE,
} from "@/constants/routes";
import { useEffect, useState } from "react";
import { LogOut, UserRoundPen } from "lucide-react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileComponent = () => {
  const [imageData, setImageData] = useState("https://github.com/shadcn.png");
  const [firstName, setFirstName] = useState("User");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [currentSenderId, setCurrentSenderId] = useAtom(
    jotaiAtoms.currentSenderId
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    firstName.length + lastName.length > 15
      ? setFullName(firstName.substring(0, 10) + "...")
      : setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  // Get Userdata
  useEffect(() => {
    const checkProfile = async () => {
      setLoading(true);
      const response = await fetch(GET_USER_DETAILS_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: ["firstName", "lastName", "image", "id"],
        }),
      });
      const data = await response.json();

      if (data.success) {
        setFirstName(data.data.firstName);
        setLastName(data.data.lastName);
        setImageData(data.data.image);
        setCurrentSenderId(data.data.id);
        setLoading(false);
      }
    };
    checkProfile();
  }, [setCurrentSenderId]);

  const handleLogout = async () => {
    const response = await fetch(HANDLE_LOGOUT_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      window.location.reload();
    }
  };

  const handleClick = () => {
    window.location.href = "/profile";
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {loading ? (
            <Skeleton className="w-16 h-16 rounded-full mr-4" />
          ) : (
            <Avatar
              style={{ width: "60px", height: "60px", marginRight: "10px" }}
            >
              <AvatarImage
                src={imageData}
                alt="User"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Avatar>
          )}

          {loading ? (
            <Skeleton className="w-24 h-6 rounded-md" />
          ) : (
            <span className="font-bold text-md text-slate-300">{fullName}</span>
          )}
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          className="ml-4"
        >
          <UserRoundPen
            style={{ cursor: "pointer", width: "20px", height: "20px" }}
            className="text-slate-400 hover:text-white"
            onClick={handleClick}
          />
          <LogOut
            className="cursor-pointer w-5 h-5 text-red-500 transition-transform duration-300 ease-in-out transform hover:scale-125"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
