// Frontend: src/services/api.js
export const fetchDashboardData = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};