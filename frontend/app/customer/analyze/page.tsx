import { ImageAnalyzer } from "@/components/image-analyzer";
import { CustomerNav } from "@/components/customer-nav";

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CustomerNav />
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AI Inventory Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a photo of your inventory and let our AI automatically count
            and identify all items. Perfect for quick stock takes and inventory
            management.
          </p>
        </div>

        <ImageAnalyzer />
      </div>
    </div>
  );
}
