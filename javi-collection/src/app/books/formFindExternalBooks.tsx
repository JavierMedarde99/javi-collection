import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandEmpty,
    CommandGroup,
    CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactStars from "react-stars";

const FormSchema = z.object({
    book: z.string({
        required_error: "Please select a book.",
    }),
    type: z.enum(["novel", "comic", "manga"], {
        required_error: "Please select a type of book.",
    }),
    status: z.enum(["reading", "read", "toRead"], {
        required_error: "Please select a status.",
    }),
    initDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    rating: z.number().optional(),
    review: z.string().optional(),
});

function FormExternalBooks() {
    const [open, setOpen] = useState(false);
    const [books, setBooks] = useState<{ value: string; label: string }[]>([{ value: "", label: "Loading..." }]);
    const [bookName, setBookName] = useState("");
    const [imageBook, setImageBook] = useState("/books/default.jpg");
    const [status, setStatus] = useState("toRead")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            book: "",
            type: "novel",
            status: "toRead",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        fetch('/api/books/externals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    window.location.reload()
                }
            })
            .catch((error) => {
                console.error("Error:", error)
            })
        form.reset()
    }

    useEffect(() => {
        async function fetchBooks() {
            try {
                if (bookName.length < 3) {
                    setBooks([{ value: "", label: "loading..." }]);
                    return;
                }
                const res = await fetch('/api/books/externals?search=' + bookName);
                if (res.ok) {
                    const data = await res.json();
                    setBooks(data);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        fetchBooks();
    }, [bookName])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="book"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Book Name</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" >
                                        {field.value
                                            ? books.find((book) => book.value === field.value)?.label
                                            : "Select book"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search language..." value={bookName} onValueChange={(value) => setBookName(value)} />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup>
                                                {
                                                    books.map((book) => (

                                                        <CommandItem
                                                            value={book.value}
                                                            key={book.value}
                                                            onSelect={() => {
                                                                field.onChange(book.value);
                                                                const data = JSON.parse(book.value);
                                                                setImageBook(data.volumeInfo.imageLinks?.smallThumbnail || "");
                                                                setOpen(false);
                                                            }}
                                                            className="text-sm"
                                                        >
                                                            {book.label}
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
                    src={imageBook ? imageBook : "/images/book-placeholder.png"}
                    alt="Book cover"
                    width={100}
                    height={150}
                    className="rounded-md"
                />
                <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <select
                                    className="border border-input bg-transparent rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring outline-none"
                                    {...field}
                                    onChange={(event) => field.onChange(event.target.value)}
                                >
                                    <option value="" disabled>
                                        Select a type of book
                                    </option>
                                    <option value="novel">Novel</option>
                                    <option value="comic">Comic</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <select
                                    className="border border-input bg-transparent rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring outline-none"
                                    {...field}
                                    onChange={(event) => {
                                        field.onChange(event.target.value)
                                        setStatus(event.target.value)
                                    }}
                                    value={field.value}
                                >
                                    <option value="" disabled>
                                        Select the reading status
                                    </option>
                                    <option value="reading">Reading</option>
                                    <option value="read">Read</option>
                                    <option value="toRead">To read</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {(status == "reading" || status == "read") && (
                    <Controller
                        control={form.control}
                        name="initDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start read date</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Init date"
                                        type="date"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {status == "read" && (
                    <>
                        <Controller
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End read date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="End date"
                                            type="date"
                                            {...field}
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
                                        <Textarea placeholder="Review of the book" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <Button type="submit">Send</Button>
            </form>
        </Form>
    );
}

export { FormExternalBooks };
