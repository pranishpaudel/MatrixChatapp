"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarText, setAvatarText] = useState("CN");
  const [avatarColor, setAvatarColor] = useState("#3B82F6"); // Default color (blue)

  const allColors = [
    { name: "red", hex: "#EF4444" },
    { name: "orange", hex: "#F97316" },
    { name: "green", hex: "#10B981" },
    { name: "blue", hex: "#3B82F6" },
  ];

  useEffect(() => {
    if (firstName && lastName) {
      setAvatarText(
        `${firstName[0].toLocaleUpperCase()}${lastName[0].toLocaleUpperCase()}`
      );
    } else {
      setAvatarText("CN");
    }
  }, [firstName, lastName]);

  if (!avatarColor) return null;

  return (
    <>
      <div className="h-[100vh] bg-gray-900 flex flex-col md:flex-row justify-center items-center">
        <ArrowLeft className="text-white hover:text-gray-400 hover:cursor-pointer h-10 w-10 absolute top-5 md:top-[180px] right-5 md:right-[73%]" />
        <Avatar
          className="w-32 h-32 md:w-40 md:h-40 relative md:right-[20%] md:bottom-[10%] border-2"
          style={{ borderColor: avatarColor }}
        >
          <AvatarFallback
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              backgroundColor: avatarColor,
            }}
            className="text-2xl font-bold"
          >
            {avatarText}
          </AvatarFallback>
        </Avatar>
        <div className="inputSection flex flex-col space-y-4 mt-8 md:mt-0 md:absolute md:top-[33%]">
          <Input
            type="email"
            placeholder="Email"
            className="w-64 md:w-80 bg-gray-800 text-white border border-gray-700 focus:border-gray-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="First Name"
            className="w-64 md:w-80 bg-gray-800 text-white border border-gray-700 focus:border-gray-500"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="w-64 md:w-80 bg-gray-800 text-white border border-gray-700 focus:border-gray-500"
            onChange={(e) => setLastName(e.target.value)}
          />

          <span className="avatarColors flex flex-row space-x-4 md:space-x-8 relative top-5">
            {allColors.map((color) => (
              <div key={color.name} className="flex flex-col items-center">
                <Avatar>
                  <AvatarFallback
                    onClick={() => setAvatarColor(color.hex)}
                    style={{
                      backgroundColor: color.hex,
                      color: "white",
                      cursor: "pointer",
                      border: `2px solid ${
                        avatarColor === color.hex ? "white" : "transparent"
                      }`,
                    }}
                    className="w-12 h-12"
                  />
                </Avatar>
              </div>
            ))}
          </span>
        </div>
      </div>
      <div className="absolute bottom-[10%] md:top-[60%] mt-[15px] right-[37%] ">
        <Button className="bg-purple-500 w-[400px] hover:bg-purple-400">
          Submit
        </Button>
      </div>
    </>
  );
};

export default Page;
