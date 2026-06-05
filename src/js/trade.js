(function () {
  const state = {
    initialized: false
  };

  const elementIds = {
    user1: 'tradeUser1',
    user2: 'tradeUser2',
    button: 'tradeCompareBtn',
    results: 'tradeResults'
  };

  function getElements() {
    return {
      user1: document.getElementById(elementIds.user1),
      user2: document.getElementById(elementIds.user2),
      button: document.getElementById(elementIds.button),
      results: document.getElementById(elementIds.results)
    };
  }

  function getUsers() {
    return window.App && typeof window.App.getUsers === 'function' ? window.App.getUsers() : [];
  }

  function getUserName(userId) {
    const match = getUsers().find((user) => String(user.id) === String(userId));
    return match ? match.name : 'Unknown user';
  }

  function fillSelect(select, selectedId, excludeId) {
    const users = getUsers().filter((user) => String(user.id) !== String(excludeId));
    const options = ['<option value="">Select user</option>'].concat(
      users.map((user) => `<option value="${user.id}">${escapeHtml(user.name)}</option>`)
    );

    select.innerHTML = options.join('');

    if (selectedId && users.some((user) => String(user.id) === String(selectedId))) {
      select.value = String(selectedId);
    }
  }

  function syncSelects(changedSelect) {
    const elements = getElements();
    if (!elements.user1 || !elements.user2) {
      return;
    }

    const current1 = elements.user1.value;
    const current2 = elements.user2.value;
    const preferred1 = changedSelect === 'user2' && current1 === current2 ? '' : current1;
    const preferred2 = changedSelect === 'user1' && current1 === current2 ? '' : current2;

    fillSelect(elements.user1, preferred1, current2);
    fillSelect(elements.user2, preferred2, current1);
  }

  function groupByTeam(codes) {
    const groups = new Map();

    codes.forEach((code) => {
      const info = window.AlbumData && typeof window.AlbumData.getStickerInfo === 'function'
        ? window.AlbumData.getStickerInfo(code)
        : null;
      const teamName = info && (info.team || info.teamName || info.group || info.section)
        ? info.team || info.teamName || info.group || info.section
        : 'Other';

      if (!groups.has(teamName)) {
        groups.set(teamName, []);
      }
      groups.get(teamName).push(code);
    });

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderGroupedList(title, codes, emptyMessage) {
    const groups = groupByTeam(codes);
    const body = groups.length
      ? groups.map(([team, teamCodes]) => `
          <div class="trade-team">
            <h4>${escapeHtml(team)}</h4>
            <div class="trade-chip-list">
              ${teamCodes
                .sort((a, b) => a.localeCompare(b))
                .map((code) => `<span class="trade-chip">${escapeHtml(code)}</span>`)
                .join('')}
            </div>
          </div>`).join('')
      : `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;

    return `
      <div class="trade-column">
        <h3>${escapeHtml(title)}</h3>
        ${body}
      </div>`;
  }

  function normalizeTradeResponse(data) {
    const give = data && (Array.isArray(data.give) ? data.give
      : Array.isArray(data.canGive) ? data.canGive
      : Array.isArray(data.user1Offers) ? data.user1Offers : []);
    const get = data && (Array.isArray(data.get) ? data.get
      : Array.isArray(data.canGet) ? data.canGet
      : Array.isArray(data.user2Offers) ? data.user2Offers : []);
    return { give, get };
  }

  function computeLocalTrades(collection1, collection2) {
    const universe = window.AlbumData && Array.isArray(window.AlbumData.allStickerCodes)
      ? window.AlbumData.allStickerCodes
      : Array.from(new Set(Object.keys(collection1).concat(Object.keys(collection2))));

    const give = [];
    const get = [];

    universe.forEach((rawCode) => {
      const code = String(rawCode).toUpperCase();
      const count1 = Number(collection1[code] || 0);
      const count2 = Number(collection2[code] || 0);

      if (count1 > 1 && count2 < 1) {
        give.push(code);
      }

      if (count2 > 1 && count1 < 1) {
        get.push(code);
      }
    });

    return { give, get };
  }

  async function compare() {
    const elements = getElements();
    if (!elements.results || !elements.user1 || !elements.user2) {
      return;
    }

    const user1 = elements.user1.value;
    const user2 = elements.user2.value;

    if (!user1 || !user2) {
      elements.results.innerHTML = '<div class="panel empty-state">Choose two different users to compare trades.</div>';
      return;
    }

    let tradeData;
    let usedFallback = false;

    try {
      tradeData = normalizeTradeResponse(await window.API.getTrades(user1, user2));
    } catch (error) {
      usedFallback = true;
      const [collection1, collection2] = await Promise.all([
        window.App.getCollectionSnapshot(user1),
        window.App.getCollectionSnapshot(user2)
      ]);
      tradeData = computeLocalTrades(collection1, collection2);
    }

    const name1 = getUserName(user1);
    const name2 = getUserName(user2);

    elements.results.innerHTML = `
      ${usedFallback ? '<div class="panel empty-state">API unavailable. Showing locally computed trade suggestions.</div>' : ''}
      <div class="trade-columns">
        ${renderGroupedList('You can give', tradeData.give, `${name1} has no extras ${name2} needs yet.`)}
        ${renderGroupedList('You can get', tradeData.get, `${name2} has no extras ${name1} needs yet.`)}
      </div>`;
  }

  function render() {
    const elements = getElements();
    if (!elements.user1 || !elements.user2 || !elements.results) {
      return;
    }

    const users = getUsers();
    const currentUserId = window.App && typeof window.App.getCurrentUserId === 'function'
      ? window.App.getCurrentUserId()
      : '';
    const otherUser = users.find((user) => String(user.id) !== String(currentUserId));

    fillSelect(elements.user1, elements.user1.value || currentUserId, elements.user2.value);
    fillSelect(elements.user2, elements.user2.value || (otherUser ? otherUser.id : ''), elements.user1.value || currentUserId);

    if (!state.initialized) {
      elements.user1.addEventListener('change', function () {
        syncSelects('user1');
      });
      elements.user2.addEventListener('change', function () {
        syncSelects('user2');
      });
      elements.button.addEventListener('click', compare);
      state.initialized = true;
    }

    if (users.length < 2) {
      elements.results.innerHTML = '<div class="panel empty-state">Add at least two users to compare trades.</div>';
      return;
    }

    if (!elements.user1.value || !elements.user2.value) {
      elements.results.innerHTML = '<div class="panel empty-state">Choose two different users to compare trades.</div>';
    }
  }

  window.TradeView = {
    render,
    compare
  };
})();
