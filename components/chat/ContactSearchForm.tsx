import * as React from "react";

import { Button } from "@/components/ui/button";
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

interface ContactSearchFormProps {
  onClose: () => void;
}

function ContactSearchForm({ onClose }: ContactSearchFormProps) {
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
          placeholder="Search for your friend"
          className="w-full h-[3em] text-slate-300 text-lg"
        />
      </CardContent>
    </Card>
  );
}

export default ContactSearchForm;
