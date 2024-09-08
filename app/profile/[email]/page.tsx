"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import { FilePlus } from "lucide-react";

interface ParamsType {
  email: string;
}
const Page: React.FC<{ params: ParamsType }> = ({ params }) => {
  const decodedEmail = decodeURIComponent(params.email);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarColor, setAvatarColor] = useState("#3B82F6"); // Default color (blue)
  const [avatarImage, setAvatarImage] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allColors = [
    { name: "red", hex: "#EF4444" },
    { name: "orange", hex: "#F97316" },
    { name: "green", hex: "#10B981" },
    { name: "blue", hex: "#3B82F6" },
  ];

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string; // Type assertion
        setAvatarImage(base64String as any);
        console.log(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  if (!avatarColor) return null;

  return (
    <>
      <div className="togggleMode absolute flex right-3 top-3">
        <ModeToggle />
      </div>
      <div className="h-[100vh] bg-gray-900 flex flex-col md:flex-row justify-center items-center">
        <ArrowLeft className="text-white hover:text-gray-400 hover:cursor-pointer h-10 w-10 absolute top-5 md:top-[180px] right-5 md:right-[73%]" />

        <Avatar
          className="w-32 h-32 md:w-40 md:h-40 relative md:right-[20%] md:bottom-[10%] border-2"
          style={{ borderColor: avatarColor }}
        >
          {avatarImage ? (
            <AvatarImage src={avatarImage} alt="Avatar" />
          ) : (
            <AvatarFallback
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                backgroundColor: avatarColor,
              }}
              className="text-2xl font-bold relative"
            >
              <FilePlus
                className="relative h-[50px] w-[50px] text-gray-800 hover:text-gray-600 hover:cursor-pointer"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              />
            </AvatarFallback>
          )}
        </Avatar>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="inputSection flex flex-col space-y-4 mt-8 md:mt-0 md:absolute md:top-[33%]">
          <Input
            type="email"
            focusRingColor="blue-500"
            placeholder="Email"
            className="w-64 md:w-80 bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 focus:border-gray-500"
            value={decodedEmail}
            readOnly
          />
          <Input
            type="text"
            focusRingColor="blue-500"
            placeholder="First Name"
            className="w-64 md:w-80 bg-gray-800 text-gray-300 border border-gray-700 focus:border-gray-500"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Input
            type="text"
            focusRingColor="blue-500"
            placeholder="Last Name"
            className="w-64 md:w-80 bg-gray-800 text-gray-300 border border-gray-700 focus:border-gray-500"
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

      <Button className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 md:top-[60%] mt-[15px] bg-purple-500 w-64 md:w-80 hover:bg-purple-400">
        Submit
      </Button>
    </>
  );
};

export default Page;
