import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/Dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import { CreditCard } from "lucide-react";

export default function Blogs_header() {
  return (
    <div className="flex justify-center items text-black font-rubik">
      <div className="absolute flex justify-between items-center max-w-[1100px] mt-6 sm:mt-6 w-full">
        <div>
          <a
            href="/"
            className="text-2xl lg:text-3xl font-semibold no-underline text-yellow-500 hover:text-yellow-500 cursor-pointer mx-2"
          >
            APPOPENER
          </a>
        </div>
        <div className="flex gap-1 items-center">
          <div className="hidden sm:flex gap-2 mx-4">
            <Button
              asChild
              variant="secondary"
              className="text-xs lg:text-sm text-white p-3"
            >
              <a href="/blog" className="font-semibold no-underline">
                HOME
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="text-xs lg:text-sm text-white p-3"
            >
              <a href="/getToken" className="font-semibold no-underline">
                <CreditCard />
                GET TOKEN
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="text-xs lg:text-sm text-black bg-gray-400 p-3"
            >
              <a href="/writeBlog" className="font-semibold no-underline">
                Create Blog
              </a>
            </Button>
          </div>
          <div className="sm:hidden mx-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <RxHamburgerMenu size={32} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-white">
                <DropdownMenuItem asChild>
                  <a href="/blog" className="no-underline text-white">
                    HOME
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/getToken" className="no-underline text-white">
                    Get Tokens
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/writeBlog" className="no-underline text-white">
                    ADD BLOG
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
