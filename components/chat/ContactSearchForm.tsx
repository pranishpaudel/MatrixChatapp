import * as React from "react";

import { Button } from "@/components/ui/button";
import Lottie from "react-lottie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { SEARCH_CONTACT_BY_NAME_ROUTE } from "@/constants/routes";

interface ContactSearchFormProps {
  onClose: () => void;
}

function ContactSearchForm({ onClose }: ContactSearchFormProps) {
  const [searchText, setSearchText] = React.useState("");
  const [selectedName, setSelectedName] = React.useState("");

  // Seed an array of names
  const names = [
    "John Doe",
    "Jane Smith",
    "Adsalice Johnson",
    "Bodsab Williams",
  ];

  // Filter the names based on the search text
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchText.toLowerCase())
  );

  React.useEffect(() => {
    const searchContact = async () => {
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
      console.log(data);
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
          {searchText && filteredNames.length != 0 && (
            <>
              {filteredNames.map((name) => (
                <li
                  key={name}
                  className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md ${
                    selectedName === name ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setSelectedName(name)}
                >
                  {name}
                </li>
              ))}
            </>
          )}

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
        </ul>
      </CardContent>
    </Card>
  );
}

export default ContactSearchForm;
