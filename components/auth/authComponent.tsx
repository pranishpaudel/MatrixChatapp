"use client";

import imageUrls from "@/constants/Images";
import Image from "next/image";
import { Separator } from "../ui/separator";
import AuthForm from "./form";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";

const AuthComponent = () => {
  const [isLoginForm, setIsLoginForm] = useAtom(jotaiAtoms.isLoginForm);
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "to",
    },
    {
      text: "Matrix ChatApp",
      className: "text-blue-500 dark:text-purple-600",
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-start items-center h-auto  w-[90vw] md:w-[40vw] border-1 border-slate-200 shadow-lg rounded-lg p-4 md:p-8">
        <div className="flex items-center font-bold text-[30px] md:text-[45px] mt-4">
          <TypewriterEffectSmooth words={words} />
        </div>
        <div className="mt-4 text-center font-bold text-sm md:text-md">
          Fill in the details to get started into our chat application
        </div>

        <div className="w-full flex flex-col items-center mt-6 md:mt-10">
          <div className="flex justify-evenly w-full font-bold text-lg md:text-2xl">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsLoginForm(true)}
                className={`${!isLoginForm ? "text-slate-300" : ""}`}
              >
                Login
              </button>
              <Separator
                className="w-full mt-2"
                color={
                  isLoginForm
                    ? "bg-black dark:bg-purple-800"
                    : "bg-border dark:bg-border-dark"
                }
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsLoginForm(false)}
                className={`${isLoginForm ? "text-slate-300" : ""}`}
              >
                Signup
              </button>
              <Separator
                className="w-full mt-2"
                color={
                  !isLoginForm
                    ? "bg-black dark:bg-white"
                    : "bg-border dark:bg-border-dark"
                }
              />
            </div>
          </div>
        </div>

        <div className="h-full w-full mt-6 md:mt-10 flex justify-center">
          <div className="w-full md:w-[70%]">
            <AuthForm isLoginForm={isLoginForm} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
