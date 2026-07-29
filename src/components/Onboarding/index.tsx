import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { FolderOpen, User, CaretLeft } from '@phosphor-icons/react';
import { OnboardingLayout, OnboardingHeader, OnboardingInput, OnboardingButton } from './OnboardingComponents';
import WelcomePhase from './WelcomePhase';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import NammilLogo from '../../assets/nammil_outline.webp';

interface OnboardingProps {
  onComplete: (accounts: any[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { t } = useI18n();
  const [step, setStep] = useState<'welcome' | 'setup'>('welcome');
  const [hasSeenGreeting, setHasSeenGreeting] = useState(false);
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
        onComplete([{ id: 'account_1', name: accountName.trim() }]);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: step === 'welcome' ? 'block' : 'none', height: '100%' }}>
        <WelcomePhase 
            skipGreeting={hasSeenGreeting} 
            onContinue={() => {
                setHasSeenGreeting(true);
                setStep('setup');
            }} 
        />
      </div>

      <div style={{ display: step === 'setup' ? 'block' : 'none', height: '100%' }}>
        <OnboardingLayout maxWidth="md">
        {/* Back Button positioned exactly in the top-left corner like native window controls */}
        <IconButton 
            onClick={() => setStep('welcome')}
            sx={{ 
                position: 'fixed',
                top: 8,
                left: 8,
                color: 'var(--onboarding-text-secondary)', 
                transition: 'color 0.2s',
                '&:hover': { color: 'var(--onboarding-text)' },
                zIndex: 10000,
                WebkitAppRegion: 'no-drag'
            }}
        >
            <CaretLeft size={24} weight="bold" />
        </IconButton>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '460px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            padding: '24px 0' // Removed unwanted left/right padding and huge top/bottom
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'stretch',
                gap: '24px' // Reduced gap to fit nicely
            }}>
                {/* Header section - Centered */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                        <div style={{ 
                            width: 40,
                            height: 40,
                            backgroundColor: 'var(--onboarding-text)',
                            WebkitMaskImage: `url(${NammilLogo})`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskImage: `url(${NammilLogo})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            marginRight: 0
                        }} />
                        <h1 style={{ 
                            fontSize: '21px', 
                            fontWeight: 'bold', 
                            fontFamily: "'Elvan Sans', sans-serif",
                            color: 'var(--onboarding-text)', 
                            margin: 0, 
                            letterSpacing: 0, 
                            whiteSpace: 'nowrap'
                        }}>
                            {t(k.BRAND_NAME)}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ fontSize: '14px', color: 'var(--onboarding-text-secondary)', margin: 0, fontWeight: '400', lineHeight: 1.4, maxWidth: '300px' }}>
                            {t(k.OB_SETUP_SUB)}
                        </p>
                    </div>
                </div>

                {/* Form section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <OnboardingInput
                        label={t(k.OB_ACCOUNT_NAME)}
                        value={accountName}
                        onChange={(e: any) => setAccountName(e.target.value)}
                        placeholder={t(k.OB_ACCOUNT_PLACEHOLDER)}
                        startIcon={<User size={20} />}
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: 'var(--onboarding-text-secondary)', 
                            marginBottom: '8px',
                            marginLeft: '16px',
                            textAlign: 'left'
                        }}>
                            {t(k.OB_MEDIA_LOC)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', width: '100%' }}>
                            <div style={{ 
                                flex: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                backgroundColor: 'var(--onboarding-input-bg)',
                                borderRadius: '24px',
                                height: 48,
                                boxSizing: 'border-box',
                                padding: '0 16px', // horizontal padding only, vertical handled by flex
                                overflow: 'hidden'
                            }}>
                                <span style={{ 
                                    fontSize: '14px', 
                                    color: 'var(--onboarding-text)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontFamily: 'monospace',
                                    marginTop: '2px' // optical alignment for monospace font
                                }}>
                                    {mediaFolder}
                                </span>
                            </div>
                            <IconButton 
                                onClick={handleBrowse}
                                sx={{ 
                                    bgcolor: 'var(--onboarding-input-bg)',
                                    color: 'var(--onboarding-text)',
                                    width: 48,
                                    height: 48,
                                    flexShrink: 0,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                <FolderOpen size={20} weight="fill" />
                            </IconButton>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <OnboardingButton onClick={handleStart} loading={isLoading}>
                            {t(k.OB_GET_STARTED)}
                        </OnboardingButton>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--onboarding-text-muted)',
                            marginTop: '12px',
                            textAlign: 'center',
                            opacity: 0.6,
                            whiteSpace: 'nowrap',
                            lineHeight: 1.4
                        }}>
                            {t(k.OB_MEDIA_LOC_SUB)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </OnboardingLayout>
      </div>
    </>
  );
};

export default Onboarding;
