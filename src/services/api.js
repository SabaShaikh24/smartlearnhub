// Frontend: src/services/api.js
export const fetchDashboardData = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};