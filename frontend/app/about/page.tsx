import Image from "next/image";

const cofounders = [
  {
    name: "Vaibhav Gollapalli",
    title: "Cofounder & CEO",
    description: "",
    image: "/vaibhav.png",
  },
  {
    name: "Azalea Tang",
    title: "Cofounder & CTO",
    description: "",
    image: "/azalea.png",
  },
  {
    name: "Vishal Jonnalgadda",
    title: "Cofounder & CTO",
    description: "",
    image: "vishal.jpg",
  },
  {
    name: "Aleksander Stevens",
    title: "Cofounder & Chief Marketing Officer",
    description: "",
    image: "alek.jpg",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-black">Byte</span>
            <span className="text-[#FF7F50]">2</span>
            <span className="text-black">Bite</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to reduce food waste while connecting restaurants
            with customers. Our platform helps businesses optimize their
            inventory and enables customers to enjoy great food while making a
            positive impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cofounders.map((cofounder, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-72 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={cofounder.image}
                  alt={cofounder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cofounder.name}
              </h3>
              <p className="text-[#FF7F50] font-medium mb-4">
                {cofounder.title}
              </p>
              <p className="text-gray-600">{cofounder.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
