
export const registerVolunteer = async (formData: any) => {
  try {
    const response = await fetch(`/api/volunteers/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};