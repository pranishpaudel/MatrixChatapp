import { SocketProvider } from "@/context/SocketProvider";
import { ReactNode } from "react";

const chatLayout = ({ children }: { children: ReactNode }) => {
  console.log("chatLayout");
  return (
    <div>
      <SocketProvider>{children}</SocketProvider>
    </div>
  );
};

export default chatLayout;
