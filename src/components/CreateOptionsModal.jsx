import React from "react";
import { Swords, Cast, FileText, Megaphone, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CreateOptionsModal = ({ open, onOpenChange }) => {
  const history = useHistory();
  const options = [
    {
      name: "Challenge",
      icon: <Swords size={32} className="text-red-500" />,
      description: "Start a challenge",
      link:"https://www.creatorcosmos.com/",
    },
    {
      name: "Channel",
      icon: <Cast size={32} className="text-blue-500" />,
      description: "Create a channel",
      link:"https://www.loginskip.com/",
    },
    {
      name: "Challan",
      icon: <FileText size={32} className="text-yellow-500" />,
      description: "Issue a challan",
      link:"https://apposlash.com/",
    },
    {
      name: "Complain",
      icon: <Megaphone size={32} className="text-orange-500" />,
      description: "Register a complaint",
      link:"https://www.indian-ai.com/complain",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90vw] backdrop-blur-xl bg-black/40 border-white/20 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold mb-4">
            Create
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {options.map((option) => (
            <a
              key={option.name}
              // onClick={option.onClick}
              href={option.link}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/10 hover:border-white/30 gap-3 aspect-square text-white no-underline"
            >
              <div className="p-3 rounded-full bg-white/10">
                {option.icon}
              </div>
              <span className="font-semibold text-sm">{option.name}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOptionsModal;