import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import { Link, Outlet, useLocation } from 'react-router';

function NavigationBar() {
  const routes = [
    { label: 'Home', path: '/home', icon: <HomeIcon /> },
    { label: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { label: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];
  const location = useLocation();
  const activeRoute = routes.findIndex(({ path }) => path === location.pathname);

  return (
    <BottomNavigation
      value={activeRoute}
      sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}
    >
      {routes.map(({ label, path, icon }) => (
        <BottomNavigationAction key={path} label={label} icon={icon} component={Link} to={path} />
      ))}
    </BottomNavigation>
  );
}

function AppLayout() {
  return (
    <>
      <Box sx={{ mb: 7 }}>
        <Outlet />
      </Box>
      <NavigationBar />
    </>
  );
}

export default AppLayout;
