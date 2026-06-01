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

    async createUser(name) {
      return request('/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
    },

    async getCollection(userId) {
      const params = new URLSearchParams({ userId: String(userId) });
      return request(`/getCollection?${params.toString()}`);
    },

    async updateSticker(userId, stickerCode, action) {
      return request('/updateSticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stickerCode, action })
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
