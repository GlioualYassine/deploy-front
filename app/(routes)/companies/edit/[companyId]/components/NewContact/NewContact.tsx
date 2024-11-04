"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormContact from "./FormContact/FormContact";

const NewContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open}
        onOpenChange={setOpen}
    >
        <DialogTrigger asChild>
            <Button>Add new Contact</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogDescription>
                    Create your contacts to manage them later.
                </DialogDescription>
            </DialogHeader>
            <FormContact setOpen={setOpen}/>
        </DialogContent>
    </Dialog>
  )
};

export default NewContact;
