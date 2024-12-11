"use client";

import { ReactNode, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";

type Props = {
  trigger: ReactNode;
  content: (close: () => void) => ReactNode;
  triggerClass?: string;
};

const ResponsiveDialog = ({ trigger, content, triggerClass }: Props) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={triggerClass}>
            {trigger}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DialogTitle className="hidden">title</DialogTitle>
          {content(() => setOpen(false))}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={triggerClass}>
          {trigger}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="hidden">title</DrawerTitle>
        {content(() => setOpen(false))}
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDialog;
