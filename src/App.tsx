import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getTheme } from './theme';
import TopBar from './components/TopBar';
import Settings from './components/Settings/index';
import WhatsAppViews from './components/WhatsAppViews';
import SplashScreen from './components/SplashScreen';
import MediaLibrary from './components/Media/index';
import NotificationsPage, { NotificationItem } from './components/NotificationsPage/index';
import { useI18n } from './i18n/I18nContext';
import Onboarding from './components/Onboarding/index';

function App() {
  const { setLang } = useI18n();
  const [showSplash, setShowSplash] = useState(true);
  const isDevSplash = false; // DEV MODE: PAUSES SPLASH SCREEN
  const [userTheme, setUserTheme] = useState('system');
  const [activeTab, setActiveTab] = useState('settings');
  const [accounts, setAccounts] = useState([{ id: 'default', name: 'personal' }]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isFirstBoot, setIsFirstBoot] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('nammil-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // One-time initialization: load settings, accounts, and set the initial tab
  useEffect(() => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.getSettings().then((settings: any) => {
        if (settings) {
          if (settings.language) setLang(settings.language);
          if (settings.theme) setUserTheme(settings.theme);
          if (settings.accounts && settings.accounts.length > 0) {
            setAccounts(settings.accounts);
            setActiveTab(`wa-${settings.accounts[0].id}`);
          }
          if (settings.isFirstBoot === true) setIsFirstBoot(true);
        }
        setSettingsLoaded(true);
        if (!isDevSplash) setTimeout(() => setShowSplash(false), 2500);
      }).catch(() => {
        setSettingsLoaded(true);
        if (!isDevSplash) setTimeout(() => setShowSplash(false), 2500);
      });
    } else {
      setSettingsLoaded(true);
      setActiveTab('wa-default');
      if (!isDevSplash) setTimeout(() => setShowSplash(false), 2500);
    }
  }, [setLang]);

  // Only attach WhatsApp view after splash finishes and not in first boot onboarding
  useEffect(() => {
    if (!showSplash && !isFirstBoot && (window as any).electronAPI) {
      const targetView = activeTab.startsWith('wa-') ? activeTab.replace('wa-', '') : activeTab;
      (window as any).electronAPI.switchTab(targetView);
    }
  }, [showSplash, activeTab, isFirstBoot]);

  // Listen for custom audio preview requests from Settings tab
  useEffect(() => {
    if ((window as any).electronAPI && (window as any).electronAPI.onPlayNotificationSound) {
      const removeListener = (window as any).electronAPI.onPlayNotificationSound((soundType: string, customPath?: string) => {
        const bundledMp3s = ['thuli', 'thullal', 'thendral', 'minnal', 'kumizhi', 'alai'];
        let src = '';
        if (bundledMp3s.includes(soundType)) {
          src = `./sounds/${soundType}.mp3`;
        } else if (soundType === 'custom' && customPath) {
          src = `nammil://media/${encodeURIComponent(customPath)}`;
        }
        if (!src) return;
        const audio = new Audio(src);
        audio.play().catch(() => {});
      });
      return () => removeListener();
    }
  }, []);

  // Listen for notification clicks from main.js to switch active tab to the account that sent the notification
  useEffect(() => {
    if ((window as any).electronAPI && (window as any).electronAPI.onSwitchToAccountTab) {
      const removeListener = (window as any).electronAPI.onSwitchToAccountTab((tabId: string) => {
        setActiveTab(tabId);
      });
      return () => removeListener();
    }
  }, []);

  useEffect(() => {
    if ((window as any).electronAPI && (window as any).electronAPI.onReceivedNotification) {
      const removeListener = (window as any).electronAPI.onReceivedNotification((item: NotificationItem) => {
        setNotifications((prev) => {
          const newList = [item, ...prev];
          return newList.slice(0, 200); // Keep max 200 notifications
        });
      });
      return () => removeListener();
    }
  }, []);

  // Sync notifications to localStorage and taskbar badge
  useEffect(() => {
    try {
      localStorage.setItem('nammil-notifications', JSON.stringify(notifications));
      if ((window as any).electronAPI && (window as any).electronAPI.setTaskbarBadge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        (window as any).electronAPI.setTaskbarBadge(unreadCount);
      }
    } catch {}
  }, [notifications]);

  const actualMode = userTheme === 'system' ? (prefersDarkMode ? 'dark' : 'light') : userTheme;
  const theme = getTheme(actualMode);

  if (!settingsLoaded) {
    return (
      <Box sx={{ width: '100vw', height: '100vh', bgcolor: actualMode === 'dark' ? '#1d1f1f' : '#F7F5F3' }} />
    );
  }

  if (isFirstBoot) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Onboarding onComplete={(newAccounts) => {
          setAccounts(newAccounts);
          setActiveTab(`wa-${newAccounts[0].id}`);
          setIsFirstBoot(false);
          setShowSplash(true);
          if (!isDevSplash) setTimeout(() => setShowSplash(false), 2500);
        }} />
      </ThemeProvider>
    );
  }

  if (showSplash) return <SplashScreen isDark={prefersDarkMode} userTheme={userTheme} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
        <TopBar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          accounts={accounts} 
          unreadNotificationCount={notifications.filter(n => !n.read).length}
          notifications={notifications}
        />
        
        <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
          {activeTab === 'settings' && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'background.default', zIndex: 10 }}>
              <Settings accounts={accounts} setAccounts={setAccounts} userTheme={userTheme} setUserTheme={setUserTheme} />
            </Box>
          )}
          {activeTab === 'media' && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'background.default', zIndex: 10 }}>
              <MediaLibrary accounts={accounts} />
            </Box>
          )}
          {activeTab === 'notifications' && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'background.default', zIndex: 10 }}>
              <NotificationsPage
                accounts={accounts}
                notifications={notifications}
                onClearAll={() => setNotifications([])}
                onClearAccount={(accountName) => setNotifications((prev) => prev.filter(n => n.accountName !== accountName))}
                onClearSingle={(id) => setNotifications((prev) => prev.filter(n => n.id !== id))}
                onSelectNotification={(item) => {
                  setActiveTab(`wa-${item.accountId}`);
                  setNotifications((prev) => prev.filter(n => n.id !== item.id));
                  if ((window as any).electronAPI && (window as any).electronAPI.switchTab) {
                    (window as any).electronAPI.switchTab(item.accountId);
                  }
                }}
                onAddDevTestNotification={() => {
                  const now = Date.now();
                  const acc1 = accounts[0] || { id: 'acc1', name: 'Personal' };
                  const acc2 = accounts[1] || { id: 'acc2', name: 'Work' };
                  
                  const testNotifs = [
                    {
                      id: `dev-${now}-1`,
                      title: 'Elvan',
                      body: 'Hey! Could you review the latest PR? There is a massive refactor in the core module that touches the database synchronization logic, and we really need to make sure it doesn\'t break anything in production before our big launch tomorrow. Let me know what you think!',
                      accountName: acc1.name,
                      accountId: acc1.id,
                      timestamp: now,
                    },
                    {
                      id: `dev-${now}-2`,
                      title: 'Project Group',
                      body: 'Who is taking the notes today?',
                      accountName: acc1.name,
                      accountId: acc1.id,
                      timestamp: now - 60000,
                    },
                    {
                      id: `dev-${now}-3`,
                      title: 'Project Group',
                      body: 'I can do it!',
                      accountName: acc1.name,
                      accountId: acc1.id,
                      timestamp: now - 120000,
                    },
                    {
                      id: `dev-${now}-4`,
                      title: 'Project Group',
                      body: 'Thanks 🙏',
                      accountName: acc1.name,
                      accountId: acc1.id,
                      timestamp: now - 180000,
                    },
                    {
                      id: `dev-${now}-5`,
                      title: 'Client',
                      body: 'Approved.',
                      accountName: acc2.name,
                      accountId: acc2.id,
                      timestamp: now - 3600000,
                    },
                  ];

                  setNotifications((prev) => [...testNotifs, ...prev].slice(0, 200));
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
