import AuthComponent from "@/components/auth/authComponent";
import { ModeToggle } from "@/components/ui/modeToggle";

const page = () => {
  return (
    <div>
      <div className="h-[100vh] w-[100vw]  flex justify-center items-center">
        <ModeToggle />
        <AuthComponent />
      </div>
    </div>
  );
};
export default page;
