(function () {
  async function request(path, options) {
    let response;

    try {
      response = await fetch(`${window.API.baseUrl}${path}`, options);
    } catch (error) {
      throw new Error(`Network error: ${error.message}`);
    }

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error('Invalid server response');
      }
    }

    if (!response.ok) {
      const message = data.error || data.message || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  window.API = {
    baseUrl: '/api',

    async getUsers() {
      return request('/getUsers');
    },

    async createUser(name, pin) {
      return request('/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin: pin || '' })
      });
    },

    async getCollection(userId) {
      const params = new URLSearchParams({ userId: String(userId) });
      return request(`/getCollection?${params.toString()}`);
    },

    async updateSticker(userId, stickerCode, action) {
      const pin = sessionStorage.getItem('panini.pin.' + userId) || '';
      return request('/updateSticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stickerCode, action, pin })
      });
    },

    async setPin(userId, newPin, currentPin) {
      return request('/setPin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPin, currentPin: currentPin || '' })
      });
    },

    async getTrades(user1, user2) {
      const params = new URLSearchParams({
        user1: String(user1),
        user2: String(user2)
      });
      return request(`/getTrades?${params.toString()}`);
    }
  };
})();
