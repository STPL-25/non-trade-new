import { useState } from 'react';
import axios from 'axios';

const useUpdate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (url, query, payload = null, config = {}) => {
    const source = axios.CancelToken.source();
    
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const endpoint = query ? `${url}/${query}` : url;
      console.log(endpoint);
      
      const response = await axios.put(endpoint, payload, {
        ...config,
        cancelToken: source.token
      });

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

  const patchData = async (url, payload = null, config = {}) => {
    const source = axios.CancelToken.source();
    console.log("Patching data at:", url, "with payload:", payload);
    
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const response = await axios.patch(url, payload, {
        ...config,
        cancelToken: source.token
      });

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

  return { data, loading, error, updateData, patchData, reset };
};

export default useUpdate;
