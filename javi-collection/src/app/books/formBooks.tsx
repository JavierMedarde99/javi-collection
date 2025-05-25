"use client"

import { FormProvider, useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import ReactStars from "react-stars"

// Update the schema to include an optional image field
const formSchema = z.object({
    title: z.string().min(1, { message: "The title is required" }),
    writer: z.string().min(1, { message: "The author is required" }),
    pages: z.number().min(1, { message: "The number of pages is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.enum(["novel", "comic", "manga"], { message: "The type is required" }),
    status: z.enum(["reading", "read", "toRead"], { message: "The state is required" }),
    initDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    rating: z.number().optional(),
    review: z.string().optional(),
    // We don't actually validate this with zod, just use it as a placeholder
    image: z.any().optional(),
})

function FormBooks({ bookValue }: { bookValue?: any }) {
    const [status, setStatus] = useState("toRead")
    const [image, setImage] = useState<File | null>(null)

    // Initialize form with default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: bookValue?.title || "",
            writer: bookValue?.writer || "",
            pages: bookValue?.pages || 0,
            description: bookValue?.description || "",
            type: bookValue?.type || "novel",
            status: bookValue?.status || "toRead",
            initDate: bookValue?.initDate ? new Date(bookValue.initDate) : undefined,
            endDate: bookValue?.endDate ? new Date(bookValue.endDate) : undefined,
            rating: bookValue?.rating || undefined,
            review: bookValue?.review || "",
            image: undefined,
        },
    })

    // Set the initial status from the form value
    useEffect(() => {
        if (bookValue?.status) {
            setStatus(bookValue.status)
        }
    }, [bookValue])

    function onSubmit(data: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append(
            "data",
            JSON.stringify({
                ...data,
                // Remove the image from the JSON data since we'll append it separately
                image: undefined,
            }),
        )
        if (image) {
            formData.append("image", image)
        }
        fetch("/api/books", {
            method: "POST",
            body: formData,
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

    function onSubmintUpdate(data: z.infer<typeof formSchema>, id: string) {
        const formData = new FormData()
        formData.append(
            "data",
            JSON.stringify({
                ...data,
                // Remove the image from the JSON data since we'll append it separately
                image: undefined,
            }),
        )
        if (image) {
            formData.append("image", image)
        }
        fetch("/api/books/" + id, {
            method: "PUT",
            body: formData,
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

    return (
        <FormProvider {...form}>
            <form
                onSubmit={
                    bookValue ? form.handleSubmit((data) => onSubmintUpdate(data, bookValue._id)) : form.handleSubmit(onSubmit)
                }
                encType="multipart/form-data"
                className="space-y-4"
            >
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
                                <Input
                                    placeholder="Number of pages"
                                    type="number"
                                    {...field}
                                    onChange={(event) => field.onChange(+event.target.value)}
                                />
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
                <FormField
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

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    id="picture"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setImage(file)
                                            field.onChange(file)
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(status == "reading" || status == "read") && (
                    <FormField
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
                        <FormField
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
                        <FormField
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
                <Button type="submit" className="mt-4">
                    Send
                </Button>
            </form>
        </FormProvider>
    )
}

export { FormBooks }
