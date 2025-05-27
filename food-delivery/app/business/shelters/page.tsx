// Mock data for shelters
const mockShelters = [
  {
    id: 1,
    name: "Hope Center",
    address: "123 Main St, City, State",
    distance: "0.5 miles",
    capacity: "50 people",
    contact: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Safe Haven Shelter",
    address: "456 Oak Ave, City, State",
    distance: "1.2 miles",
    capacity: "75 people",
    contact: "(555) 234-5678",
  },
  {
    id: 3,
    name: "Community Care Center",
    address: "789 Pine Rd, City, State",
    distance: "2.0 miles",
    capacity: "100 people",
    contact: "(555) 345-6789",
  },
];

export default function SheltersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nearby Shelters
              </h2>
              <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                {/* Placeholder for map */}
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Shelters List */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shelter List
              </h2>
              <div className="space-y-4">
                {mockShelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {shelter.name}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span>{" "}
                        {shelter.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Distance:</span>{" "}
                        {shelter.distance}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Capacity:</span>{" "}
                        {shelter.capacity}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Contact:</span>{" "}
                        {shelter.contact}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Contact Shelter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Premium Features
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Priority Matching</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Direct Communication</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Analytics Dashboard</span>
                  <span className="text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
