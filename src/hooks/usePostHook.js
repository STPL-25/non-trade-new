// import { useState } from 'react';
// import axios from 'axios';

// const usePost = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
// const username = import.meta.env.VITE_USER_NAME;
// const password = import.meta.env.VITE_USER_PASSWORD;
//   const postData = async (url, payload = null, config = {}) => {
//     const source = axios.CancelToken.source();
//     try {
//       setLoading(true);
//       setError(null);
//       setData(null);
//       if (username && password) {
//           config.auth = {
//             username: username,
//             password: password
//           };
//         }
//       const response = await axios.post(url, payload, {
//         ...config,
//         cancelToken: source.token
//       });

//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       if (axios.isCancel(err)) {
//         console.log('Request cancelled');
//       } else {
//         const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
//         setError(errorMessage);
//         throw err;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setData(null);
//     setError(null);
//     setLoading(false);
//   };

//   return { 
//     data, 
//     loading, 
//     error, 
//     postData, 
//     reset 
//   };
// };

// export default usePost;


import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASSWORD;

  const postData = useCallback(async (url, payload = null, config = {}) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      setData(null);

      // Prepare config with auth if available
      const requestConfig = { ...config };
      
      // Only add auth if not already present in config
      if (username && password && !requestConfig.auth) {
        requestConfig.auth = {
          username: username,
          password: password
        };
      }

      // Add abort signal
      requestConfig.signal = abortControllerRef.current.signal;

      const response = await axios.post(url, payload, requestConfig);

      setData(response.data);
      return response.data;
      
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('Request cancelled');
        return null;
      } else {
        const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           'An error occurred';
        setError(errorMessage);
        throw err;
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [username, password]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    
    // Cancel ongoing request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { 
    data, 
    loading, 
    error, 
    postData, 
    reset,
    cancel
  };
};

export default usePost;
