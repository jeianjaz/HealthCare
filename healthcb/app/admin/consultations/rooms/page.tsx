'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { scheduleApi } from '@/services/scheduleApi';
import { Schedule } from '@/types/schedule';
import { format } from 'date-fns';

const ScheduleSkeleton = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex justify-between items-start gap-6 animate-pulse">
      <div className="space-y-3 w-full">
        <div className="pb-3 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded w-24"></div>
    </div>
  );
};

const RoomsPage = () => {
  const [bookedSchedules, setBookedSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.slice(0, 5).split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchBookedSchedules = async () => {
      try {
        const schedules = await scheduleApi.getBookedSchedules();
        setBookedSchedules(schedules);
        console.log('Booked schedules:', schedules);
      } catch (error) {
        console.error('Failed to fetch booked schedules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSchedules();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    router.push(`/admin/consultations/rooms/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl mb-4">Booked Schedules</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <ScheduleSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Booked Schedules</h2>
      <div className="space-y-4">
        {bookedSchedules.map(schedule => (
          <div key={schedule.id} className="p-6 bg-white rounded-lg shadow-md flex justify-between items-start gap-6">
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xl font-semibold text-[#1A202C]">
                  {formatDate(schedule.attributes.date)}
                </p>
                <p className="text-lg text-[#1A202C] mt-1">
                  {formatTime(schedule.attributes.start_time)} - {formatTime(schedule.attributes.end_time)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[#1A202C] font-medium flex items-center gap-2">
                  <span className="text-gray-500">Doctor:</span>
                  <span>{schedule.attributes.doctor?.attributes?.name || 'N/A'}</span>
                </p>
                <p className="text-[#1A202C] font-medium flex items-center gap-2">
                  <span className="text-gray-500">Patient:</span>
                  <span>{schedule.attributes.patient?.attributes?.name || 'N/A'}</span>
                </p>
                <p className="text-[#1A202C] font-medium flex items-center gap-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`${getStatusColor(schedule.attributes.status)} px-3 py-1 rounded-full text-sm font-medium capitalize`}>
                    {schedule.attributes.status}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => handleJoinRoom(schedule.attributes.room)}
              className="px-6 py-3 bg-[#ABF600] text-[#1A202C] rounded-lg hover:bg-[#9DE100] transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              Join Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;