import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Create Supabase client with enhanced error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  },
  // Add retry logic for failed requests
  fetch: (url, options = {}) => {
    return retryFetch(url, options);
  }
});

// Retry function with exponential backoff
async function retryFetch(url: string, options: any, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      console.log(`Retrying fetch, attempts remaining: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryFetch(url, options, retries - 1);
    }
    throw error;
  }
}

// Add error event listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('supabase.auth.token');
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // Update headers with new token
    supabase.rest.headers['Authorization'] = `Bearer ${session?.access_token}`;
  }
});

// Health check function
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('seminars').select('count').limit(1).single();
    return !error && data !== null;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Wrapper function for Supabase queries with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}