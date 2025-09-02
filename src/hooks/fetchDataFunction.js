
import { useState, useEffect } from 'react';
import axios from 'axios';
const fetchDataFunction=()=> {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const fetchData = async () => {

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/api/MasterItems`);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }     
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};

export default fetchDataFunction;
