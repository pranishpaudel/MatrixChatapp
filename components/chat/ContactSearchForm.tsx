import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { SEARCH_CONTACT_BY_NAME_ROUTE } from "@/constants/routes";
import Lottie from "react-lottie";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
interface ContactSearchFormProps {
  onClose: () => void;
}

function ContactSearchForm({ onClose }: ContactSearchFormProps) {
  const [searchText, setSearchText] = React.useState("");
  const [selectedName, setSelectedName] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    {
      firstName: string | null;
      lastName: string;
      email: string;
      image: string | null;
    }[]
  >([]);

  // Fetch the search results based on the search text
  React.useEffect(() => {
    const searchContact = async () => {
      if (searchText) {
        const response = await fetch(SEARCH_CONTACT_BY_NAME_ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchText,
          }),
        });
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    };
    searchContact();
  }, [searchText]);

  return (
    <Card className="w-[350px] relative bg-gray-800">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X />
      </button>
      <CardHeader>
        <CardTitle className="text-md">Search your friend</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          id="search"
          enableFocusRing={false}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for your friend"
          className="w-full h-[3em] text-slate-300 text-lg"
        />
        <ul className="mt-4 max-h-40 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md ${
                  selectedName === `${result.firstName} ${result.lastName}`
                    ? "bg-gray-700"
                    : ""
                }`}
                onClick={() =>
                  setSelectedName(`${result.firstName} ${result.lastName}`)
                }
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        result.image
                          ? result.image
                          : "https://avatars.dicebear.com/api/avataaars/shadcn.svg"
                      }
                      alt="@shadcn"
                      height={40}
                      width={40}
                    />
                  </Avatar>
                  <div className="flex flex-col justify-center">
                    <div className="text-slate-300">
                      <strong>
                        {result.firstName ?? ""} {result.lastName}
                      </strong>
                    </div>
                    <div className="text-slate-400">{result.email}</div>
                  </div>
                </div>
              </li>
            ))
          ) : searchText ? (
            <>
              <li className="text-slate-400">No contacts found</li>
            </>
          ) : null}
          {searchText.length <= 0 && (
            <>
              <Lottie
                isClickToPauseDisabled={true}
                height={200}
                width={200}
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: require("@/public/lottie-json.json"),
                }}
              />
            </>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

export default ContactSearchForm;
