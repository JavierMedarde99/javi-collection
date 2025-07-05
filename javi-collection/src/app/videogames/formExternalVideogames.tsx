import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactStars from "react-stars";
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
    const [status, setStatus] = useState<string>("To Play");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            videogames: "",
            platform: "PC",
            status: "To Play",
        },
    });

    useEffect(() => {
        async function externalFechVideogames(){
            try {
                if (videogamesName.length < 3) {
                    setVideogames([{ value: "", label: "loading..." }]);
                    return;
                }
                const response =await fetch(`/api/videogames/externals?search=${videogamesName}`)
                if (response.ok) {
                    const data = await response.json();
                    setVideogames(data);
                }
                
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }
        externalFechVideogames();
    }, [videogamesName]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            console.log('Submitting data:', data);
            const videogameData = JSON.parse(data.videogames);
            const response = await fetch('/api/videogames/externals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videogame: videogameData,
                    platform: data.platform,
                    status: data.status,
                    initDate: data.initDate,
                    endDate: data.endDate,
                    rating: data.rating,
                    review: data.review,
                }),
            });
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting videogame data:', error);
        }
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-4">
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
                                            : "Select videogame"}
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
                                                                console.log(data.cover.url);
                                                                setVideogamesImage('https:'+data.cover.url || "");
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
                <Image
                                    src={videogamesImage ? videogamesImage : "/videogames/book-placeholder.png"}
                                    alt="Book cover"
                                    width={100}
                                    height={150}
                                    className="rounded-md object-center"
                                />
                <Controller
                    name="platform"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <select {...field} className="w-full p-2 border rounded-md">
                                <option value="PC">PC</option>
                                <option value="PS2">PS2</option>
                                <option value="PS3">PS3</option>
                                <option value="Wii U">Wii U</option>
                                <option value="Switch">Switch</option>
                                <option value="PSP">PSP</option>
                                <option value="Nitendo DS">Nitendo DS</option>
                                <option value="Nintendo 3DS">Nintendo 3DS</option>
                            </select>
                        </FormItem>
                    )}
                />
                <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <select {...field} className="w-full p-2 border rounded-md" 
                            onChange={(event) => { field.onChange(event.target.value); setStatus(event.target.value) }}>
                                <option value="To Play">To Play</option>
                                <option value="Playing">Playing</option>
                                <option value="Completed">Completed</option>
                                <option value="Finished">Finished</option>
                                <option value="Dropped">Dropped</option>
                            </select>
                        </FormItem>
                    )}
                />
                {(status === 'Playing' || status === "Completed" || status == "Finished") && (
                    <Controller
                        control={form.control}
                        name="initDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        placeholder="Start Date"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />)}
                {(status === 'Completed' || status === "Finished") && (
                    <>
                        <Controller
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="date"
                                            placeholder="End Date"
                                            value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <ReactStars
                                            count={5}
                                            value={field.value}
                                            onChange={(newRating: number) => field.onChange(newRating)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your review here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>)}
                <Button type="submit" className="mt-4">
                    Send
                </Button>
            </form>
        </Form>
    );
}
export { FormExternalVideogames };