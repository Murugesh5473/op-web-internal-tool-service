import stripAnsi from 'strip-ansi';

// Get API base URL from environment or derive from hostname
const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  if (envUrl) return envUrl;

  // Fallback to hostname-based detection if env var not set
  const { hostname } = window.location;
  if (hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  if (hostname.includes('qa')) {
    return process.env.REACT_APP_API_QA_URL || `https://api-${hostname}`;
  }
  return process.env.REACT_APP_API_PROD_URL || `https://api.${hostname}`;
};

export const API_BASE_URL = getApiBaseUrl();

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(stripAnsi(json.message || 'API request failed'));
  }

  return json.data;
};

export const get = (endpoint) => request(endpoint);

export const post = (endpoint, body) =>
  request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

export const put = (endpoint, body) =>
  request(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

export const del = (endpoint) => request(endpoint, { method: 'DELETE' });
