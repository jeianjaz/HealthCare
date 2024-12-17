import axios from 'axios';
import { getCsrfToken } from '@/utils/csrf';

export const scheduleApi = {
  addTimeSlot: async (data: {
    date: string;
    startTime: string;
    endTime: string;
    recurring: boolean;
    days?: string[];
  }) => {
    const token = localStorage.getItem('accessToken');
    const formattedData = {
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      recurring: data.recurring,
      recurring_days: data.days
    };
    
    const response = await axios.post('/api/schedule/add_time_slot/', formattedData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  blockTime: async (data: {
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const token = localStorage.getItem('accessToken');
    const formattedData = {
      start_date: data.startDate,
      end_date: data.endDate,
      reason: data.reason
    };
    
    const response = await axios.post('/api/schedule/block_time/', formattedData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  deleteTimeSlot: async (slotId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`/api/schedule/${slotId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status !== 204) {
      throw new Error('Failed to delete time slot');
    }
  },

  getSchedules: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/api/schedule/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  getAvailableSlots: async (date: Date) => {
    const token = localStorage.getItem('accessToken');
    const formattedDate = date.toLocaleDateString('en-CA');
    const response = await axios.get(`/api/schedule/available_slots/?date=${formattedDate}`, {
      withCredentials: true,
    });
    // Return the data directly without mapping here since it's being mapped in the component
    return response.data;
  },

  getBookedSchedules: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/api/schedule/booked_schedules/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data.data);
    return response.data.data;
  },

  getPatientBookedSchedules: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/api/schedule/patient_booked_schedules/', {
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
    });
    return response.data.data;
  },
};