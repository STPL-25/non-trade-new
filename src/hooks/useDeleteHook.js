import { useState } from 'react';
import axios from 'axios';

const useDelete = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (url, payload = null, config = {}) => {
    const source = axios.CancelToken.source();
    console.log("Deleting data at:", url);
    
    try {
      setLoading(true);
      setError(null);
      setData(null);

      // Correct way to pass payload and config to axios.delete
      const response = await axios.delete(url, {
        ...config,
        data: payload, // Include payload in the data property
        cancelToken: source.token
      });
    console.log(response)
      setData(response.data);
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { 
    data, 
    loading, 
    error, 
    deleteData, 
    reset 
  };
};

export default useDelete;
