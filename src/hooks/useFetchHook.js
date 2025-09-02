

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useFetch = (url,query = '', params = null, ) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const controller = new AbortController();
    
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setData(null);
        
//         const endpoint = query ? `${url}/${query}` : url;
//         const response = await axios.get(endpoint, {
//           params: params,
//           signal: controller.signal
//         });
//         // console.log(response.data)
//         setData(response.data);
//       } catch (err) {
//         console.log(err)
//         if (controller.signal.aborted) {
//           console.log('Request cancelled', err);
//         } else {
//           setError(err.message || 'An error occurred');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // return () => {
//     //   controller.abort();
//     // };
//   }, [url, JSON.stringify(params), query]); // Fixed dependency array

//   return { data, loading, error };
// };

// export default useFetch;


import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, query = '', params = null, ) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const username = import.meta.env.VITE_USER_NAME;
const password = import.meta.env.VITE_USER_PASSWORD;
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);
        
        const endpoint = query ? `${url}/${query}` : url;
        
        // Build request config
        const config = {
          params: params,
          signal: controller.signal
        };
        
        // Add Basic Auth if provided
        if (username && password) {
          config.auth = {
            username: username,
            password: password
          };
        }
        
        const response = await axios.get(endpoint, config);
        setData(response.data);
      } catch (err) {
        console.log(err);
        if (controller.signal.aborted) {
          console.log('Request cancelled', err);
        } else {
          setError(err.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [url, JSON.stringify(params), query]);

  return { data, loading, error };
};

export default useFetch;



