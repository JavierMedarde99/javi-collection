import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const formSchema = z.object({
    title: z.string().min(1, { message: "El título es requerido" }),
    writer: z.string().min(1, { message: "El autor es requerido" }),
    pages: z.number().min(1, { message: "El número de páginas es requerido" }),
    description: z.string().min(1, { message: "La descripción es requerida" }),
    type: z.enum(["novel", "comic", "manga"],{message: "El estado es requerido"}),
    status: z.enum(["reading", "read", "toRead"],{message: "El estado es requerido"}),
    initDate: z.date().optional(),
    endDate: z.date().optional(),
    rating: z.number().optional(),
    review: z.string().optional(),
})

function FormBooks() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            writer: "",
            pages: 0,
            description: "",
            initDate: new Date(),
            type: undefined,
            status: undefined,
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }


    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Title of the book" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="writer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Autor</FormLabel>
                            <FormControl>
                                <Input placeholder="Author of the book" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pages</FormLabel>
                            <FormControl>
                                <Input placeholder="Number of pages" type="number" {...field} onChange={event => field.onChange(+event.target.value)}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description of the book" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={() => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type of book" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Type</SelectLabel>
                                        <SelectItem value="novel">Novel</SelectItem>
                                        <SelectItem value="comic">Comic</SelectItem>
                                        <SelectItem value="manga">Manga</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={() => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the reading status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>status</SelectLabel>
                                        <SelectItem value="reading">Reading</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                        <SelectItem value="toRead">To read</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Send</Button>
            </form>
        </FormProvider>
    );
}

export { FormBooks }