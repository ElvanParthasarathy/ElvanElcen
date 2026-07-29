import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box, CircularProgress, Container, useTheme } from '@mui/material';
import './Onboarding.css';

export const OnboardingLayout = ({ children, hideLogo, maxWidth = "xs" }: { children: React.ReactNode, hideLogo?: boolean, maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    return (
        <div className={`onboarding-container ${isDark ? 'dark' : ''}`}>
            <div className="onboarding-shape shape-1" />
            <div className="onboarding-shape shape-2" />
            <div className="onboarding-shape shape-3" />
            <div className="onboarding-shape shape-4" />
            <Container component="main" maxWidth={maxWidth} className="onboarding-content" sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100%',
                position: 'relative',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 3, sm: 4 },
            }}>
                {children}
            </Container>
        </div>
    );
};

export const OnboardingHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="onboarding-header animate-enter delay-1">
        <div className="onboarding-title">{title}</div>
        <div className="onboarding-subtitle">{subtitle}</div>
    </div>
);

export const OnboardingInput = ({ label, value, onChange, type = "text", placeholder, icon, error, helperText, readOnly, ...props }: any) => {
    return (
        <Box className="onboarding-field animate-enter delay-2" sx={{ width: '100%', mb: 2, textAlign: 'left' }}>
            {label && (
                <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: 'var(--onboarding-text-secondary)', 
                    marginBottom: (helperText && !error) ? '2px' : '4px',
                    marginLeft: '16px' 
                }}>
                    {label}
                </div>
            )}
            {helperText && !error && (
                <div style={{
                    fontSize: '11px',
                    color: 'var(--onboarding-text-muted)',
                    marginBottom: '8px',
                    marginLeft: '16px',
                    lineHeight: 1.4
                }}>
                    {helperText}
                </div>
            )}
            <TextField
                fullWidth
                variant="filled"
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                error={!!error}
                helperText={error}
                sx={{
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'var(--onboarding-input-bg)',
                        border: 'none',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        height: '48px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        '@media (hover: hover)': { '&:hover': {
                            backgroundColor: 'var(--onboarding-input-bg)',
                            filter: 'brightness(0.98)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)'
                        } },
                        '&.Mui-focused': {
                            backgroundColor: 'var(--onboarding-input-bg)',
                            filter: 'brightness(0.98)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)'
                        }
                    },
                    '& .MuiFilledInput-input': {
                        padding: '0 24px',
                        height: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 100px var(--onboarding-input-bg) inset !important',
                            WebkitTextFillColor: 'var(--onboarding-text) !important',
                            borderRadius: '0px'
                        }
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: '10px',
                        marginLeft: '12px',
                        marginTop: '6px',
                        '&:not(.Mui-error)': {
                            color: 'var(--onboarding-text-muted)'
                        }
                    }
                }}
                slotProps={{
                    input: {
                        disableUnderline: true,
                        readOnly,
                        startAdornment: icon ? (
                            <InputAdornment position="start">
                                {icon}
                            </InputAdornment>
                        ) : null,
                        endAdornment: props.endAdornment ? (
                            <InputAdornment position="end">
                                {props.endAdornment}
                            </InputAdornment>
                        ) : null,
                    }
                }}
                {...props}
            />
        </Box>
    );
};

export const OnboardingButton = ({ children, onClick, disabled, loading, secondary, className = "", type = "button" }: any) => (
    <Button
        fullWidth
        type={type}
        variant={secondary ? 'outlined' : 'contained'}
        color="primary"
        size="large"
        className={`animate-enter delay-3 ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        sx={{
            py: 1.5,
            borderRadius: 50,
            mt: 2,
            mb: 1,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: secondary ? 'transparent' : 'var(--onboarding-accent)',
            color: secondary ? 'var(--onboarding-text)' : 'var(--onboarding-btn-text)',
            boxShadow: secondary ? 'none' : '0 4px 12px var(--onboarding-btn-shadow)',
            ...(secondary && {
                borderColor: 'var(--onboarding-text)',
                '@media (hover: hover)': { '&:hover': {
                    borderColor: 'var(--onboarding-text)',
                    backgroundColor: 'rgba(128, 128, 128, 0.08)'
                } }
            }),
            ...(!secondary && {
                '@media (hover: hover)': { '&:hover': {
                    backgroundColor: 'var(--onboarding-accent-light)',
                } }
            })
        }}
    >
        {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
);
