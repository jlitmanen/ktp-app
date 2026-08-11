const BASE_URL = import.meta.env.VITE_API_URL || "";
const isDev = import.meta.env.DEV;

/**
 * Sanitize object to prevent XSS and injection attacks
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Basic XSS prevention - remove script tags and html entities
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Generic fetch wrapper for API calls
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Sanitize request body if present (skip for login endpoint)
  let sanitizedOptions = options;
  if (options.body && !endpoint.includes('/login')) {
    try {
      const bodyObj = typeof options.body === 'string' 
        ? JSON.parse(options.body) 
        : options.body;
      sanitizedOptions = {
        ...options,
        body: JSON.stringify(sanitizeObject(bodyObj))
      };
    } catch (e) {
      // If parsing fails, use original body
      sanitizedOptions = options;
    }
  }

  const config = {
    ...sanitizedOptions,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...sanitizedOptions.headers,
    },
    credentials: 'include', // Required for cookies to be sent
  };

  if (isDev) {
    console.log(`[API Request] ${options.method || "GET"} ${url}`, {
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : null,
    });
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    throw new Error(`Verkkovirhe: ${error.message}`);
  }

  // Handle 401 Unauthorized (Token expired or invalid)
  if (response.status === 401) {
    throw new Error("Istunto vanhentunut. Kirjaudu sisään uudelleen.");
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    if (!response.ok) throw new Error(`Palvelinvirhe (${response.status})`);
    return text;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.error || `Virhe: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

const api = {
  get: (url, options) => request(url, { ...options, method: "GET" }),
  post: (url, body, options) =>
    request(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (url, body, options) => {
    if (isDev) {
      console.log(`[API PUT] ${url}`, body);
    }
    return request(url, { ...options, method: "PUT", body: JSON.stringify(body) });
  },
  patch: (url, body, options) =>
    request(url, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: "DELETE" }),
};

export default api;
