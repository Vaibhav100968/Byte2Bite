"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";

export default function ReportIssue() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    issueType: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, issueType: value }));
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.subject || !formData.issueType || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Issue Reported Successfully",
        description:
          "Your issue has been reported. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        subject: "",
        issueType: "",
        description: "",
      });
      setScreenshot(null);
      setScreenshotPreview(null);

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Report an Issue</CardTitle>
          <CardDescription>
            Let us know if you're experiencing any problems with your business
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.issueType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="order">
                      Order Management Issue
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about the issue"
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="screenshot">Upload Screenshot (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {screenshotPreview ? (
                    <div className="relative">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeScreenshot}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload a screenshot or drag and drop
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2"
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FF7F50] hover:bg-[#FF6B3D]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
