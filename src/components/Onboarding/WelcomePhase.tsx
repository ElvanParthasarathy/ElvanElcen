import React, { useState, useEffect } from 'react';
import { OnboardingLayout, OnboardingButton } from './OnboardingComponents';
import { CheckCircle, GlobeHemisphereWest } from '@phosphor-icons/react';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import NammilLogo from '../../assets/nammil_outline.webp';

const GREETINGS = ["வணக்கம்!", "Hello!", "നമസ്കാരം!"];

export default function WelcomePhase({ onContinue, skipGreeting }: { onContinue: () => void, skipGreeting?: boolean }) {
    const { t, lang, setLang } = useI18n();
    
    const [phase, setPhase] = useState<'greeting' | 'language'>(skipGreeting ? 'language' : 'greeting');
    const [greetingIndex, setGreetingIndex] = useState(-1); // -1 is for the logo
    const [greetingOpacity, setGreetingOpacity] = useState(0);
    const [showLanguage, setShowLanguage] = useState(false);

    useEffect(() => {
        let loopCount = 0;
        let isMounted = true;

        const runGreetingLoop = async () => {
            while (isMounted && phase === 'greeting') {
                // Fade in
                setGreetingOpacity(1);
                await new Promise(r => setTimeout(r, 700));
                
                // Fade out
                setGreetingOpacity(0);
                await new Promise(r => setTimeout(r, 400));
                
                if (!isMounted) break;

                // Move to next greeting or switch to language phase
                loopCount++;
                if (loopCount >= GREETINGS.length + 1) {
                    setPhase('language');
                    break;
                } else {
                    setGreetingIndex((prev) => prev + 1);
                }
            }
        };

        if (phase === 'greeting') {
            runGreetingLoop();
        }

        return () => { isMounted = false; };
    }, [phase]);

    useEffect(() => {
        if (phase === 'language') {
            setTimeout(() => setShowLanguage(true), 100);
        }
    }, [phase]);

    return (
        <OnboardingLayout hideLogo maxWidth="md">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '800px', // increased for two panels
                margin: '0 auto',
                width: '100%',
                position: 'relative',
                padding: '0 24px' // add some padding for smaller windows
            }}>
                
                {/* PHASE 1: GREETING ANIMATION */}
                {phase === 'greeting' && (
                    <div style={{
                        opacity: greetingOpacity,
                        transition: 'opacity 0.4s ease-in-out',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }}>
                        {greetingIndex === -1 ? (
                            <div style={{ 
                                width: 75,
                                height: 75,
                                backgroundColor: 'var(--onboarding-text)',
                                WebkitMaskImage: `url(${NammilLogo})`,
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskImage: `url(${NammilLogo})`,
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center'
                            }} />
                        ) : (
                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: '300',
                                color: 'var(--onboarding-text)',
                                margin: 0,
                                letterSpacing: '-1px'
                            }}>
                                {GREETINGS[greetingIndex]}
                            </h1>
                        )}
                    </div>
                )}

                {/* PHASE 2: LANGUAGE SELECTION SCREEN */}
                {phase === 'language' && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', // Changed to column to hold top branding + row panels
                        width: '100%',
                        opacity: showLanguage ? 1 : 0,
                        transform: showLanguage ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}>
                        
                        {/* 2-PANEL LAYOUT */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '48px',
                            flexWrap: 'wrap'
                        }}>
                            
                            {/* LEFT PANEL: Info */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                flex: 1,
                                minWidth: '300px',
                                gap: '24px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '20px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}>
                                        <GlobeHemisphereWest size={40} weight="regular" color="var(--onboarding-text)" />
                                    </div>
                                    <div style={{
                                        textAlign: 'left',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    }}>
                                        <h1 style={{
                                            fontSize: 'clamp(22px, 3.5vw, 28px)', // Reduced size to prevent excessive wrapping
                                            fontWeight: '700',
                                            color: 'var(--onboarding-text)',
                                            margin: 0,
                                            letterSpacing: '-0.5px',
                                            lineHeight: 1.2
                                        }}>
                                            {t(k.OB_SELECT_LANG)}
                                        </h1>
                                    <p style={{
                                        fontSize: '15px',
                                        color: 'var(--onboarding-text-secondary)',
                                        margin: 0,
                                        fontWeight: '400' // Slimmed font
                                    }}>
                                        {t(k.OB_SELECT_LANG_SUB)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Language List & Action */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '300px',
                        }}>
                            <div style={{
                                width: '100%',
                                maxWidth: '380px',
                                backgroundColor: 'var(--onboarding-input-bg)',
                                borderRadius: '16px',
                                padding: '8px 0',
                            }}>
                                <List sx={{
                                    maxHeight: '344px',
                                    overflowY: 'auto',
                                    p: 0,
                                    '&::-webkit-scrollbar': { width: '6px' },
                                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                                    '&::-webkit-scrollbar-thumb': { background: 'var(--onboarding-divider)', borderRadius: '10px' },
                                }}>
                                {[
                                    { code: 'system', label: t(k.LANG_SYSTEM) },
                                    { code: 'ta', label: 'தமிழ்', sub: t(k.LANG_TA) },
                                    { code: 'ta_latn', label: 'Thamizh', sub: t(k.LANG_TA_LATN) },
                                    { code: 'ta_ml', label: 'തമിഴ്', sub: t(k.LANG_TA_ML) },
                                    { code: 'ml', label: 'മലയാളം', sub: t(k.LANG_ML) },
                                    { code: 'ml_latn', label: 'Malayalam', sub: t(k.LANG_ML_LATN) },
                                    { code: 'ml_tam', label: 'மலயாளம்', sub: t(k.LANG_ML_TAM) },
                                    { code: 'en', label: 'English', sub: t(k.LANG_EN) }
                                ].map((l, index, arr) => (
                                    <React.Fragment key={l.code}>
                                        <ListItem disablePadding>
                                            <ListItemButton 
                                                onClick={() => setLang(l.code)} 
                                                sx={{ py: 1, px: 3, bgcolor: 'transparent', '@media (hover: hover)': { '&:hover': { bgcolor: 'transparent' } } }}
                                                disableRipple
                                            >
                                                <ListItemText 
                                                    primary={
                                                        <span style={{ fontSize: '15px', fontWeight: lang === l.code ? 600 : 500, color: 'var(--onboarding-text)' }}>
                                                            {l.label}
                                                        </span>
                                                    } 
                                                    secondary={
                                                        l.sub ? (
                                                            <span style={{ fontSize: '12px', color: 'var(--onboarding-text-secondary)', display: 'block', marginTop: '2px' }}>
                                                                {l.sub}
                                                            </span>
                                                        ) : undefined
                                                    }
                                                />
                                                {lang === l.code && (
                                                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                                                        <CheckCircle size={18} weight="fill" color="var(--onboarding-text)" />
                                                    </ListItemIcon>
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                        {index < arr.length - 1 && <Divider sx={{ mx: 3, borderColor: 'var(--onboarding-divider)' }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                            </div>

                            <div style={{ width: '100%', maxWidth: '380px', marginTop: '24px' }}>
                                <OnboardingButton onClick={onContinue}>
                                    {t(k.OB_CONTINUE)}
                                </OnboardingButton>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OnboardingLayout>
    );
}
