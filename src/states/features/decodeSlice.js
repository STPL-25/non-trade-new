import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";

async function deriveKeyFromSecret(secret, salt, iterations = 1000) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  return new Uint8Array(derivedBits);
}

export const decryptData = createAsyncThunk(
  'decode/decryptData',
  async ({ encryptedData, secretKey }, { rejectWithValue }) => {
    try {
      const keyBytes = await deriveKeyFromSecret(secretKey, 'salt', 1000);
      
      const encrypted = new Uint8Array(
        encryptedData.token.match(/.{2}/g).map(byte => parseInt(byte, 16))
      );
      const iv = new Uint8Array(
        encryptedData.iv.match(/.{2}/g).map(byte => parseInt(byte, 16))
      );
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
      );
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encrypted
      );
      
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      
      return JSON.parse(decryptedText);
      
    } catch (error) {
      console.error('Decryption failed:', error);
      return rejectWithValue('Decryption failed: ' + error.message);
    }
  }
);

const decodeSlice = createSlice({
  name: 'decode',
  initialState: {
    decryptedData: null,
    userData: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDecryptedData: (state) => {
      state.decryptedData = null;
      state.userData = {}; 
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(decryptData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(decryptData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.decryptedData = action.payload;
        state.error = null;
        
        // Automatically decode JWT from decryptedData and set userData
        if (action.payload?.token) {
          try {
            const decodedUserData = jwtDecode(action.payload.token);
            // Assuming your JWT payload has a 'user' property
            // Adjust based on your actual JWT structure
            state.userData = decodedUserData.user || decodedUserData;
            console.log('User data automatically set:', state.userData);
          } catch (error) {
            console.error('JWT decode failed:', error);
            state.userData = {};
          }
        } else {
          console.warn('No token found in decrypted data');
          state.userData = {};
        }
      })
      .addCase(decryptData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.decryptedData = null;
        state.userData = {}; 
      });
  },
});

export const { clearDecryptedData, clearError, setUserData, clearUserData } = decodeSlice.actions;
export default decodeSlice.reducer;

export const selectDecryptedData = (state) => state.decode.decryptedData;
export const selectIsLoading = (state) => state.decode.isLoading;
export const selectError = (state) => state.decode.error;
export const selectUserData = (state) => state.decode.userData;
