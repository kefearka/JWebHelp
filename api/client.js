const API_BASE = '/api/v1';

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  tasks: {
    list: () => apiClient.request('/tasks'),
    complete: (id, data) => apiClient.request(`/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
};