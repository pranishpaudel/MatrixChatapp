import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileComponent = () => {
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
    </div>
  );
};
export default ProfileComponent;
