import Image from "next/image"
import { Mail, Github, Linkedin } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  image: string
}

function TeamMember({ name, role, bio, image }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{bio}</p>
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <Button variant="outline" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Github className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Linkedin className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Vishal",
      role: "Co-Founder & CEO",
      bio: "Vishal is a passionate programmer. He programmed the UI for Byte2Bite, hoping the vision to connect people with their favorite local restaurants.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Vaibhav",
      role: "Co-Founder & CTO",
      bio: "Vaibhav is a tech enthusiast with expertise in building scalable applications. He leads the backend team at Byte2Bite, ensuring a seamless experience for users and restaurant partners.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Alex",
      role: "Chief Marketing Officer",
      bio: "Alex brings creative marketing strategies to Byte2Bite. With a background in digital marketing, he helps restaurants grow their business through our platform.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">About Byte2Bite</h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-700">
          Byte2Bite was founded in 2022 with a simple mission: to connect hungry people with the best local restaurants.
          We believe that good food should be accessible to everyone, and our platform makes ordering food as easy as a
          few clicks.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Mission</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We connect customers with local restaurants, creating a community around great food.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deliver</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We ensure fast, reliable delivery so your food arrives hot and fresh every time.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We support local businesses by providing them with the tools to reach more customers.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} name={member.name} role={member.role} bio={member.bio} image={member.image} />
          ))}
        </div>
      </div>
    </div>
  )
}

