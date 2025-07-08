import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Snackbar from '@mui/material/Snackbar';
import { useColorScheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import SelectDialog from '@/components/SelectDialog';
import currencies, { type CurrencyCode } from '@/data/currencies';
import { backupDatabase, restoreDatabase } from '@/lib/db';
import settings from '@/lib/settings';
import type { ThemeMode } from '@/types/common';

const currencyOptions = Object.entries(currencies).map(([code, { name }]) => ({
  label: name,
  value: code as CurrencyCode,
}));

const themeModeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
] as const;

async function getPermissions(): Promise<boolean> {
  const { publicStorage } = await Filesystem.checkPermissions();
  if (publicStorage !== 'granted') {
    const { publicStorage } = await Filesystem.requestPermissions();
    if (publicStorage !== 'granted') {
      return false;
    }
    return true;
  }
  return true;
}

type SnackbarType = {
  message: string;
  open: boolean;
};

function Settings() {
  const navigate = useNavigate();
  const { setMode } = useColorScheme();

  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(settings.get('currencyCode'));
  const [themeModePickerOpen, setThemeModePickerOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(settings.get('themeMode'));

  const [snackbar, setSnackbar] = useState<SnackbarType>({
    message: '',
    open: false,
  });

  const handleChangeCurrency = async (value: CurrencyCode) => {
    await settings.set('currencyCode', value);
    setCurrencyCode(value);
  };

  const handleChangeThemeMode = async (value: ThemeMode) => {
    await settings.set('themeMode', value);
    setMode(value);
    setThemeMode(value);
  };

  const handleBackup = async () => {
    if (!(await getPermissions())) {
      setSnackbar({ message: 'Permission denied', open: true });
      return;
    }

    const backupData = await backupDatabase();
    const { uri } = await Filesystem.writeFile({
      data: JSON.stringify(backupData),
      path: `Download/finance_tracker-${dayjs().format('YYYYMMDD_HHmmss')}.json`,
      directory: Directory.ExternalStorage,
      encoding: Encoding.UTF8,
    });
    setSnackbar({ message: `Saved to ${uri.replace(/^file:\/\//, '')}`, open: true });
  };

  const handleRestore = async () => {
    if (!(await getPermissions())) {
      setSnackbar({ message: 'Permission denied', open: true });
      return;
    }

    const result = await FilePicker.pickFiles({
      types: ['application/json'],
      limit: 1,
    });
    const file = result.files[0];
    if (!file) return;

    let data: string;
    if (Capacitor.getPlatform() === 'web') {
      data = await file.blob!.text();
    } else {
      const readResult = await Filesystem.readFile({
        path: file.path!,
        encoding: Encoding.UTF8,
      });
      data = readResult.data as string;
    }

    try {
      await restoreDatabase(JSON.parse(data));
      setSnackbar({ message: 'Backup data has been restored', open: true });
    } catch (err) {
      console.error(err);
      setSnackbar({ message: 'Invalid backup file', open: true });
    }
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            aria-label="go back"
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <List subheader={<ListSubheader>General</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setCurrencyPickerOpen(true)}>
            <ListItemText primary="Currency" secondary={currencies[currencyCode].name} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setThemeModePickerOpen(true)}>
            <ListItemText
              primary="Theme"
              secondary={themeModeOptions.find((option) => option.value === themeMode)?.label}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Backup & Restore</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="Backup"
              secondary="Save data to a backup file."
              onClick={handleBackup}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="Restore"
              secondary={
                <>
                  <Box component="span" sx={{ display: 'block', mb: 2 }}>
                    Restore data from a backup file.
                  </Box>
                  Recommended for fresh installs or after clearing app data, as existing data may
                  cause some issues.
                </>
              }
              onClick={handleRestore}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <SelectDialog
        title="Select Currency"
        open={currencyPickerOpen}
        value={currencyCode}
        options={currencyOptions}
        onChange={handleChangeCurrency}
        onClose={() => setCurrencyPickerOpen(false)}
      />
      <SelectDialog
        title="Select Theme"
        open={themeModePickerOpen}
        value={themeMode}
        options={themeModeOptions}
        onChange={handleChangeThemeMode}
        onClose={() => setThemeModePickerOpen(false)}
      />
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            <ClearIcon />
          </IconButton>
        }
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        sx={{ wordBreak: 'break-word' }}
      />
    </>
  );
}

export default Settings;
