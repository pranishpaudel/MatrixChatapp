"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GET_USER_DETAILS_ROUTE } from "@/constants/routes";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";

const ProfileComponent = () => {
  const [imageData, setImageData] = useState("https://github.com/shadcn.png");
  const [firstName, setFirstName] = useState("User");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [currentSenderId, setCurrentSenderId] = useAtom(
    jotaiAtoms.currentSenderId
  );
  useEffect(() => {
    firstName.length + lastName.length > 15
      ? setFullName(firstName.substring(0, 10) + "...")
      : setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  // Get Userdata
  useEffect(() => {
    const checkProfile = async () => {
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
      console.log(data);
      if (data.success) {
        setFirstName(data.data.firstName);
        setLastName(data.data.lastName);
        setImageData(data.data.image);
        setCurrentSenderId(data.data.id);
      }
    };
    checkProfile();
  }, [setCurrentSenderId]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar style={{ width: "60px", height: "60px", marginRight: "10px" }}>
        {/* Adjust the width and height as needed */}
        <AvatarImage
          src={imageData}
          alt="User"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Avatar>
      <span className="font-bold text-md text-slate-300">{fullName}</span>
    </div>
  );
};

export default ProfileComponent;
