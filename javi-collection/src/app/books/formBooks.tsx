import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

const formSchema = z.object({
    title: z.string().min(1, { message: "The title is required" }),
    writer: z.string().min(1, { message: "The author is required" }),
    pages: z.number().min(1, { message: "The number of pages is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.enum(["novel", "comic", "manga"], { message: "The type is required" }),
    status: z.enum(["reading", "read", "toRead"], { message: "The state is required" }),
    initDate: z.date().optional(),
    endDate: z.date().optional(),
    rating: z.number().optional(),
    review: z.string().optional(),
})

function FormBooks() {

    const [status, setStatus] = useState('toRead');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            writer: "",
            pages: 0,
            description: "",
            initDate: new Date(),
            type: "novel",
            status: "toRead",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if(res.ok){
                    window.location.reload()
                }
                else{
                    console.error('Error adding book');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            }
            )
        form.reset();

    }


    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
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
                            <FormLabel>Author</FormLabel>
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
                                <Input placeholder="Number of pages" type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                <Select onValueChange={value => setStatus(value)}>
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
                {(status == 'reading' || status == 'read') && (
                    <FormField
                        control={form.control}
                        name="initDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start read date</FormLabel>
                                <FormControl>
                                    <Input placeholder="Init date" type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {status == 'read' && (
                    <>
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End read date</FormLabel>
                                    <FormControl>
                                        <Input placeholder="End date" type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Rating" type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
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
        </FormProvider>
    );
}

export { FormBooks }