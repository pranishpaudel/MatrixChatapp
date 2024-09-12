import { Separator } from "../ui/separator";

const SideBar = () => {
  return (
    <div className="h-full flex  justify-end">
      <Separator className="h-full" orientation="vertical" />
      <div></div>
    </div>
  );
};

export default SideBar;
