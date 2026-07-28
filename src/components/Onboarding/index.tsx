import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, useTheme, InputAdornment, CircularProgress } from '@mui/material';
import { FolderOpen, User, CheckCircle } from '@phosphor-icons/react';

interface OnboardingProps {
  onComplete: (accounts: any[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const theme = useTheme();
  const [accountName, setAccountName] = useState('Personal');
  const [mediaFolder, setMediaFolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.getBaseMediaDir().then((dir: string) => {
        setMediaFolder(dir);
      }).catch(console.error);
    }
  }, []);

  const handleBrowse = async () => {
    if ((window as any).electronAPI && (window as any).electronAPI.pickFolder) {
      const selectedFolder = await (window as any).electronAPI.pickFolder();
      if (selectedFolder) {
        setMediaFolder(selectedFolder);
      }
    }
  };

  const handleStart = async () => {
    if (!accountName.trim() || !mediaFolder.trim()) return;
    setIsLoading(true);

    try {
      if ((window as any).electronAPI) {
        const newAccounts = [{ id: 'account_1', name: accountName.trim() }];
        const accounts = await (window as any).electronAPI.completeFirstBoot(newAccounts, mediaFolder);
        onComplete(accounts);
      } else {
        // Fallback for browser testing
        onComplete([{ id: 'account_1', name: accountName.trim() }]);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0b141a 0%, #111b21 100%)'
          : 'linear-gradient(135deg, #f0f2f5 0%, #e9edef 100%)',
        WebkitAppRegion: 'drag',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 6,
          borderRadius: 4,
          maxWidth: 500,
          width: '90%',
          textAlign: 'center',
          WebkitAppRegion: 'no-drag',
          background: theme.palette.mode === 'dark' ? 'rgba(32, 44, 51, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }}
      >
        <img 
          src="./app_icon.png" 
          alt="Elvan Nammil" 
          style={{ width: 96, height: 96, marginBottom: 24, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }} 
        />
        
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: theme.palette.text.primary }}>
          Welcome to Elvan Nammil
        </Typography>
        
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Let's set up your very first workspace. You can always add more accounts or change these settings later.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
          <TextField
            fullWidth
            label="Account Name"
            variant="outlined"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Media Storage Location"
            variant="outlined"
            value={mediaFolder}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <FolderOpen size={20} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button variant="outlined" size="small" onClick={handleBrowse} sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Browse
                  </Button>
                </InputAdornment>
              ),
            }}
            helperText="Where downloaded images, videos, and documents will be saved."
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          color="primary"
          onClick={handleStart}
          disabled={isLoading || !accountName.trim() || !mediaFolder.trim()}
          sx={{ 
            mt: 5, 
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: '0 8px 16px rgba(0, 168, 132, 0.3)',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 20px rgba(0, 168, 132, 0.4)',
            }
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle size={24} weight="fill" />}
        >
          {isLoading ? 'Setting up...' : 'Get Started'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Onboarding;
