import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchDashboardSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dashboard/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};
