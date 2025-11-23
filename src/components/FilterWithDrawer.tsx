import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";

const FilterWithDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center cursor-pointer outline-none">
        <SlidersHorizontal color="currentColor" className="hidden md:inline" />
        Filter
      </DrawerTrigger>
      <DrawerContent className="bg-black border-slate-600 text-white text-base! md:text-lg!">
        <div className="mx-auto w-full md:max-w-md px-4">
          <DrawerHeader>
            <DrawerTitle className="text-white">Filter Your Music</DrawerTitle>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-2 md:gap-4 items-between justify-start overflow-y-scroll">
            <div className="flex flex-col gap-2">
              <p className="mb-2 font-semibold">Genres</p>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="rock"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="rock"
                  className="text-lg font-normal cursor-pointer"
                >
                  Rock
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="indie"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="indie"
                  className="text-lg font-normal cursor-pointer"
                >
                  Indie
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="pop"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="pop"
                  className="text-lg font-normal cursor-pointer"
                >
                  Pop
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="hiphop"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="hiphop"
                  className="text-lg font-normal cursor-pointer"
                >
                  Hip Hop
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="jazz"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="jazz"
                  className="text-lg font-normal cursor-pointer"
                >
                  Jazz
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="electronic"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="electronic"
                  className="text-lg font-normal cursor-pointer"
                >
                  Electronic
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="country"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="country"
                  className="text-lg font-normal cursor-pointer"
                >
                  Country
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="rnb"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="rnb"
                  className="text-lg font-normal cursor-pointer"
                >
                  R&B
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="metal"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="metal"
                  className="text-lg font-normal cursor-pointer"
                >
                  Metal
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="classical"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="classical"
                  className="text-lg font-normal cursor-pointer"
                >
                  Classical
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="folk"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="folk"
                  className="text-lg font-normal cursor-pointer"
                >
                  Folk
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="blues"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="blues"
                  className="text-lg font-normal cursor-pointer"
                >
                  Blues
                </Label>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="soul"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
                <Label
                  htmlFor="soul"
                  className="text-lg font-normal cursor-pointer"
                >
                  Soul
                </Label>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <p className="mb-2 font-semibold">Mood</p>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="energetic"
                  className="text-lg font-normal cursor-pointer"
                >
                  Energetic
                </Label>
                <Checkbox
                  id="energetic"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="chill"
                  className="text-lg font-normal cursor-pointer"
                >
                  Chill
                </Label>
                <Checkbox
                  id="chill"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="happy"
                  className="text-lg font-normal cursor-pointer"
                >
                  Happy
                </Label>
                <Checkbox
                  id="happy"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="melancholic"
                  className="text-lg font-normal cursor-pointer"
                >
                  Melancholic
                </Label>
                <Checkbox
                  id="melancholic"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="romantic"
                  className="text-lg font-normal cursor-pointer"
                >
                  Romantic
                </Label>
                <Checkbox
                  id="romantic"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="aggressive"
                  className="text-lg font-normal cursor-pointer"
                >
                  Aggressive
                </Label>
                <Checkbox
                  id="aggressive"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="relaxing"
                  className="text-lg font-normal cursor-pointer"
                >
                  Relaxing
                </Label>
                <Checkbox
                  id="relaxing"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="uplifting"
                  className="text-lg font-normal cursor-pointer"
                >
                  Uplifting
                </Label>
                <Checkbox
                  id="uplifting"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="dark"
                  className="text-lg font-normal cursor-pointer"
                >
                  Dark
                </Label>
                <Checkbox
                  id="dark"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="nostalgic"
                  className="text-lg font-normal cursor-pointer"
                >
                  Nostalgic
                </Label>
                <Checkbox
                  id="nostalgic"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="dreamy"
                  className="text-lg font-normal cursor-pointer"
                >
                  Dreamy
                </Label>
                <Checkbox
                  id="dreamy"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="intense"
                  className="text-lg font-normal cursor-pointer"
                >
                  Intense
                </Label>
                <Checkbox
                  id="intense"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3 text-right ml-auto cursor-pointer">
                <Label
                  htmlFor="peaceful"
                  className="text-lg font-normal cursor-pointer"
                >
                  Peaceful
                </Label>
                <Checkbox
                  id="peaceful"
                  className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954] cursor-pointer"
                />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose className="cursor-pointer">Close</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterWithDrawer;
