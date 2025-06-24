"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Camera, FileImage, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { api, InventoryAnalysisResult, ApiError } from "@/lib/api";

export function ImageAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<InventoryAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Debug effect
  useEffect(() => {
    if (analysisResult) {
      console.log("Analysis result updated:", analysisResult);
    }
  }, [analysisResult]);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError(null);
      setAnalysisResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file");
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleCameraCapture = () => {
    // This would need to be implemented with getUserMedia API
    toast({
      title: "Camera Capture",
      description: "Camera capture feature coming soon!",
    });
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    if (!user) {
      setError("Please log in to use this feature");
      toast({
        title: "Authentication Required",
        description: "Please log in to use the image analysis feature",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await api.analyzeImage(image);
      console.log("API Response:", result); // Debug log
      console.log("Response type:", typeof result); // Debug log
      console.log("Response keys:", Object.keys(result)); // Debug log
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Image analysis completed successfully!",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast({
          title: "Analysis Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError("An unexpected error occurred");
        toast({
          title: "Analysis Failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Inventory Image Analyzer
          </CardTitle>
          <CardDescription>
            Upload an image to automatically count and identify inventory items
            using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Area */}
          <div className="space-y-4">
            <Label htmlFor="image-upload">Select Image</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                imagePreview
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 max-w-full rounded-lg shadow-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {image?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Supports JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Button
                variant="outline"
                onClick={handleCameraCapture}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeImage}
            disabled={!image || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Analyze Inventory
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Inventory items found in the image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                // Handle the nested structure where items are inside an "items" object
                let itemsToDisplay: Array<{ name: string; count: number }> = [];

                if (
                  analysisResult.items &&
                  typeof analysisResult.items === "object"
                ) {
                  // If there's an "items" object, extract the items from it
                  itemsToDisplay = Object.entries(analysisResult.items).map(
                    ([itemName, itemData]) => {
                      const count =
                        typeof itemData === "number"
                          ? itemData
                          : itemData &&
                            typeof itemData === "object" &&
                            "count" in itemData
                          ? (itemData as any).count
                          : 0;
                      return { name: itemName, count };
                    }
                  );
                } else {
                  // Fallback to the original structure
                  itemsToDisplay = Object.entries(analysisResult).map(
                    ([item, count]) => {
                      let itemCount = 0;
                      let itemName = item;

                      if (typeof count === "number") {
                        itemCount = count;
                      } else if (typeof count === "object" && count !== null) {
                        const countObj = count as any;
                        if (
                          countObj.count &&
                          typeof countObj.count === "number"
                        ) {
                          itemCount = countObj.count;
                        } else {
                          const firstValue = Object.values(count)[0];
                          itemCount =
                            typeof firstValue === "number" ? firstValue : 0;
                        }

                        if (
                          countObj.name &&
                          typeof countObj.name === "string"
                        ) {
                          itemName = countObj.name;
                        }
                      }

                      return { name: itemName, count: itemCount };
                    }
                  );
                }

                return itemsToDisplay.map(({ name, count }) => (
                  <div
                    key={name}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{name}</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {count}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Summary
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Total items found:{" "}
                {(() => {
                  let totalCount = 0;
                  if (
                    analysisResult.items &&
                    typeof analysisResult.items === "object"
                  ) {
                    totalCount = Object.values(analysisResult.items).reduce(
                      (sum: number, itemData: any) => {
                        const count =
                          typeof itemData === "number"
                            ? itemData
                            : itemData &&
                              typeof itemData === "object" &&
                              "count" in itemData
                            ? itemData.count
                            : 0;
                        return sum + count;
                      },
                      0
                    );
                  } else {
                    totalCount = Object.values(analysisResult).reduce(
                      (sum, count) => {
                        let itemCount = 0;
                        if (typeof count === "number") {
                          itemCount = count;
                        } else if (
                          typeof count === "object" &&
                          count !== null
                        ) {
                          const countObj = count as any;
                          if (
                            countObj.count &&
                            typeof countObj.count === "number"
                          ) {
                            itemCount = countObj.count;
                          } else {
                            const firstValue = Object.values(count)[0];
                            itemCount =
                              typeof firstValue === "number" ? firstValue : 0;
                          }
                        }
                        return sum + itemCount;
                      },
                      0
                    );
                  }
                  return totalCount;
                })()}
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Unique items:{" "}
                {(() => {
                  if (
                    analysisResult.items &&
                    typeof analysisResult.items === "object"
                  ) {
                    return Object.keys(analysisResult.items).length;
                  }
                  return Object.keys(analysisResult).length;
                })()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
