import * as z from "zod"


export const signUpValidation = z.object({
    name: z.string().min(2,{message:"Too Short, minimum 2 characters"}),
    username: z.string().min(2,{message:"Too Short, minimum 2 characters"}),
    email: z.string().email(),
    password: z.string().min(8,{message:"Too Short, minimum 8 characters"})
})

export const signInValidation = z.object({
    username: z.string(),
    password: z.string().min(8,{message:"Too Short, minimum 8 characters"})
})

export const postValidation = z.object({
    caption:z.string().min(5).max(2200),
    file:z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags:z.string()
})