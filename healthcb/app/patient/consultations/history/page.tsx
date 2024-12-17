"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar, ClipboardList, Stethoscope, Pill, Heart } from "lucide-react";

interface ConsultationHistory {
  id: string;
  date: string;
  doctorName: string;
  postConsultation: string;
  diagnosis: string;
  prescribedMedications: string;
  treatmentPlan: string;
}

export default function ConsultationHistory() {
  const [history, setHistory] = useState<ConsultationHistory[]>([]);

  useEffect(() => {
    const mockHistory = [
      {
        id: "1",
        date: new Date().toISOString(),
        doctorName: "Dr. Smith",
        postConsultation: "Patient reported improvement in symptoms",
        diagnosis: "Mild upper respiratory infection",
        prescribedMedications: "Amoxicillin 500mg - 3x daily for 7 days",
        treatmentPlan: "Rest, increased fluid intake, follow-up in 1 week if symptoms persist",
      },
    ];
    setHistory(mockHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Consultation History
            </h1>
            <p className="text-gray-600 text-lg">
              View your past consultations and medical records
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {history.map((consultation) => (
            <Card key={consultation.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <CardHeader className="bg-blue-50 border-b border-blue-100 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-blue-900">
                      {consultation.doctorName}
                    </CardTitle>
                    <CardDescription className="flex items-center text-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(consultation.date), "PPPP")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="p-6 grid gap-6">
                {/* Post-Consultation Notes */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3 text-blue-700">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-lg">Post-Consultation Notes</h3>
                  </div>
                  <p className="text-gray-700 ml-7">
                    {consultation.postConsultation}
                  </p>
                </div>

                {/* Diagnosis */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3 text-purple-700">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-lg">Diagnosis</h3>
                  </div>
                  <p className="text-gray-700 ml-7">
                    {consultation.diagnosis}
                  </p>
                </div>

                {/* Prescribed Medications */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3 text-emerald-700">
                    <Pill className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-lg">Prescribed Medications</h3>
                  </div>
                  <p className="text-gray-700 ml-7">
                    {consultation.prescribedMedications}
                  </p>
                </div>

                {/* Treatment Plan */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3 text-amber-700">
                    <Heart className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-lg">Treatment Plan</h3>
                  </div>
                  <p className="text-gray-700 ml-7">
                    {consultation.treatmentPlan}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
