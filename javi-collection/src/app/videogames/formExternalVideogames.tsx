import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Command } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
    videogames: z.string({
        required_error: "Please select a videogame.",
    }),
    platform: z.enum(['PC', 'PS2', 'PS3', 'Wii U', 'Switch', 'PSP', 'Nitendo DS', 'Nintendo 3DS'], {
        required_error: "Platform is required",
        invalid_type_error: "Platform must be a valid option",
    }),
    status: z.enum(['To Play', 'Playing', 'Completed', 'Finished', 'Dropped'], {
        required_error: "Status is required",
        invalid_type_error: "Status must be a valid option",
    }),
    initDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    rating: z.number().optional(),
    review: z.string().optional(),
});

function FormExternalVideogames() {

    const [open, setOpen] = useState(false);
    const [videogames, setVideogames] = useState<{ value: string; label: string }[]>([{ value: "", label: "Loading..." }]);
    const [videogamesName, setVideogamesName] = useState("");
    const [videogamesImage, setVideogamesImage] = useState("/videogames/default.jpg");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            videogames: "",
            platform: "PC",
            status: "To Play",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))}>
                <Controller
                    name="videogames"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Videogame Name</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" >
                                        {field.value
                                            ? videogames.find((videogames) => videogames.value === field.value)?.label
                                            : "Select book"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search language..." value={videogamesName} onValueChange={(value) => setVideogamesName(value)} />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup>
                                                {
                                                    videogames.map((videogame) => (

                                                        <CommandItem
                                                            value={videogame.value}
                                                            key={videogame.value}
                                                            onSelect={() => {
                                                                field.onChange(videogame.value);
                                                                const data = JSON.parse(videogame.value);
                                                                setVideogamesImage(data.volumeInfo.imageLinks?.smallThumbnail || "");
                                                                setOpen(false);
                                                            }}
                                                            className="text-sm"
                                                        >
                                                            {videogame.label}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
export { FormExternalVideogames };