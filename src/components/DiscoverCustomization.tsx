import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Pencil } from "lucide-react";

export const DiscoverCustomization = () => {
  const router = useRouter();

  // Saving and going to the Discover page
  const [title1, setTitle1] = useState("");
  const [query1, setQuery1] = useState("");
  const [title2, setTitle2] = useState("");
  const [query2, setQuery2] = useState("");
  const [title3, setTitle3] = useState("");
  const [query3, setQuery3] = useState("");
  const [title4, setTitle4] = useState("");
  const [query4, setQuery4] = useState("");
  const [title5, setTitle5] = useState("");
  const [query5, setQuery5] = useState("");

  const saveAndDiscover = () => {
    const params = new URLSearchParams();
    if (title1) params.set("field1", title1);
    if (query1) params.set("query1", query1);
    if (title2) params.set("field2", title2);
    if (query2) params.set("query2", query2);
    if (title3) params.set("field3", title3);
    if (query3) params.set("query3", query3);
    if (title4) params.set("field4", title4);
    if (query4) params.set("query4", query4);
    if (title5) params.set("field5", title5);
    if (query5) params.set("query5", query5);

    router.push(`/discover?${params.toString()}`);
  };

  return (
    <Drawer>
      <DrawerTrigger className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center cursor-pointer outline-none">
        <Pencil color="currentColor" className="hidden md:inline" />
        Customize
      </DrawerTrigger>
      <DrawerContent className="bg-black border-slate-600 text-white text-base! md:text-lg!">
        <div className="mx-auto w-full md:max-w-1/2 px-6">
          <DrawerHeader>
            <DrawerTitle className=" md:text-2xl text-xl font-bold text-white">
              Customize your discoveries!
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 items-start justify-start w-full cursor-text select-text">
            <div className="flex items-start justify-start gap-2">
              <p className="md:text-lg text-base font-semibold">Title</p>
              <p className="md:text-lg text-base font-normal text-slate-400">
                What will be displayed on the Discover page as the title of the
                section
              </p>
            </div>
            <div className="flex items-start justify-start gap-2">
              <p className="md:text-lg text-base font-semibold">Query</p>
              <p className="md:text-lg text-base font-normal text-slate-400">
                Describe what you'd like the section to contain, eg 'cozy fall
                vibes' or 'best TikTok songs'
              </p>
            </div>
          </div>
          <Accordion type="single" collapsible className="gap-6 w-full mt-6">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                Field 1
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-1 flex flex-col gap-2 items-start justify-start w-full md:w-1/2">
                  <p className="md:text-lg text-base font-medium">Title 1</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="title-1"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={title1}
                    onChange={(e) => setTitle1(e.target.value)}
                  />
                  <p className="md:text-lg text-base font-medium">Query 1</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="query-1"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={query1}
                    onChange={(e) => setQuery1(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                Field 2
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-1 flex flex-col gap-2 items-start justify-start w-full md:w-1/2">
                  <p className="md:text-lg text-base font-medium">Title 2</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="title-2"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={title2}
                    onChange={(e) => setTitle2(e.target.value)}
                  />
                  <p className="md:text-lg text-base font-medium">Query 2</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="query-2"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={query2}
                    onChange={(e) => setQuery2(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                Field 3
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-1 flex flex-col gap-2 items-start justify-start w-full md:w-1/2">
                  <p className="md:text-lg text-base font-medium">Title 3</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="title-3"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={title3}
                    onChange={(e) => setTitle3(e.target.value)}
                  />
                  <p className="md:text-lg text-base font-medium">Query 3</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="query-3"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={query3}
                    onChange={(e) => setQuery3(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                Field 4
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-1 flex flex-col gap-2 items-start justify-start w-full md:w-1/2">
                  <p className="md:text-lg text-base font-medium">Title 4</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="title-4"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={title4}
                    onChange={(e) => setTitle4(e.target.value)}
                  />
                  <p className="md:text-lg text-base font-medium">Query 4</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="query-4"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={query4}
                    onChange={(e) => setQuery4(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-none">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                Field 5
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-1 flex flex-col gap-2 items-start justify-start w-full md:w-1/2">
                  <p className="md:text-lg text-base font-medium">Title 5</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="title-5"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={title5}
                    onChange={(e) => setTitle5(e.target.value)}
                  />
                  <p className="md:text-lg text-base font-medium">Query 5</p>
                  <Input
                    type="text"
                    placeholder="Search for an artist"
                    id="query-5"
                    className="bg-black text-white text-lg! px-4 py-3 w-full"
                    value={query5}
                    onChange={(e) => setQuery5(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DrawerFooter className="flex items-center justify-center gap-6 flex-row">
            <DrawerClose className="cursor-pointer text-base text-white rounded-lg hover:text-white/80 px-3 py-1.5 bg-black transition">
              Close
            </DrawerClose>
            <button
              className="cursor-pointer text-base text-black rounded-lg hover:bg-white/80  px-3 py-1.5 bg-white transition"
              onClick={() => saveAndDiscover()}
            >
              Save
            </button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
