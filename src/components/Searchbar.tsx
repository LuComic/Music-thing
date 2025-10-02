import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface SearchbarProps {
  closeSearching: () => void;
}

export const Searchbar = ({ closeSearching }: SearchbarProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearching();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearching]);

  return (
    <div className="w-screen h-screen bg-black/40 backdrop-blur-sm fixed top left-0 right-0 overscroll-none flex items-center justify-center z-30">
      <div className="flex w-full max-w-xl items-center gap-2">
        <Input
          type="text"
          placeholder="Search for an artist"
          className="bg-black text-white !text-lg"
        />
        <Button
          type="submit"
          variant="outline"
          className="cursor-pointer text-lg"
        >
          Search
        </Button>
      </div>
    </div>
  );
};
