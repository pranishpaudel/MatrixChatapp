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

function ContactSearchForm({ onClose }) {
  return (
    <Card className="w-[350px] relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X />
      </button>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      {/* Rest of the code */}
    </Card>
  );
}

export default ContactSearchForm;
