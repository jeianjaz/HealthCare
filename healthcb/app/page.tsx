"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  CalendarIcon, 
  VideoIcon, 
  ClockIcon, 
  ShieldIcon, 
  UsersIcon, 
  HeartIcon, 
  StarIcon, 
  MapPinIcon, 
  HandIcon, 
  AwardIcon, 
  TargetIcon, 
  UserPlusIcon 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BackgroundElements from "@/components/BackgroundElements";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import GradientWaves from "@/components/GradientWaves";
import VolunteerApplicationModal from "@/components/Modals/VolunteerApplicationModal";

const features = [
  {
    icon: <CalendarIcon className="w-8 h-8" />,
    title: "Easy Scheduling",
    description: "Book appointments with healthcare providers quickly and efficiently.",
    date: "Available 24/7",
    category: "Service",
    image: "/features/EZSCHED.jpg"
  },
  {
    icon: <VideoIcon className="w-8 h-8" />,
    title: "Virtual Consultations",
    description: "Connect with doctors remotely through secure video calls.",
    date: "Available 24/7",
    category: "Technology",
    image: "/features/VIDEO.jpg"
  },
  {
    icon: <ClockIcon className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Access healthcare support and emergency services anytime.",
    date: "Always Active",
    category: "Support",
    image: "/features/24.jpg"
  },
  {
    icon: <ShieldIcon className="w-8 h-8" />,
    title: "Secure Platform",
    description: "Your health data is protected with enterprise-grade security.",
    date: "Continuous",
    category: "Security",
    image: "/features/SECURE.jpg"
  },
  {
    icon: <UsersIcon className="w-8 h-8" />,
    title: "Expert Doctors",
    description: "Access a network of qualified healthcare professionals.",
    date: "Available Daily",
    category: "Healthcare",
    image: "/features/EXPERT.jpg"
  },
  {
    icon: <HeartIcon className="w-8 h-8" />,
    title: "Health Tracking",
    description: "Monitor your health metrics and track your progress.",
    date: "Real-time",
    category: "Wellness",
    image: "/features/TRACK.jpg"
  }
];

const doctors = [
  {
    name: "Dr. Noah Bombalistic",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 128,
    location: "Arsenia Maximo Health Center",
    experience: "15+ years",
    image: "/doctor/default1.jpg",
    availability: "Mon, Wed, Fri",
    education: "University of the Philippines"
  },
  {
    name: "Dr. Doofensmirtz",
    specialty: "Neurologist",
    rating: 4.8,
    reviews: 96,
    location: "Arsenia Maximo Health Center",
    experience: "12+ years",
    image: "/doctor/default2.jpg",
    availability: "Tue, Thu, Sat",
    education: "University of the Philippines"
  },
  {
    name: "Dr. Black Man",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 156,
    location: "Arsenia Maximo Health Center",
    experience: "18+ years",
    image: "/doctor/default3.jpg",
    availability: "Mon, Tue, Thu",
    education: "University of the Philippines"
  }
];

