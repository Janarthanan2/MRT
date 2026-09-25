/**
 * MRT Metal Mart — API client
 * Configure the backend with:
 *   window.MRT_API_BASE_URL = 'http://localhost:8080/api';
 */
window.MRT_API_BASE_URL = window.MRT_API_BASE_URL || '/api';

const MRTApi = {
  baseUrl() {
    return String(window.MRT_API_BASE_URL || '/api').replace(/\/$/, '');
  },
  headers() {
    const token = localStorage.getItem('mrt_access_token');
    return token ? { Authorization: 'Bearer ' + token } : {};
  },
  async request(path, options = {}) {
    const response = await fetch(this.baseUrl() + path, {
      ...options,
      headers: { ...this.headers(), ...(options.headers || {}) }
    });
    if (!response.ok) {
      let message = 'Request failed (' + response.status + ')';
      try { const body = await response.json(); message = body.message || body.error || message; } catch (_) {}
      throw new Error(message);
    }
    if (response.status === 204) return null;
    const type = response.headers.get('content-type') || '';
    return type.includes('application/json') ? response.json() : response.text();
  },
  getProductImages(productId) {
    return this.request('/products/' + encodeURIComponent(productId) + '/images');
  },
  uploadProductImage(productId, file, isPrimary = false, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.baseUrl() + '/admin/products/' + encodeURIComponent(productId) + '/images');
      const token = localStorage.getItem('mrt_access_token');
      if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.upload.onprogress = event => {
        if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); } catch (_) { resolve({}); }
        } else {
          let message = 'Upload failed (' + xhr.status + ')';
          try { const body = JSON.parse(xhr.responseText); message = body.message || body.error || message; } catch (_) {}
          reject(new Error(message));
        }
      };
      xhr.onerror = () => reject(new Error('Network error while uploading image.'));
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isPrimary', String(isPrimary));
      xhr.send(formData);
    });
  },
  deleteProductImage(productId, imageId) {
    return this.request('/admin/products/' + encodeURIComponent(productId) + '/images/' + encodeURIComponent(imageId), { method: 'DELETE' });
  },
  setPrimaryProductImage(productId, imageId) {
    return this.request('/admin/products/' + encodeURIComponent(productId) + '/images/' + encodeURIComponent(imageId) + '/primary', { method: 'PATCH' });
  }
};
window.MRTApi = MRTApi;
