import { ImageAnalyzer } from "@/components/image-analyzer";

export default function BusinessAnalyzePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Inventory Analyzer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a photo of your inventory and let our AI automatically count
            and identify all items. This will update your inventory database
            automatically, making stock management effortless.
          </p>
        </div>

        <ImageAnalyzer />
      </div>
    </div>
  );
}