const volunteerOpportunities = [
  {
    icon: <HeartIcon className="w-8 h-8" />,
    title: "Healthcare Support",
    category: "Medical",
    description: "Assist healthcare professionals and provide support to patients.",
    commitment: "10 hours/week",
    impact: "Direct Patient Care",
    requirements: ["Medical Background", "Compassionate", "Good Communication"],
    color: "from-[#FF6B6B]/10 to-[#FFE1E1]/20",
    hoverColor: "group-hover:from-[#FF6B6B]/20 group-hover:to-[#FFE1E1]/30",
    iconColor: "text-[#FF6B6B]",
    buttonGradient: "from-[#FF6B6B] to-[#FF8E8E]"
  },
  {
    icon: <UsersIcon className="w-8 h-8" />,
    title: "Community Outreach",
    category: "Social",
    description: "Engage with the community and promote health awareness.",
    commitment: "8 hours/week",
    impact: "Community Education",
    requirements: ["People Skills", "Organized", "Reliable"],
    color: "from-[#4ECDC4]/10 to-[#A1F4EC]/20",
    hoverColor: "group-hover:from-[#4ECDC4]/20 group-hover:to-[#A1F4EC]/30",
    iconColor: "text-[#4ECDC4]",
    buttonGradient: "from-[#4ECDC4] to-[#6FE7DF]"
  },
  {
    icon: <ClockIcon className="w-8 h-8" />,
    title: "Administrative Support",
    category: "Operations",
    description: "Help with scheduling, data entry, and office organization.",
    commitment: "12 hours/week",
    impact: "Operational Efficiency",
    requirements: ["Computer Skills", "Detail-oriented", "Professional"],
    color: "from-[#9B6FFF]/10 to-[#CDB0FF]/20",
    hoverColor: "group-hover:from-[#9B6FFF]/20 group-hover:to-[#CDB0FF]/30",
    iconColor: "text-[#9B6FFF]",
    buttonGradient: "from-[#9B6FFF] to-[#B18AFF]"
  }
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const router = useRouter();

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <BackgroundDecoration />
      <BackgroundElements />
      <Navbar />
      
      <section id="home" className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1A202C] mb-6 leading-tight">
                Your Health Journey <br />
                <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text">Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience modern healthcare that puts you first. Connect with top healthcare professionals,
                manage your appointments, and take control of your well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => router.push('/patient/login')}
                  className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] hover:opacity-90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="relative w-full h-[500px]">
                <Image
                  src="/medicine-unscreen.gif"
                  alt="Healthcare Dashboard"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-white to-[#7FD6FB]/10">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-center"
            >
              <h2 className="text-4xl font-bold text-[#1A202C] mb-6">
                About <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text">HealthCare</span>
              </h2>
              <p className="text-gray-600 mb-6">
                The <strong><i>Barangay Sta. Monica Health Care Management System</i></strong> aims to provide a modern digital solution tailored to the unique healthcare needs of Barangay Sta. Monica in Novaliches, Quezon City. By transitioning from a manual, paper-based system to an efficient digital platform, the project seeks to enhance the quality and accessibility of grassroots healthcare services.
              </p>
              <p className="text-gray-600">
                The system will automate essential processes such as patient record management, scheduling, and resource tracking, reducing operational inefficiencies and improving service delivery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events/Features Section */}
      <section id="events" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text">Features</span>
            </h2>
            <p className="text-xl text-gray-600">
              Discover the innovative features that make our healthcare platform unique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {feature.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-r from-[#79CEED] to-[#06AFEC]/20 rounded-xl text-accent-blue">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A202C]">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feature.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="py-20 bg-gradient-to-br from-white to-[#7FD6FB]/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text font-semibold mb-4 block">Make a Difference</span>
            <h2 className="text-4xl font-bold text-[#1A202C] mb-4">
              Volunteer <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of dedicated volunteers and help make healthcare accessible to everyone. 
              Your time and skills can make a real difference in people's lives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {volunteerOpportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.color} ${opportunity.hoverColor} transition-all duration-300`} />

                <div className="relative p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-4 rounded-xl bg-white shadow-md ${opportunity.iconColor}`}
                    >
                      {opportunity.icon}
                    </motion.div>
                    <div>
                      <span className={`text-sm font-semibold ${opportunity.iconColor} block mb-1`}>
                        {opportunity.category}
                      </span>
                      <h3 className="text-xl font-bold text-[#1A202C]">
                        {opportunity.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {opportunity.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <ClockIcon className={`w-5 h-5 ${opportunity.iconColor}`} />
                      <span className="text-sm text-gray-600">Commitment: {opportunity.commitment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TargetIcon className={`w-5 h-5 ${opportunity.iconColor}`} />
                      <span className="text-sm text-gray-600">Impact: {opportunity.impact}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#1A202C]">Requirements:</p>
                    {opportunity.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-current ${opportunity.iconColor}`} />
                        <span className="text-sm text-gray-600">{req}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                              bg-gradient-to-r ${opportunity.buttonGradient} hover:opacity-90 text-white`}
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Apply Now
                  </motion.button>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10
                              bg-gradient-to-br ${opportunity.color} opacity-50 rounded-full
                              group-hover:scale-150 transition-transform duration-500`} />
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { icon: <UsersIcon className="w-8 h-8" />, value: "500+", label: "Active Volunteers", color: "text-[#FF6B6B]", gradient: "from-[#FF6B6B]/20 to-[#FFE1E1]/30" },
              { icon: <HandIcon className="w-8 h-8" />, value: "1000+", label: "Lives Impacted", color: "text-[#4ECDC4]", gradient: "from-[#4ECDC4]/20 to-[#A1F4EC]/30" },
              { icon: <CalendarIcon className="w-8 h-8" />, value: "50+", label: "Monthly Events", color: "text-[#9B6FFF]", gradient: "from-[#9B6FFF]/20 to-[#CDB0FF]/30" },
              { icon: <AwardIcon className="w-8 h-8" />, value: "98%", label: "Satisfaction Rate", color: "text-[#FF6B6B]", gradient: "from-[#FF6B6B]/20 to-[#FFE1E1]/30" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center ${stat.color}`}
                >
                  {stat.icon}
                </motion.div>
                <motion.h4
                  whileHover={{ scale: 1.05 }}
                  className={`text-3xl font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </motion.h4>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Application Modal */}
      {selectedOpportunity && (
        <VolunteerApplicationModal
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          opportunity={selectedOpportunity}
        />
      )}

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-gradient-to-br from-white to-[#7FD6FB]/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#1A202C] mb-4">
              Our Expert <span className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-transparent bg-clip-text">Doctors</span>
            </h2>
            <p className="text-xl text-gray-600">
              Meet our team of experienced healthcare professionals from <strong>Arsenia Maximo Health Center</strong>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    duration: 0.8,
                    delay: index * 0.2,
                    bounce: 0.4
                  }
                }}
                whileHover={{ 
                  y: -15,
                  scale: 1.02,
                  transition: { 
                    type: "spring", 
                    stiffness: 300,
                    damping: 10 
                  }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative"
              >
                <motion.div 
                  className="relative h-64 w-64 mx-auto overflow-hidden rounded-full mt-6 border-4 border-blue-500/30"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                      rotate: {
                        duration: 0.5,
                        repeat: 0
                      }
                    }
                  }}
                >
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover transform transition-transform duration-300"
                    priority={index < 2}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <StarIcon className="w-6 h-6 fill-blue-500 text-blue-500 drop-shadow-glow" />
                      </motion.div>
                      <motion.span 
                        className="font-semibold text-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        {doctor.rating}
                      </motion.span>
                      <motion.span 
                        className="text-sm"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        ({doctor.reviews} reviews)
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h3 
                    className="text-xl font-bold text-[#1A202C] mb-2 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {doctor.name}
                  </motion.h3>
                  <motion.p 
                    className="text-blue-500 font-semibold mb-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {doctor.specialty}
                  </motion.p>
                  <motion.div 
                    className="space-y-3 text-gray-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <MapPinIcon className="w-5 h-5 text-blue-500" />
                      <span>{doctor.location}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      <span>{doctor.availability}</span>
                    </motion.div>
                    <motion.p 
                      className="text-sm"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {doctor.experience} experience
                    </motion.p>
                    <motion.p 
                      className="text-sm"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {doctor.education}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button 
                      onClick={() => router.push('/patient/login')}
                      className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:shadow-lg"
                    >
                      Book Appointment
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1A202C] rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who have chosen our modern healthcare platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/patient/login')}
                className="bg-gradient-to-r from-[#79CEED] to-[#06AFEC] text-[#1A202C] hover:bg-blue-600 px-8 py-6 text-lg"
              >
                Sign In Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
