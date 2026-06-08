(function () {
  const STORAGE_KEYS = {
    currentUserId: 'panini.currentUserId',
    users: 'panini.usersCache',
    expandedTeams: 'panini.expandedTeams'
  };

  const state = {
    users: [],
    activeTab: 'quick',
    currentUserId: '',
    collection: {},
    recentAdditions: [],
    expandedTeams: loadJson(STORAGE_KEYS.expandedTeams, {}),
    modalStickerCode: null
  };

  const elements = {};
  let toastTimer = null;

  function loadJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCollectionKey(userId) {
    return `panini.collection.${userId}`;
  }

  function getAlbumData() {
    return window.AlbumData || null;
  }

  function getTotalStickers() {
    const total = Number(getAlbumData() && getAlbumData().totalStickers);
    return Number.isFinite(total) && total > 0 ? total : 980;
  }

  function normalizeCollection(collection) {
    if (!collection || typeof collection !== 'object') {
      return {};
    }

    const normalized = {};
    Object.entries(collection).forEach(([rawCode, rawValue]) => {
      const code = String(rawCode).toUpperCase();
      let count = 0;

      if (typeof rawValue === 'number') {
        count = rawValue;
      } else if (typeof rawValue === 'string') {
        count = Number(rawValue);
      } else if (rawValue === true) {
        count = 1;
      } else if (rawValue && typeof rawValue.count === 'number') {
        count = rawValue.count;
      }

      if (Number.isFinite(count) && count > 0) {
        normalized[code] = count;
      }
    });

    return normalized;
  }

  function loadCollectionCache(userId) {
    return loadJson(getCollectionKey(userId), { collection: {}, recentAdditions: [] });
  }

  function saveCollectionCache(userId, payload) {
    saveJson(getCollectionKey(userId), payload);
  }

  function getUsersCache() {
    return loadJson(STORAGE_KEYS.users, []);
  }

  function saveUsersCache() {
    saveJson(STORAGE_KEYS.users, state.users);
  }

  function sanitizeCode(code) {
    return String(code || '').trim().toUpperCase();
  }

  function getAllStickerCodes() {
    const albumData = getAlbumData();
    return Array.isArray(albumData && albumData.allStickerCodes)
      ? albumData.allStickerCodes.map((code) => sanitizeCode(code))
      : [];
  }

  function isValidStickerCode(code) {
    const normalized = sanitizeCode(code);
    const availableCodes = getAllStickerCodes();

    if (!normalized) {
      return false;
    }

    if (!availableCodes.length) {
      return /^[A-Z0-9-]{2,12}$/.test(normalized);
    }

    return availableCodes.includes(normalized);
  }

  function getCollectionCount(code) {
    return Number(state.collection[sanitizeCode(code)] || 0);
  }

  function getCollectedTotal() {
    return Object.values(state.collection).filter((count) => Number(count) > 0).length;
  }

  function getDuplicateTotal() {
    return Object.values(state.collection).reduce((sum, count) => sum + Math.max(0, Number(count) - 1), 0);
  }

  function showToast(message, type) {
    if (!elements.toast) {
      return;
    }

    elements.toast.textContent = message;
    elements.toast.className = `toast show${type ? ` ${type}` : ''}`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      elements.toast.className = 'toast';
    }, 2200);
  }

  function setActiveTab(tabName) {
    state.activeTab = tabName;

    document.querySelectorAll('.tab-btn').forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    document.querySelectorAll('.view').forEach((view) => {
      const isActive = view.dataset.view === tabName;
      view.classList.toggle('active', isActive);
      view.hidden = !isActive;
    });

    if (tabName === 'trades' && window.TradeView) {
      window.TradeView.render();
    }
    if (tabName === 'duplicates') {
      renderDuplicates();
    }
  }

  function renderUserSelector() {
    const options = ['<option value="">Choose user</option>'].concat(
      state.users.map((user) => `<option value="${user.id}">${escapeHtml(user.name)}</option>`)
    );

    elements.userSelector.innerHTML = options.join('');
    if (state.currentUserId) {
      elements.userSelector.value = String(state.currentUserId);
    }
  }

  function renderUsersView() {
    if (!state.users.length) {
      elements.usersList.innerHTML = '<div class="empty-state">No users yet. Add one to start tracking.</div>';
      return;
    }

    elements.usersList.innerHTML = state.users.map((user) => {
      const isActive = String(user.id) === String(state.currentUserId);
      return `
        <div class="user-list-row">
          <button type="button" class="user-list-item${isActive ? ' active' : ''}" data-user-select="${user.id}">
            <span>
              <strong>${escapeHtml(user.name)}</strong>
              <span class="user-meta">${isActive ? 'Currently selected' : 'Tap to switch'}</span>
            </span>
            <span aria-hidden="true">›</span>
          </button>
          <button type="button" class="ghost-btn pin-btn" data-set-pin="${user.id}" title="Set PIN">🔒</button>
        </div>`;
    }).join('');
  }

  function updateStats() {
    const collected = getCollectedTotal();
    const total = getTotalStickers();
    const percent = total ? Math.round((collected / total) * 100) : 0;
    const duplicates = getDuplicateTotal();
    elements.statsBar.textContent = `${collected} / ${total} collected (${percent}%) | ${duplicates} duplicates`;
  }

  function addRecentAddition(code, actionLabel, isDuplicate) {
    if (actionLabel !== 'add') {
      return;
    }

    state.recentAdditions = [{ code, addedAt: Date.now(), isDuplicate: !!isDuplicate }].concat(state.recentAdditions)
      .slice(0, 10);
  }

  function renderRecentAdditions() {
    const items = state.recentAdditions.slice(0, 10);
    const hasItems = items.length > 0;
    elements.recentList.innerHTML = hasItems
      ? items.map((item) => {
          const dupBadge = item.isDuplicate ? ' <span class="dup-badge">duplicate</span>' : '';
          return `<li class="recent-item">${escapeHtml(item.code)}${dupBadge} <span class="user-meta">${formatRelativeTime(item.addedAt)}</span></li>`;
        }).join('')
      : '';
    elements.recentEmptyState.hidden = hasItems;
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) {
      return 'just now';
    }

    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    if (minutes < 1) {
      return 'just now';
    }
    if (minutes === 1) {
      return '1 min ago';
    }
    if (minutes < 60) {
      return `${minutes} mins ago`;
    }
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function extractStickerCodes(source) {
    if (!source) {
      return [];
    }

    if (Array.isArray(source)) {
      return source.map((value) => {
        if (typeof value === 'string') {
          return sanitizeCode(value);
        }
        if (value && typeof value.code !== 'undefined') {
          return sanitizeCode(value.code);
        }
        return '';
      }).filter(Boolean);
    }

    if (Array.isArray(source.stickers)) {
      return extractStickerCodes(source.stickers);
    }

    if (Array.isArray(source.stickerCodes)) {
      return extractStickerCodes(source.stickerCodes);
    }

    if (Array.isArray(source.codes)) {
      return extractStickerCodes(source.codes);
    }

    if (Array.isArray(source.items)) {
      return extractStickerCodes(source.items);
    }

    return [];
  }

  function normalizeTeam(team, fallbackSection, index) {
    const name = team && (team.name || team.title || team.team || team.id) ? String(team.name || team.title || team.team || team.id) : `Team ${index + 1}`;
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      section: fallbackSection || 'Album',
      stickers: extractStickerCodes(team)
    };
  }

  function getTeamList() {
    const albumData = getAlbumData();
    const teams = [];

    if (albumData && Array.isArray(albumData.sections)) {
      albumData.sections.forEach((section, sectionIndex) => {
        const sectionName = section && (section.name || section.title) ? String(section.name || section.title) : `Section ${sectionIndex + 1}`;
        const sectionTeams = Array.isArray(section && section.teams) ? section.teams : [];

        if (sectionTeams.length) {
          sectionTeams.forEach((team, teamIndex) => {
            teams.push(normalizeTeam(team, sectionName, teamIndex));
          });
          return;
        }

        const sectionStickers = extractStickerCodes(section);
        if (sectionStickers.length) {
          const firstCode = sectionStickers[0] || '';
          teams.push({
            id: sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: sectionName,
            section: /^(FWC|00)/i.test(firstCode) ? 'Special Sections' : 'Teams',
            stickers: sectionStickers
          });
        }
      });
    }

    if (!teams.length && albumData && Array.isArray(albumData.teams)) {
      albumData.teams.forEach((team, index) => {
        teams.push(normalizeTeam(team, 'Teams', index));
      });
    }

    if (!teams.length && albumData && albumData.teams && typeof albumData.teams === 'object') {
      Object.entries(albumData.teams).forEach(([name, codes], index) => {
        teams.push({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          section: 'Teams',
          stickers: extractStickerCodes(codes),
          index
        });
      });
    }

    if (!teams.length) {
      const allCodes = getAllStickerCodes();
      if (allCodes.length) {
        teams.push({ id: 'album', name: 'Album', section: 'Album', stickers: allCodes });
      }
    }

    return teams.filter((team) => team.stickers.length);
  }

  function renderChecklist() {
    const filter = sanitizeCode(elements.checklistSearch.value);
    const teams = getTeamList();

    if (!teams.length) {
      elements.checklistSections.innerHTML = '<div class="panel empty-state">Album data unavailable right now. Add data.js to unlock the checklist grid.</div>';
      return;
    }

    const grouped = teams.reduce((accumulator, team) => {
      const matchingCodes = team.stickers.filter((code) => !filter || code.startsWith(filter));
      if (!matchingCodes.length) {
        return accumulator;
      }

      if (!accumulator[team.section]) {
        accumulator[team.section] = [];
      }
      accumulator[team.section].push({ team, matchingCodes });
      return accumulator;
    }, {});

    const sections = Object.entries(grouped);

    if (!sections.length) {
      elements.checklistSections.innerHTML = '<div class="panel empty-state">No stickers match that filter.</div>';
      return;
    }

    elements.checklistSections.innerHTML = sections.map(([sectionName, sectionTeams]) => `
      <div class="section-block">
        <h3 class="section-title">${escapeHtml(sectionName)}</h3>
        ${sectionTeams.map(({ team, matchingCodes }) => {
          const expanded = filter ? true : Boolean(state.expandedTeams[team.id]);
          const collectedCount = matchingCodes.filter((code) => getCollectionCount(code) > 0).length;
          return `
           <article class="team-section${expanded ? ' expanded' : ''}" data-team-id="${team.id}">
             <button type="button" class="team-toggle" data-team-toggle="${team.id}">
               <span>${escapeHtml(team.name)}</span>
               <span class="team-toggle-meta">${collectedCount}/${matchingCodes.length} ${expanded ? '−' : '+'}</span>
             </button>
              <div class="team-content">
                <div class="sticker-grid">
                  ${matchingCodes.map((code) => renderStickerCell(code)).join('')}
                </div>
              </div>
            </article>`;
        }).join('')}
      </div>`).join('');
  }

  function renderStickerCell(code) {
    const count = getCollectionCount(code);
    const stateClass = count > 1 ? 'duplicate' : count === 1 ? 'collected' : 'missing';
    return `
      <button type="button" class="sticker-cell ${stateClass}" data-sticker-code="${code}" title="${escapeHtml(code)}">
        <span>${escapeHtml(code)}</span>
        ${count > 1 ? `<span class="duplicate-badge">${count}</span>` : ''}
      </button>`;
  }

  function renderDuplicates() {
    const container = elements.duplicatesSections;
    if (!container) return;

    const teams = getTeamList();
    const duplicatesByTeam = teams.map((team) => {
      const dupes = team.stickers.filter((code) => getCollectionCount(code) > 1);
      return { team, dupes };
    }).filter(({ dupes }) => dupes.length > 0);

    if (duplicatesByTeam.length === 0) {
      container.innerHTML = '<div class="panel empty-state">No duplicates yet.</div>';
      return;
    }

    const totalDupes = duplicatesByTeam.reduce((sum, { dupes }) => sum + dupes.length, 0);
    container.innerHTML = `<div class="panel"><p>${totalDupes} duplicate sticker${totalDupes === 1 ? '' : 's'} across ${duplicatesByTeam.length} team${duplicatesByTeam.length === 1 ? '' : 's'}</p></div>` +
      duplicatesByTeam.map(({ team, dupes }) => `
        <article class="team-section expanded">
          <div class="team-toggle">
            <span>${escapeHtml(team.name)}</span>
            <span class="team-toggle-meta">${dupes.length} duplicate${dupes.length === 1 ? '' : 's'}</span>
          </div>
          <div class="team-content">
            <div class="sticker-grid">
              ${dupes.map((code) => renderStickerCell(code)).join('')}
            </div>
          </div>
        </article>`).join('');
  }

  function openStickerModal(code) {
    state.modalStickerCode = code;
    elements.modalText.textContent = `${code} is already collected. Add another duplicate or remove one?`;
    elements.modal.hidden = false;
  }

  function closeStickerModal() {
    state.modalStickerCode = null;
    elements.modal.hidden = true;
  }

  function applyLocalMutation(code, action) {
    const currentCount = getCollectionCount(code);

    if (action === 'add') {
      state.collection[code] = currentCount + 1;
      addRecentAddition(code, action);
      return;
    }

    if (action === 'remove') {
      if (currentCount <= 1) {
        delete state.collection[code];
      } else {
        state.collection[code] = currentCount - 1;
      }
    }
  }

  function hydrateCollectionFromResponse(response, fallbackCode, fallbackAction) {
    if (response && response.collection) {
      state.collection = normalizeCollection(response.collection);
      return;
    }

    applyLocalMutation(fallbackCode, fallbackAction);
  }

  async function persistSticker(code, action) {
    if (!state.currentUserId) {
      showToast('Choose a user first.', 'warning');
      return;
    }

    const wasDuplicate = action === 'add' && getCollectionCount(code) >= 1;
    const readableAction = action === 'remove' ? 'removed' : 'added';

    try {
      const response = await window.API.updateSticker(state.currentUserId, code, action);
      hydrateCollectionFromResponse(response, code, action);
      const dupLabel = wasDuplicate ? ' (duplicate)' : '';
      showToast(`${code} ${readableAction}${dupLabel}.`);
    } catch (error) {
      if (error.message === 'Invalid PIN.') {
        showPinPrompt(state.currentUserId, function () {
          persistSticker(code, action);
        });
        return;
      }
      applyLocalMutation(code, action);
      showToast(`API unavailable. ${code} ${readableAction} locally only.`, 'warning');
    }

    if (action === 'add') {
      addRecentAddition(code, action, wasDuplicate);
    }

    saveCollectionCache(state.currentUserId, {
      collection: state.collection,
      recentAdditions: state.recentAdditions
    });
    renderAfterCollectionChange();
  }

  function renderAfterCollectionChange() {
    updateStats();
    renderRecentAdditions();
    renderChecklist();
    renderDuplicates();
    renderUsersView();
    if (window.TradeView) {
      window.TradeView.render();
    }
  }

  async function loadUsers() {
    try {
      const response = await window.API.getUsers();
      state.users = Array.isArray(response && response.users) ? response.users : [];
      saveUsersCache();
    } catch (error) {
      state.users = getUsersCache();
      if (state.users.length) {
        showToast('API unavailable. Using cached users.', 'warning');
      }
    }

    renderUserSelector();
    renderUsersView();
    window.TradeView && window.TradeView.render();
  }

  async function loadCollection(userId, showMessage) {
    if (!userId) {
      state.collection = {};
      state.recentAdditions = [];
      renderAfterCollectionChange();
      return;
    }

    try {
      const response = await window.API.getCollection(userId);
      state.collection = normalizeCollection(response && response.collection);
      state.recentAdditions = loadCollectionCache(userId).recentAdditions || [];
      saveCollectionCache(userId, {
        collection: state.collection,
        recentAdditions: state.recentAdditions
      });
    } catch (error) {
      const cache = loadCollectionCache(userId);
      state.collection = normalizeCollection(cache.collection);
      state.recentAdditions = Array.isArray(cache.recentAdditions) ? cache.recentAdditions : [];
      if (showMessage) {
        showToast(state.collection && Object.keys(state.collection).length
          ? 'API unavailable. Loaded cached collection.'
          : 'API unavailable. No saved collection found.', 'warning');
      }
    }

    renderAfterCollectionChange();
  }

  async function handleUserChange(userId, showMessage) {
    state.currentUserId = userId ? String(userId) : '';
    localStorage.setItem(STORAGE_KEYS.currentUserId, state.currentUserId);
    renderUserSelector();
    renderUsersView();
    await loadCollection(state.currentUserId, showMessage);
  }

  async function handleQuickEntrySubmit(event) {
    event.preventDefault();
    const code = sanitizeCode(elements.quickEntryInput.value);

    if (!isValidStickerCode(code)) {
      showToast('Enter a valid sticker code.', 'error');
      return;
    }

    await persistSticker(code, 'add');
    elements.quickEntryInput.value = '';
    elements.quickEntryInput.focus();
  }

  async function handleAddUser(event) {
    event.preventDefault();
    const name = String(elements.newUserName.value || '').trim();
    const pin = String(elements.newUserPin.value || '').trim();

    if (!name) {
      showToast('Enter a user name.', 'error');
      return;
    }

    if (pin && !/^\d{4}$/.test(pin)) {
      showToast('PIN must be exactly 4 digits.', 'error');
      return;
    }

    let newUser;

    try {
      newUser = await window.API.createUser(name, pin);
    } catch (error) {
      newUser = { id: `local-${Date.now()}`, name };
      showToast('API unavailable. User saved locally only.', 'warning');
    }

    state.users = state.users.concat([{ id: newUser.id, name: newUser.name }]);
    saveUsersCache();
    elements.newUserName.value = '';
    elements.newUserPin.value = '';
    renderUserSelector();
    renderUsersView();

    // If a PIN was set, store it in session so the user is immediately unlocked
    if (pin) {
      sessionStorage.setItem('panini.pin.' + newUser.id, pin);
    }

    await handleUserChange(newUser.id, false);
    showToast(`${newUser.name} added.`);
  }

  // PIN prompt modal logic
  let pinResolveCallback = null;

  function showPinPrompt(userId, onSuccess) {
    pinResolveCallback = onSuccess;
    elements.pinModalInput.value = '';
    elements.pinModal.hidden = false;
    elements.pinModalInput.focus();
  }

  function closePinModal() {
    elements.pinModal.hidden = true;
    pinResolveCallback = null;
  }

  function showSetPinModal(userId) {
    state._setPinUserId = userId;
    elements.setPinCurrent.value = '';
    elements.setPinNew.value = '';
    elements.setPinModal.hidden = false;
    elements.setPinNew.focus();
  }

  function closeSetPinModal() {
    elements.setPinModal.hidden = true;
    state._setPinUserId = null;
  }

  function bindEvents() {
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.addEventListener('click', function () {
        setActiveTab(button.dataset.tab);
      });
    });

    elements.quickEntryForm.addEventListener('submit', handleQuickEntrySubmit);
    elements.userSelector.addEventListener('change', function (event) {
      handleUserChange(event.target.value, true);
    });
    elements.checklistSearch.addEventListener('input', renderChecklist);
    elements.addUserForm.addEventListener('submit', handleAddUser);

    elements.usersList.addEventListener('click', function (event) {
      const button = event.target.closest('[data-user-select]');
      if (!button) {
        return;
      }
      elements.userSelector.value = button.dataset.userSelect;
      handleUserChange(button.dataset.userSelect, false);
    });

    elements.checklistSections.addEventListener('click', function (event) {
      const toggleButton = event.target.closest('[data-team-toggle]');
      if (toggleButton) {
        const teamId = toggleButton.dataset.teamToggle;
        state.expandedTeams[teamId] = !state.expandedTeams[teamId];
        saveJson(STORAGE_KEYS.expandedTeams, state.expandedTeams);
        renderChecklist();
        return;
      }

      const stickerButton = event.target.closest('[data-sticker-code]');
      if (!stickerButton) {
        return;
      }

      const code = stickerButton.dataset.stickerCode;
      const count = getCollectionCount(code);
      if (count < 1) {
        persistSticker(code, 'add');
        return;
      }
      openStickerModal(code);
    });

    elements.modalDuplicateBtn.addEventListener('click', function () {
      if (state.modalStickerCode) {
        persistSticker(state.modalStickerCode, 'add');
      }
      closeStickerModal();
    });

    elements.modalRemoveBtn.addEventListener('click', function () {
      if (state.modalStickerCode) {
        persistSticker(state.modalStickerCode, 'remove');
      }
      closeStickerModal();
    });

    elements.modalCancelBtn.addEventListener('click', closeStickerModal);
    elements.modal.addEventListener('click', function (event) {
      if (event.target === elements.modal) {
        closeStickerModal();
      }
    });

    // PIN modal events
    elements.pinModalForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const pin = elements.pinModalInput.value.trim();
      if (!/^\d{4}$/.test(pin)) {
        showToast('Enter a 4-digit PIN.', 'error');
        return;
      }
      sessionStorage.setItem('panini.pin.' + state.currentUserId, pin);
      const callback = pinResolveCallback;
      closePinModal();
      if (callback) {
        callback();
      }
    });

    elements.pinModalCancelBtn.addEventListener('click', closePinModal);
    elements.pinModal.addEventListener('click', function (event) {
      if (event.target === elements.pinModal) {
        closePinModal();
      }
    });

    // Set PIN modal events
    elements.setPinForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const userId = state._setPinUserId;
      const currentPin = elements.setPinCurrent.value.trim();
      const newPin = elements.setPinNew.value.trim();

      if (!/^\d{4}$/.test(newPin)) {
        showToast('New PIN must be exactly 4 digits.', 'error');
        return;
      }

      try {
        await window.API.setPin(userId, newPin, currentPin);
        sessionStorage.setItem('panini.pin.' + userId, newPin);
        closeSetPinModal();
        showToast('PIN updated.');
      } catch (error) {
        showToast(error.message || 'Failed to set PIN.', 'error');
      }
    });

    elements.setPinCancelBtn.addEventListener('click', closeSetPinModal);
    elements.setPinModal.addEventListener('click', function (event) {
      if (event.target === elements.setPinModal) {
        closeSetPinModal();
      }
    });

    // Set PIN button in users view
    elements.usersList.addEventListener('click', function (event) {
      const setPinBtn = event.target.closest('[data-set-pin]');
      if (setPinBtn) {
        showSetPinModal(setPinBtn.dataset.setPin);
        return;
      }
    });
  }

  function cacheElements() {
    elements.userSelector = document.getElementById('userSelector');
    elements.statsBar = document.getElementById('statsBar');
    elements.quickEntryForm = document.getElementById('quickEntryForm');
    elements.quickEntryInput = document.getElementById('quickEntryInput');
    elements.recentList = document.getElementById('recentAdditions');
    elements.recentEmptyState = document.getElementById('recentEmptyState');
    elements.checklistSearch = document.getElementById('checklistSearch');
    elements.checklistSections = document.getElementById('checklistSections');
    elements.duplicatesSections = document.getElementById('duplicatesSections');
    elements.usersList = document.getElementById('usersList');
    elements.addUserForm = document.getElementById('addUserForm');
    elements.newUserName = document.getElementById('newUserName');
    elements.newUserPin = document.getElementById('newUserPin');
    elements.toast = document.getElementById('toast');
    elements.modal = document.getElementById('stickerActionModal');
    elements.modalText = document.getElementById('stickerActionText');
    elements.modalDuplicateBtn = document.getElementById('modalDuplicateBtn');
    elements.modalRemoveBtn = document.getElementById('modalRemoveBtn');
    elements.modalCancelBtn = document.getElementById('modalCancelBtn');
    elements.pinModal = document.getElementById('pinModal');
    elements.pinModalForm = document.getElementById('pinModalForm');
    elements.pinModalInput = document.getElementById('pinModalInput');
    elements.pinModalCancelBtn = document.getElementById('pinModalCancelBtn');
    elements.setPinModal = document.getElementById('setPinModal');
    elements.setPinForm = document.getElementById('setPinForm');
    elements.setPinCurrent = document.getElementById('setPinCurrent');
    elements.setPinNew = document.getElementById('setPinNew');
    elements.setPinCancelBtn = document.getElementById('setPinCancelBtn');
  }

  async function initialize() {
    cacheElements();
    bindEvents();
    setActiveTab(state.activeTab);
    state.recentAdditions = [];
    renderRecentAdditions();
    updateStats();
    renderChecklist();
    renderUsersView();

    await loadUsers();

    const savedUserId = localStorage.getItem(STORAGE_KEYS.currentUserId);
    const fallbackUser = state.users[0] && state.users[0].id;
    const nextUserId = savedUserId && state.users.some((user) => String(user.id) === String(savedUserId))
      ? savedUserId
      : fallbackUser || '';

    if (nextUserId) {
      await handleUserChange(nextUserId, false);
    }

    if (!getAlbumData()) {
      showToast('Album data not found. Add data.js when ready.', 'warning');
    }
  }

  window.App = {
    async getCollectionSnapshot(userId) {
      if (!userId) {
        return {};
      }

      if (String(userId) === String(state.currentUserId)) {
        return { ...state.collection };
      }

      try {
        const response = await window.API.getCollection(userId);
        const collection = normalizeCollection(response && response.collection);
        saveCollectionCache(userId, {
          collection,
          recentAdditions: loadCollectionCache(userId).recentAdditions || []
        });
        return collection;
      } catch (error) {
        return normalizeCollection(loadCollectionCache(userId).collection);
      }
    },
    getCurrentUserId() {
      return state.currentUserId;
    },
    getUsers() {
      return state.users.slice();
    },
    showToast
  };

  document.addEventListener('DOMContentLoaded', initialize);
})();
