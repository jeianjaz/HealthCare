export interface ConsultationRequest {
  type: string;
  id: string;
  attributes: {
    date: string;
    start_time: string;
    end_time: string;
    symptoms: string;
    duration: string;
    additional_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
    doctor_details: {
      AccountID: number;
      EmployeeID: string;
    };
    relationships: {
      patient: {
        type: string;
        id: string;
        attributes: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          contact_number: string;
        }
      };
      doctor: {
        data: {
          type: string;
          id: string;
        }
      };
    };
  };
}

export interface Schedule {
  id: string;
  attributes: {
    date: string;
    start_time: string;
    end_time: string;
    status: 'available' | 'booked' | 'blocked';
    created_at?: string;
    updated_at?: string;
  };
}