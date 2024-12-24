import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Collapse,
  Avatar,
  Divider,
  Badge,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as VoucherIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  DirectionsCar as TransferIcon,
  Event as EventIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  AccountCircle,
  BusinessCenter,
  LocalActivity,
  AttachMoney,
  Assessment,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const operationsItems = [
    { text: 'Service Vouchers', icon: <VoucherIcon />, path: '/vouchers' },
    { text: 'Hotel Vouchers', icon: <HotelIcon />, path: '/hotel-vouchers' },
    //{ text: 'Flight Bookings', icon: <FlightIcon />, path: '/flights' },
    //{ text: 'Hotel Reservations', icon: <HotelIcon />, path: '/hotels' },
    //{ text: 'Transfers', icon: <TransferIcon />, path: '/transfers' },
    //{ text: 'Activities', icon: <LocalActivity />, path: '/activities' },
  ];

  const reportItems = [
    { text: 'Financial Reports', icon: <AttachMoney />, path: '/reports/financial' },
    { text: 'Booking Analytics', icon: <Assessment />, path: '/reports/analytics' },
    { text: 'Performance', icon: <BusinessCenter />, path: '/reports/performance' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <FlightIcon />
        </Avatar>
        <Typography variant="h6" noWrap component="div">
          Travel Ops
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => handleNavigate('/')}
          selected={isActive('/')}
          sx={{
            borderRadius: '8px',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => setOperationsOpen(!operationsOpen)}>
          <ListItemIcon>
            <BusinessCenter />
          </ListItemIcon>
          <ListItemText primary="Operations" />
          {operationsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={operationsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {operationsItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  pl: 4,
                  borderRadius: '8px',
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem button onClick={() => setReportsOpen(!reportsOpen)}>
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Reports & Analytics" />
          {reportsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {reportItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  pl: 4,
                  borderRadius: '8px',
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => handleNavigate('/settings')}
          selected={isActive('/settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;
