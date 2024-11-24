import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalPizza,
  Security,
  Speed,
  Payment,
} from '@mui/icons-material';
import RestaurantCard from '../components/restaurant/RestaurantCard';

const features = [
  {
    icon: <LocalPizza fontSize="large" />,
    title: 'Wide Selection',
    description: 'Choose from hundreds of local restaurants offering your favorite dishes.',
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Secure Payments',
    description: 'Pay securely using Pi cryptocurrency with blockchain technology.',
  },
  {
    icon: <Speed fontSize="large" />,
    title: 'Real-time Tracking',
    description: 'Track your order in real-time from restaurant to delivery.',
  },
  {
    icon: <Payment fontSize="large" />,
    title: 'Pi Network',
    description: 'Integrated with Pi Network for secure and fast transactions.',
  },
];

const popularRestaurants = [
  {
    _id: '1',
    name: 'Pizza Palace',
    description: 'The best pizza in town with authentic Italian recipes.',
    cuisine: ['Italian', 'Pizza', 'Fast Food'],
    rating: { average: 4.5, count: 128 },
    image: 'https://source.unsplash.com/random/400x300?pizza',
  },
  {
    _id: '2',
    name: 'Burger House',
    description: 'Gourmet burgers made with premium ingredients.',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: { average: 4.3, count: 95 },
    image: 'https://source.unsplash.com/random/400x300?burger',
  },
  {
    _id: '3',
    name: 'Sushi Master',
    description: 'Fresh and authentic Japanese sushi experience.',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    rating: { average: 4.7, count: 156 },
    image: 'https://source.unsplash.com/random/400x300?sushi',
  },
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          borderRadius: theme.shape.borderRadius,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Order Food with
                <br />
                Pi Cryptocurrency
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Secure, fast, and convenient food delivery powered by blockchain technology
              </Typography>
              <TextField
                fullWidth
                placeholder="Search for restaurants or cuisines..."
                variant="outlined"
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: theme.shape.borderRadius,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://source.unsplash.com/random/600x400?food-delivery"
                alt="Food Delivery"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[4],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 6 }}>
            Why Choose PizzaForPi?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'primary.light',
                      p: 2,
                      borderRadius: '50%',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Restaurants Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
              Popular Restaurants
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/restaurants')}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {popularRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
