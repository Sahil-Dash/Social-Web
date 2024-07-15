import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { postValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
// import { useToast } from "../ui/use-toast"
import { useCreatePost } from "@/lib/react-query/query";
import { userAtom } from "@/lib/recoilStateManager/currentUser";
import { useRecoilValue } from "recoil";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: any;
  currentUser?: any;
};

const Postform = ({ post, currentUser }: PostFormProps) => {
  const navigate = useNavigate();
  // const {toast} = useToast()
  currentUser = useRecoilValue(userAtom);

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();

  // 1. Define your form.
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const convertImageToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(null);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof postValidation>,
    postData: any
  ) {
    const base64String = await convertImageToBase64(values.file[0]);

    postData = {
      username: currentUser.username,
      user_email: currentUser.email,
      caption: values.caption,
      image: base64String,
      location: values.location,
      tags: values.tags,
    };

    const response = await createPost(postData);

    console.log(response);

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Post</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
                {/* <Input type="file" className="shad-input" {...field} /> */}
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by ',' commas )
              </FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            className="shad-button_dark_4"
            onClick={() => navigate("/")}
            type="button"
            disabled={isCreatingPost}
          >
            Cancel
          </Button>
          <Button
            className="shad-button_primary whitespace-nowrap"
            type="submit"
            disabled={isCreatingPost}
          >
            <p>
              {isCreatingPost ? (
                <div className="flex-center">
                  Loading... <Loader />
                </div>
              ) : (
                "Submit"
              )}
            </p>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Postform;
