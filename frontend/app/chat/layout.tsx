import { SocketProvider } from "@/context/SocketProvider";
import { ReactNode } from "react";

const chatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SocketProvider>{children}</SocketProvider>
    </div>
  );
};

export default chatLayout;
