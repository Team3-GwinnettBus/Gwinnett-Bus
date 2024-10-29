import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-center p-4 rounded-lg shadow-md">
      <Menubar className="p-6 rounded-xl m-4 dark:bg-black">
        {/* About Menu */}
        <MenubarMenu>
          <MenubarTrigger className="rounded-xl">About</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/">Home</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link to="/about">Who Are We?</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link to="/contact">Contact</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Resources Menu */}
        <MenubarMenu>
          <MenubarTrigger className="rounded-xl">Resources</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/documentation">Documentation</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link to="/journal">Journal</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link to="/learning">Learning</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Documents Menu */}
        <MenubarMenu>
          <MenubarTrigger className="rounded-xl">Documents</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/documents">All Project Documents</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Demo Menu */}
        <MenubarMenu>
          <MenubarTrigger className="rounded-xl">Login</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to="/map">Parents</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link to="/dashboard">Admin</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
