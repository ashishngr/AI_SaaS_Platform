"use client"

// import axios from "axios";
// import * as z from "zod"
// import Heading from "@/components/Heading";
// import { MessageSquare } from "lucide-react";
// import { useForm } from "react-hook-form";
// import {formSchema} from "./constant";
// import {zodResolver} from "@hookform/resolvers/zod"; 
// import { Form,
//     FormControl,
//     FormField,
//     FormItem 
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { ChatCompletionRequestMessage } from "openai";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formSchema } from "./constant";

const ConversationPage = () => 
{
    const router = useRouter();
    // const proModal = useProModal();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: ""
      }
    });
  
    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
          const newMessages = [...messages, userMessage];
          
          const response = await axios.post('/api/conversation', { messages: newMessages });
          setMessages((current) => [...current, userMessage, response.data]);
          
          form.reset();
        } catch (error: any) {
          console.log(error)
        } finally {
          router.refresh();
        }
      }

    return(
        <div>
           <Heading 
           title="Conversation"
           description="Our most advance conversation model"
           icon={MessageSquare}
           iconColor="text-violet-500"
           bgColor="bg-color-500/10"
           />
           <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="
                        roundes-lg
                        border
                        w-full
                        p-4
                        px-3
                        md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap">
                            <FormField 
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-o p-0">
                                        <Input
                                        className="border-0 outline-none
                                        focus-visible:ring-0
                                        focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="How do I calculate the radius of circle"
                                        {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="flex flex-col-reverse gap-4">
                        {/* {messages.map((message)=>{
                            <div
                            key={message.content}>
                                {message.content}
                            </div>
                        })} */}
                    </div>
                </div>
           </div>
        </div>
    )
   
}
export default ConversationPage;
