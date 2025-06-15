import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import ReactStars from "react-stars";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    duration: z.number().min(1, "Duration must be at least 1 hour"),
    released: z.coerce.date().refine(date => date <= new Date(), "Release date cannot be in the future"),
    description: z.string().min(1, "Description is required"),
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
    rating: z.number().min(0).max(10).optional(),
    review: z.string().optional(),
    image: z.any().optional(), 
});

function FormVideogames() {

    const [image, setImage] = useState<File | null>(null)
    const [status, setStatus] = useState<string>("To Play");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            duration: 1,
            released: new Date(),
            description: "",
            platform: "PC",
            status: "To Play",
            initDate: undefined,
            endDate: undefined,
            rating: undefined,
            review: "",
            image: null, 
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
        fetch("/api/videogames", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload()
                }

            }
            )
            .catch((error) => {
                console.error("Error:", error);
            }
            );
        form.reset()
    };

    return (
        <FormProvider {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Title" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Duration in hours"
                                    min={1}
                                    onChange={(event) => field.onChange(+event.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="released"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Release Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    placeholder="Release Date"
                                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
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
                                <Textarea placeholder="Description of the videogame" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>platform</FormLabel>
                            <FormControl>
                                <select
                                    className="border border-input bg-transparent rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring outline-none"
                                    {...field}
                                    onChange={(event) => field.onChange(event.target.value)}
                                >
                                    <option value="" disabled>
                                        Select a platform
                                    </option>
                                    <option value="PC">PC</option>
                                    <option value="PS2">PS2</option>
                                    <option value="PS3">PS3</option>
                                    <option value="Wii U">Wii U</option>
                                    <option value="Switch">Switch</option>
                                    <option value="PSP">PSP</option>
                                    <option value="Nitendo DS">Nitendo DS</option>
                                    <option value="Nintendo 3DS">Nintendo 3DS</option>
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
                                    onChange={(event) => { field.onChange(event.target.value); setStatus(event.target.value) }}
                                >
                                    <option value="" disabled>
                                        Select a status
                                    </option>
                                    <option value="To Play">To Play</option>
                                    <option value="Playing">Playing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Finished">Finished</option>
                                    <option value="Dropped">Dropped</option>
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
                {(status === 'Playing' || status === "Completed" || status == "Finished") && (
                    <FormField
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
                        <FormField
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
        </FormProvider>
    )

}

export { FormVideogames }