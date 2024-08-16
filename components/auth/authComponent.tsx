"use client";

import imageUrls from "@/constants/Images";
import Image from "next/image";
import { Separator } from "../ui/separator";
import AuthForm from "./form";
import { useState } from "react";

const AuthComponent = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <>
      <div className="flex flex-col justify-start items-center h-[35vw] w-[40vw] border-1 border-slate-200 shadow-lg rounded-lg">
        <div className="flex items-center font-bold text-[45px] mt-4">
          Welcome{"  "}
          <Image
            src={imageUrls.fingerEmoji}
            alt="finger"
            width={45}
            height={45}
            className="ml-2"
          />
        </div>
        <div className="mt-4 text-center font-bold text-md">
          Fill in the details to get started into our chat application
        </div>

        <div className="w-full flex flex-col items-center mt-10">
          <div className="flex justify-evenly w-full font-bold text-2xl">
            <div className="flex flex-col items-center">
              <button onClick={() => setIsLoginForm(true)}>Login</button>
              <Separator
                className="w-full mt-2"
                color={isLoginForm ? "bg-black" : "bg-border"}
              />
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => setIsLoginForm(false)}>Signup</button>
              <Separator
                className="w-full mt-2"
                color={!isLoginForm ? "bg-black" : "bg-border"}
              />
            </div>
          </div>
        </div>

        <div className="h-full w-full mt-10 flex justify-center">
          <div className="w-[70%]">
            <AuthForm isLoginForm={isLoginForm} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
