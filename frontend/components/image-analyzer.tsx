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
import { Loader2, Upload, Camera, FileImage, X, TestTube } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import {
  api,
  InventoryAnalysisResult,
  ApiError,
  TestInventoryResponse,
} from "../lib/api";

export function ImageAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSendingTestData, setIsSendingTestData] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<InventoryAnalysisResult | null>(null);
  const [testResult, setTestResult] = useState<TestInventoryResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Debug effect
  useEffect(() => {
    if (analysisResult) {
      console.log("Analysis result updated:", analysisResult);
    }
  }, [analysisResult]);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      setError(null);

      console.log("Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera for computers
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      console.log("Camera stream obtained:", stream);
      streamRef.current = stream;

      // Set showCamera first to ensure video element is rendered
      setShowCamera(true);

      // Wait a bit for the video element to be rendered
      setTimeout(() => {
        if (videoRef.current) {
          console.log("Setting video source...");
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => {
              console.log("Video started playing");
            })
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        } else {
          console.error("Video ref is still null after timeout");
        }
      }, 100);
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setError(`Unable to access camera: ${error.message}`);
      toast({
        title: "Camera Error",
        description: `Unable to access camera: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a File object from the blob
              const file = new File([blob], "camera-capture.jpg", {
                type: "image/jpeg",
              });
              handleImageSelect(file);

              // Stop camera after capture
              stopCamera();

              toast({
                title: "Success",
                description: "Image captured successfully!",
              });
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const handleCameraCapture = () => {
    if (showCamera) {
      captureImage();
    } else {
      startCamera();
    }
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
      console.log("API Response:", result);
      console.log("Response type:", typeof result);
      console.log("Response keys:", Object.keys(result));
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

  const sendTestData = async () => {
    setIsSendingTestData(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await api.sendTestInventoryData();
      setTestResult(result);
      toast({
        title: "Success",
        description:
          "Test inventory data sent successfully! Excel report generated.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to send test data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingTestData(false);
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
            Upload an image or capture with camera to automatically count and
            identify inventory items using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Interface */}
          {showCamera && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-h-96 object-cover rounded-lg border"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button
                    onClick={captureImage}
                    className="bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="destructive" size="lg">
                    Cancel
                  </Button>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Image Upload Area */}
          {!showCamera && (
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
                  disabled={isCapturing}
                  className="flex-1"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting Camera...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

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

          {/* Test Data Button */}
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={sendTestData}
              disabled={isSendingTestData}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isSendingTestData ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Test Data...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test Inventory Data
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will add sample food items to your inventory and generate an
              Excel report
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Display */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>Test Data Results</CardTitle>
            <CardDescription>
              Test inventory items added successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ {testResult.message}
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Excel report generated: {testResult.filename}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testResult.updated_items.map((item) => (
                <div
                  key={item.name}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{item.name}</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {item.count}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Total Added: {item.total_added}</div>
                    <div>Current Quantity: {item.current_quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
