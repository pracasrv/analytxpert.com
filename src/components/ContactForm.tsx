import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "7019f52d-9fde-4b36-a505-f37e877f8270",
          name: data.name,
          email: data.email,
          company: data.company || "Not provided",
          message: data.message,
          subject: "New Contact Form Submission - AnalytXpert",
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Something went wrong. Please try again or email directly.");
      }
    } catch {
      alert("Something went wrong. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Name *</label>
        <Input {...register("name")} placeholder="Your name" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Email *</label>
        <Input {...register("email")} type="email" placeholder="you@company.com" />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Company</label>
        <Input {...register("company")} placeholder="Your company name" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Message *</label>
        <Textarea {...register("message")} placeholder="Tell us about your business and what you're looking for..." rows={6} />
        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
      {submitSuccess && (
        <p className="text-sm text-primary text-center">Message sent successfully! I'll get back to you soon.</p>
      )}
    </form>
  );
}
