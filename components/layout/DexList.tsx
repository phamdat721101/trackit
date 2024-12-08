import { Search } from "lucide-react";
import { Button } from "../ui/Button";

export default function DexList() {
  return (
    <>
      <div className="hidden md:block w-40 h-screen border-r border-r-itemborder p-4 text-gray-50 text-sm">
        <div className="mb-4">
          <h1 className=" font-bold">All DEXes</h1>
        </div>
        <nav className="space-y-2">
          {["Warpgate", "RouteX"].map((dex) => (
            <Button key={dex} variant="ghost" className="w-full justify-start">
              <div className="mr-2 h-2 w-2 rounded-full bg-white" />
              {dex}
            </Button>
          ))}
        </nav>
      </div>
      <div className="md:hidden px-4 py-1 flex items-center gap-4 text-gray-50 text-sm">
        <h1 className="font-bold">All DEXes</h1>
        <nav className="flex items-center gap-4">
          {["Warpgate", "RouteX"].map((dex) => (
            <Button key={dex} variant="ghost" className="w-full justify-start">
              {dex}
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
