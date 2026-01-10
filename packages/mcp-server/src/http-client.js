// HTTP client for API requests

/**
 * Build URL with path parameters substituted
 */
export function buildUrl(baseUrl, pathTemplate, pathParams = {}) {
  let url = pathTemplate;
  for (const [key, value] of Object.entries(pathParams)) {
    url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
  }
  return new URL(url, baseUrl).toString();
}

/**
 * Build query string from parameters
 */
export function buildQueryString(queryParams = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    }
  }
  return params.toString();
}

/**
 * Execute HTTP request for a tool
 */
export async function executeRequest(toolConfig, args, config = {}) {
  const { baseUrl: configBaseUrl, headers: configHeaders = {} } = config;
  const baseUrl = configBaseUrl || toolConfig.baseUrl;
  
  if (!baseUrl) {
    throw new Error(`No base URL configured for tool: ${toolConfig.name}`);
  }
  
  // Separate parameters by location
  const pathParams = {};
  const queryParams = {};
  const headerParams = {};
  let body;
  
  for (const param of toolConfig.executionParameters || []) {
    const value = args[param.name];
    if (value === undefined) continue;
    
    switch (param.in) {
      case 'path':
        pathParams[param.name] = value;
        break;
      case 'query':
        queryParams[param.name] = value;
        break;
      case 'header':
        headerParams[param.name] = value;
        break;
    }
  }
  
  // Handle request body
  if (args.requestBody !== undefined) {
    body = args.requestBody;
  }
  
  // Build URL
  let url = buildUrl(baseUrl, toolConfig.pathTemplate, pathParams);
  
  // Add query parameters
  const queryString = buildQueryString(queryParams);
  if (queryString) {
    url += (url.includes('?') ? '&' : '?') + queryString;
  }
  
  // Build headers
  const headers = {
    'Accept': 'application/json',
    ...configHeaders,
    ...headerParams,
  };
  
  // Set content type for request body
  if (body !== undefined) {
    headers['Content-Type'] = toolConfig.requestBodyContentType || 'application/json';
  }
  
  // Build request options
  const requestOptions = {
    method: toolConfig.method.toUpperCase(),
    headers,
  };
  
  if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(requestOptions.method)) {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  // Execute request
  const response = await fetch(url, requestOptions);
  
  // Parse response
  const contentType = response.headers.get('content-type') || '';
  let data;
  
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  
  return {
    status: response.status,
    statusText: response.statusText,
    data,
    ok: response.ok,
  };
}
