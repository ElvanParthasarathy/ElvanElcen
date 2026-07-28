import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ChatCircle, Trash, Plus } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { useIsDark } from '../shared/hooks';
import { SettingsSection, SettingsRow } from '../shared/ElvanSettingsSection';
import { sanitizeName, validateAccountName } from './validation';
import WinUIDeleteDialog from './WinUIDeleteDialog';
import WinUIAddDialog from './WinUIAddDialog';

export default function AccountsTab({ accounts, setAccounts }: any) {
  const isDark = useIsDark();
  const { t } = useI18n();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  const handleAddClick = () => {
    if (accounts.length >= 5) {
      alert(t(k.ALERT_MAX_ACCOUNTS));
      return;
    }
    setNewAccountName('');
    setIsAdding(true);
  };

  const confirmAddAccount = () => {
    if (!newAccountName.trim()) return;
    const sanitized = sanitizeName(newAccountName);
    const error = validateAccountName(newAccountName, accounts, t, k);
    if (error) { alert(error); return; }
    const newAccounts = [...accounts, { id: sanitized, name: sanitized }];
    setAccounts(newAccounts);
    if ((window as any).electronAPI) (window as any).electronAPI.updateAccounts(newAccounts);
    setIsAdding(false);
  };


  const handleRemoveAccount = (index: number) => {
    if (accounts.length <= 1) return;
    setAccountToDelete(index);
  };

  const confirmRemoveAccount = async () => {
    if (accountToDelete === null) return;
    const index = accountToDelete;
    
    const newAccounts = accounts.filter((_: any, i: number) => i !== index);
    setAccounts(newAccounts);
    if ((window as any).electronAPI) (window as any).electronAPI.updateAccounts(newAccounts);
    setAccountToDelete(null);
  };

  return (
    <>
      <Box>
        <SettingsSection>
          {accounts.map((acc: any, index: number) => (
            <SettingsRow
              key={acc.id}
              icon={<ChatCircle size={20} weight="fill" />}
              iconColor="monochrome"
              title={acc.name}
              description={`${t(k.ACCOUNTS_INSTANCE)} ${index + 1}`}
              control={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {accounts.length > 1 && (
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); handleRemoveAccount(index); }} 
                      size="small"
                      sx={{ 
                        color: 'var(--mac-text-secondary)', 
                        bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        padding: '8px',
                        '&:hover': { 
                          color: 'var(--mac-text)',
                          bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                        } 
                      }}
                    >
                      <Trash size={18} />
                    </IconButton>
                  )}
                </Box>
              }
            />
          ))}
          {accounts.length < 5 && (
            <SettingsRow
              icon={<Plus size={20} weight="bold" />}
              iconColor="monochrome"
              title={t(k.ACCOUNTS_ADD)}
              onClick={handleAddClick}
              sx={{
                color: isDark ? '#fff' : '#000',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                }
              }}
            />
          )}
        </SettingsSection>
      </Box>

      <WinUIAddDialog
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onConfirm={confirmAddAccount}
        accountName={newAccountName}
        onAccountNameChange={setNewAccountName}
      />

      <WinUIDeleteDialog
        open={accountToDelete !== null}
        onClose={() => setAccountToDelete(null)}
        onConfirm={confirmRemoveAccount}
        accountName={accountToDelete !== null ? accounts[accountToDelete]?.name : ''}
      />
    </>
  );
}
