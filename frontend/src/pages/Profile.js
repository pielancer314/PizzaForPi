import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider,
  Button,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock user data - replace with API call
const mockUser = {
  id: 'USR123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://source.unsplash.com/random/150x150?person',
  addresses: [
    {
      id: 1,
      label: 'Home',
      address: '123 Main St, Apt 4B, New York, NY 10001',
      default: true,
    },
    {
      id: 2,
      label: 'Work',
      address: '456 Business Ave, Floor 12, New York, NY 10002',
      default: false,
    },
  ],
  wallet: {
    address: '0xabc...123',
    balance: 150.75,
  },
  orderHistory: [
    {
      id: 'ORD123456',
      date: '2024-01-20T14:30:00',
      restaurant: 'Pizza Palace',
      total: 40.96,
      status: 'delivered',
    },
    {
      id: 'ORD123455',
      date: '2024-01-18T19:15:00',
      restaurant: 'Burger Joint',
      total: 25.50,
      status: 'delivered',
    },
  ],
  favorites: [
    {
      id: 'REST123',
      name: 'Pizza Palace',
      image: 'https://source.unsplash.com/random/80x80?pizza-restaurant',
      cuisine: 'Italian',
    },
    {
      id: 'REST124',
      name: 'Burger Joint',
      image: 'https://source.unsplash.com/random/80x80?burger-restaurant',
      cuisine: 'American',
    },
  ],
};

const TabPanel = ({ children, value, index, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    {...props}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setEditing(false);
  };

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Avatar
                  src={user.avatar}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                {editing ? (
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={editForm.email}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {user.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <EmailIcon fontSize="small" />
                        {user.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" />
                        {user.phone}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pi Wallet
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WalletIcon color="primary" />
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {user.wallet.address}
                </Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                π {user.wallet.balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  icon={<HistoryIcon />}
                  label="Order History"
                  iconPosition="start"
                />
                <Tab
                  icon={<LocationOnIcon />}
                  label="Addresses"
                  iconPosition="start"
                />
                <Tab
                  icon={<FavoriteIcon />}
                  label="Favorites"
                  iconPosition="start"
                />
              </Tabs>

              {/* Order History Tab */}
              <TabPanel value={activeTab} index={0}>
                <List>
                  {user.orderHistory.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem
                        component={Link}
                        to={`/order/${order.id}`}
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          gap: 2,
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <Box flex={1}>
                          <Typography variant="subtitle1">
                            {order.restaurant}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.date)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Typography>
                            ${order.total.toFixed(2)}
                          </Typography>
                          <Chip
                            label={order.status}
                            color={order.status === 'delivered' ? 'success' : 'primary'}
                            size="small"
                          />
                        </Box>
                      </ListItem>
                      {index < user.orderHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>

              {/* Addresses Tab */}
              <TabPanel value={activeTab} index={1}>
                <List>
                  {user.addresses.map((address, index) => (
                    <React.Fragment key={address.id}>
                      <ListItem
                        secondaryAction={
                          <Button variant="outlined" size="small">
                            Edit
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {address.label}
                              {address.default && (
                                <Chip label="Default" size="small" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={address.address}
                        />
                      </ListItem>
                      {index < user.addresses.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" fullWidth>
                    Add New Address
                  </Button>
                </Box>
              </TabPanel>

              {/* Favorites Tab */}
              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={2}>
                  {user.favorites.map((restaurant) => (
                    <Grid item xs={12} sm={6} key={restaurant.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar
                              src={restaurant.image}
                              variant="rounded"
                              sx={{ width: 80, height: 80 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6">
                                {restaurant.name}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                {restaurant.cuisine}
                              </Typography>
                              <Button
                                component={Link}
                                to={`/restaurant/${restaurant.id}`}
                                variant="outlined"
                                size="small"
                              >
                                Order Again
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
