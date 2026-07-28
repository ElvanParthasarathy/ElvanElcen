document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Fade out
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 500); // Remove from DOM after fade
    }
  }, 1500);

  let currentAccounts = [];

  function renderTabs() {
    const tabsContainer = document.getElementById('tabs');
    if (!tabsContainer) return;
    
    // Clear out everything except the static tabs
    const staticTabs = Array.from(tabsContainer.querySelectorAll('button[data-id="media"], button[data-id="settings"]'));
    tabsContainer.innerHTML = '';
    
    currentAccounts.forEach((acc, index) => {
      const btn = document.createElement('button');
      btn.className = 'p-btn';
      if (index === 0) btn.classList.add('p-btn-active'); // Default to first
      btn.setAttribute('data-id', acc.id);
      btn.title = acc.name; // Use title for the account name (tooltip)
      
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.style.fontSize = '18px';
      icon.innerText = 'account_circle';
      btn.appendChild(icon);
      
      btn.style.height = '100%';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.padding = '0 12px';
      
      btn.style.cursor = 'pointer';
      btn.style.webkitAppRegion = 'no-drag';
      tabsContainer.appendChild(btn);
    });
    
    // Re-append static tabs
    staticTabs.forEach(t => tabsContainer.appendChild(t));

    bindTabEvents();
  }

  function bindTabEvents() {
    const allTabs = document.querySelectorAll('#tabs .p-btn');
    allTabs.forEach(tab => {
      // Remove old listeners to prevent duplicates
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);
      
      newTab.addEventListener('click', () => {
        document.querySelectorAll('#tabs .p-btn').forEach(t => t.classList.remove('p-btn-active'));
        newTab.classList.add('p-btn-active');
        
        const tabId = newTab.getAttribute('data-id');
        const settingsView = document.getElementById('settings-view');
        const mediaView = document.getElementById('media-view');
        
        if (tabId === 'settings') {
          settingsView.style.display = 'block';
          mediaView.style.display = 'none';
        } else if (tabId === 'media') {
          settingsView.style.display = 'none';
          mediaView.style.display = 'block';
        } else {
          settingsView.style.display = 'none';
          mediaView.style.display = 'none';
        }
        
        if (window.electronAPI && window.electronAPI.switchTab) {
          window.electronAPI.switchTab(tabId);
        }
      });
    });
  }

  function renderSettingsAccounts() {
    const addBtn = document.getElementById('add-account-btn');
    const namesContainer = document.getElementById('account-names-container');
    if (!addBtn || !namesContainer) return;
    
    addBtn.style.display = currentAccounts.length >= 5 ? 'none' : 'block';
    
    namesContainer.innerHTML = '';
    currentAccounts.forEach((acc, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '8px';
      row.style.alignItems = 'center';

      const input = document.createElement('input');
      input.className = 'p-form-text';
      input.style.flex = '1';
      input.style.margin = '0';
      input.type = 'text';
      input.value = acc.name;
      input.placeholder = `Account ${i + 1} Name`;
      input.onchange = async (e) => {
        const newName = e.target.value.trim() || `Account ${i + 1}`;
        currentAccounts[i].name = newName;
        if (window.electronAPI && window.electronAPI.updateAccounts) {
          currentAccounts = await window.electronAPI.updateAccounts([...currentAccounts]);
          renderTabs();
          renderSettingsAccounts(); 
        }
      };
      row.appendChild(input);

      if (currentAccounts.length > 1) { 
        const removeBtn = document.createElement('button');
        removeBtn.className = 'p-btn';
        removeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
        removeBtn.title = 'Remove Account';
        removeBtn.style.flexShrink = '0';
        removeBtn.style.padding = '4px 8px';
        removeBtn.style.color = 'var(--error)';
        
        removeBtn.onclick = async () => {
          if (window.electronAPI && window.electronAPI.confirmDeleteAccount) {
            const confirmed = await window.electronAPI.confirmDeleteAccount(1);
            if (!confirmed) return;
          }
          currentAccounts.splice(i, 1);
          if (window.electronAPI && window.electronAPI.updateAccounts) {
            currentAccounts = await window.electronAPI.updateAccounts([...currentAccounts]);
            renderTabs();
            renderSettingsAccounts();
          }
        };
        row.appendChild(removeBtn);
      }
      
      namesContainer.appendChild(row);
    });

    addBtn.onclick = async () => {
      if (currentAccounts.length >= 5) return;
      const newId = `account_${Date.now()}`;
      const newName = `Account ${currentAccounts.length + 1}`;
      currentAccounts.push({ id: newId, name: newName });
      if (window.electronAPI && window.electronAPI.updateAccounts) {
        currentAccounts = await window.electronAPI.updateAccounts([...currentAccounts]);
        renderTabs();
        renderSettingsAccounts();
      }
    };
  }

  // --- LOCALIZATION ENGINE ---
  let currentLang = 'en';
  let translations = {};

  async function loadTranslations(lang) {
    try {
      const res = await fetch(`locales/${lang}_lang.json`);
      translations = await res.json();
      applyTranslations();
    } catch (e) {
      console.error('Failed to load language', lang, e);
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.innerText = translations[key];
      }
    });
  }

  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      loadTranslations(currentLang);
      if (window.electronAPI && window.electronAPI.saveSetting) {
         window.electronAPI.saveSetting('language', currentLang);
      }
    });
  }

  // --- THEME LOGIC ---
  function applyTheme(theme) {
    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDark) {
      document.body.classList.add('p-dark-mode');
    } else {
      document.body.classList.remove('p-dark-mode');
    }
  }

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const newTheme = e.target.value;
      applyTheme(newTheme);
      if (window.electronAPI && window.electronAPI.updateTheme) {
        window.electronAPI.updateTheme(newTheme);
      }
    });
  }

  // Listen for Download Events
  if (window.electronAPI && window.electronAPI.onDownloadComplete) {
    window.electronAPI.onDownloadComplete((result) => {
      showToast(result);
      if (result.success || result.reason === 'duplicate') {
        const activeFilter = document.querySelector('.filter-btn.p-btn-active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'All';
        renderMedia(filter);
      }
    });
  }

  // --- LOAD SETTINGS ON BOOT ---
  if (window.electronAPI && window.electronAPI.getSettings) {
    window.electronAPI.getSettings().then(settings => {
      if (settings.language) {
        currentLang = settings.language;
        if (langSelect) langSelect.value = currentLang;
      }
      loadTranslations(currentLang);

      if (settings.theme) {
        if (themeSelect) themeSelect.value = settings.theme;
        applyTheme(settings.theme);
      } else {
        applyTheme('system');
      }

      if (settings.accounts) {
        currentAccounts = settings.accounts;
        renderTabs();
        renderSettingsAccounts();
      } else {
        bindTabEvents(); 
      }

      const autoOrganizeToggle = document.getElementById('auto-organize-toggle');
      if (autoOrganizeToggle) autoOrganizeToggle.checked = settings.autoOrganize;
      
      const duplicateSelect = document.getElementById('duplicate-select');
      if (duplicateSelect) duplicateSelect.value = settings.duplicateAction;
    });
  } else {
    loadTranslations(currentLang);
    bindTabEvents(); 
  }

  // Settings UI Wiring
  const autoOrganizeToggle = document.getElementById('auto-organize-toggle');
  if (autoOrganizeToggle) {
    autoOrganizeToggle.addEventListener('change', (e) => {
      if (window.electronAPI && window.electronAPI.saveSetting) {
        window.electronAPI.saveSetting('autoOrganize', e.target.checked);
      }
    });
  }

  const duplicateSelect = document.getElementById('duplicate-select');
  if (duplicateSelect) {
    duplicateSelect.addEventListener('change', (e) => {
      if (window.electronAPI && window.electronAPI.saveSetting) {
        window.electronAPI.saveSetting('duplicateAction', e.target.value);
      }
    });
  }

  // --- MEDIA GALLERY LOGIC ---
  const mediaList = document.getElementById('media-list');
  const mediaFilters = document.querySelectorAll('.filter-btn');

  function renderMedia(filter = 'All') {
    if (window.electronAPI && window.electronAPI.getMediaFiles) {
      window.electronAPI.getMediaFiles(filter).then(files => {
        if (files.length === 0) {
          mediaList.innerHTML = `
            <div id="media-empty" style="text-align: center; color: gray; margin-top: 60px; grid-column: 1 / -1;">
               <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.5;">inbox</span>
               <p data-i18n="Media_Empty" style="margin-top: 16px;">No media downloaded yet</p>
            </div>
          `;
          applyTranslations();
          return;
        }

        mediaList.innerHTML = '';
        files.forEach(f => {
          const item = document.createElement('div');
          item.style.border = '1px solid rgba(128,128,128,0.2)';
          item.style.borderRadius = '8px';
          item.style.padding = '16px';
          item.style.cursor = 'pointer';
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.gap = '12px';
          item.onclick = () => {
             if (window.electronAPI && window.electronAPI.openMedia) {
                window.electronAPI.openMedia(f.filePath);
             }
          };
          
          let icon = 'description'; 
          if (f.mediaType.includes('image')) icon = 'image';
          if (f.mediaType.includes('video')) icon = 'movie';
          if (f.mediaType.includes('audio')) icon = 'audiotrack';

          item.innerHTML = `
            <div style="background: rgba(128,128,128,0.1); border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
              <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div style="flex: 1; overflow: hidden;">
              <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${f.fileName}">${f.fileName}</div>
              <div style="font-size: 0.75rem; color: gray; margin-top: 4px;">${(f.fileSize / 1024 / 1024).toFixed(2)} MB • ${new Date(f.downloadedAt).toLocaleDateString()}</div>
            </div>
          `;
          mediaList.appendChild(item);
        });
      });
    }
  }

  mediaFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      mediaFilters.forEach(b => b.classList.remove('p-btn-active'));
      e.target.classList.add('p-btn-active');
      renderMedia(e.target.getAttribute('data-filter'));
    });
  });

  const mediaTab = document.querySelector('button[data-id="media"]');
  if (mediaTab) {
    mediaTab.addEventListener('click', () => renderMedia('All'));
  }
});

function showToast(result) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  
  if (result.success) {
    toast.className = 'toast success';
    toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Saved: ${result.fileName}`;
  } else if (result.reason === 'duplicate') {
    toast.className = 'toast warning';
    toast.innerHTML = `<span class="material-symbols-outlined">info</span> Skipped Duplicate: ${result.fileName}`;
  } else {
    toast.className = 'toast error';
    toast.innerHTML = `Error saving file!`;
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
