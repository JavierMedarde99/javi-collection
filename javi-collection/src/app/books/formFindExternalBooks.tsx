import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormItem,
    FormLabel,
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
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

const books = [
    { value: "book1", label: "Book 1" },
    { value: "book2", label: "Book 2" },
    { value: "book3", label: "Book 3" },
] as const;

const FormSchema = z.object({
    book: z.string({
        required_error: "Please select a book.",
    }),
});

function FormExternalBooks() {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            book: "",
        },
    });

    return (
        <Form {...form}>
            <form>
                <Controller
                    name="book"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Book Name</FormLabel>
                            <Popover.Root open={open} onOpenChange={setOpen}>
                                <Popover.Trigger asChild>
                                    <Button variant="outline" role="combobox">
                                        {field.value
                                            ? books.find((book) => book.value === field.value)?.label
                                            : "Select book"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search language..." />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                <CommandGroup>
                                                    {books.map((book) => (
                                                        <CommandItem
                                                            value={book.value}
                                                            key={book.value}
                                                            onSelect={() => {
                                                                field.onChange(book.value);
                                                                setOpen(false); // Cierra el popover al seleccionar un libro
                                                            }}
                                                            className="text-sm"
                                                        >
                                                            {book.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </FormItem>
                    )}
                />
                <Button type="submit">Send</Button>
            </form>
        </Form>
    );
}

export { FormExternalBooks };
