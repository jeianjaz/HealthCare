import axios from 'axios';
import { getCsrfToken } from '@/utils/csrf';
import { ConsultationRequest } from '@/types/schedule';

export type { ConsultationRequest };

export interface CreateConsultationRequest {
  patient_id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  symptoms: string;
  duration: string;
  additional_notes: string;
}

export const consultationApi = {
  createRequest: async (data: {
    patient: string;
    doctor: string;
    date: string;
    start_time: string;
    end_time: string;
    symptoms: string;
    duration: string;
    additional_notes: string;
  }) => {
    const requestData = {
      patient_id: data.patient,
      doctor_id: data.doctor,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      symptoms: data.symptoms,
      duration: data.duration,
      additional_notes: data.additional_notes,
    };

    const response = await axios.post('/api/consultation-request/create_request/', requestData, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
    });
    return response.data;
  },
  getRequests: async (date?: Date, status?: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const params: any = {};
      
      if (date) {
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        params.date = localDate.toISOString().split('T')[0];
      }
      if (status) {
        params.status = status;
      }
      
      const response = await axios.get('/api/consultation-request/', {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-CSRFToken': getCsrfToken(),
        }
      });
      console.log('Consultation requests:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      throw error;
    }
  },
  getUpcomingConsultation: async (patientId: string) => {
    return null;
    // For production, uncomment this:
    // const response = await axios.get(`/api/consultations/upcoming/${patientId}`, {
    //   headers: {
    //     'X-CSRF-Token': await getCsrfToken(),
    //   },
    // });
    // return response.data;

  },
  updateRequestStatus: async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.patch(
        `/api/consultation-request/${id}/update_status/`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-CSRFToken': getCsrfToken(),
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating consultation request status:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to update status');
      }
      throw error;
    }
  },


  // Consultation Records! NININININI
  createConsultationRecord: async (roomId: string, retryCount = 0) => {
    const MAX_RETRIES = 2;
    const token = localStorage.getItem('accessToken');
    
    if (retryCount >= MAX_RETRIES) {
      throw new Error('Max retries reached for creating consultation record');
    }

    try {
      // First try to get existing record
      const existingRecord = await consultationApi.getRecordByRoomId(roomId, true);
      if (existingRecord) {
        return existingRecord;
      }

      console.log('Fetching schedule for room:', roomId);
      const scheduleResponse = await axios.get(`/api/schedule/by-room/${roomId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const scheduleId = scheduleResponse.data?.data?.id || scheduleResponse.data?.id;
      if (!scheduleId) {
        throw new Error('No schedule found for room');
      }

      const response = await axios.post(
        `/api/consultation-record/create_record/`,
        { consultation: scheduleId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 && error.response?.data?.errors?.consultation?.[0]?.includes('already exists')) {
          return consultationApi.getRecordByRoomId(roomId, true);
        }
        console.error('API Error:', error.response?.data);
      }
      throw error;
    }
  },

  getRecordByRoomId: async (roomId: string, isRetry = false) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`/api/consultation-record/get_room_record/`, {
        params: { room: roomId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
        // Only retry create if explicitly a 404
        if (error.response?.status === 404 && !isRetry) {
          return consultationApi.createConsultationRecord(roomId, 0);
        }
      }
      throw error;
    }
  },

  updateConsultationNotes: async (recordId: string, data: { consultation_notes: string }) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.patch(
      `/api/consultation-record/${recordId}/update_notes/`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  getConsultationNotes: async (recordId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`/api/consultation-record/${recordId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.consultation_notes;
  },

};

export default consultationApi;