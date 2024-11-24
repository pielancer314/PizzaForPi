import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Rating,
  Divider,
  Badge,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';

// Mock data - replace with API call
const mockRestaurant = {
  _id: '1',
  name: 'Pizza Palace',
  description: 'The best pizza in town with authentic Italian recipes and fresh ingredients.',
  cuisine: ['Italian', 'Pizza', 'Fast Food'],
  rating: { average: 4.5, count: 128 },
  image: 'https://source.unsplash.com/random/1200x400?pizza-restaurant',
  estimatedDeliveryTime: '30-45',
  address: '123 Main St, New York, NY 10001',
  menu: [
    {
      category: 'Popular Items',
      items: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
          price: 14.99,
          image: 'https://source.unsplash.com/random/300x200?pizza-margherita',
          popular: true,
          spicy: false,
          vegetarian: true,
        },
        {
          id: '2',
          name: 'Pepperoni Pizza',
          description: 'Classic pepperoni with mozzarella and tomato sauce',
          price: 16.99,
          image: 'https://source.unsplash.com/random/300x200?pizza-pepperoni',
          popular: true,
          spicy: false,
          vegetarian: false,
        },
      ],
    },
    {
      category: 'Pizzas',
      items: [
        {
          id: '3',
          name: 'Supreme Pizza',
          description: 'Loaded with vegetables, meats, and extra cheese',
          price: 18.99,
          image: 'https://source.unsplash.com/random/300x200?pizza-supreme',
          popular: false,
          spicy: false,
          vegetarian: false,
        },
        {
          id: '4',
          name: 'Buffalo Chicken Pizza',
          description: 'Spicy buffalo chicken with ranch and blue cheese',
          price: 17.99,
          image: 'https://source.unsplash.com/random/300x200?pizza-buffalo',
          popular: false,
          spicy: true,
          vegetarian: false,
        },
      ],
    },
    {
      category: 'Sides',
      items: [
        {
          id: '5',
          name: 'Garlic Knots',
          description: 'Fresh baked garlic knots with marinara sauce',
          price: 6.99,
          image: 'https://source.unsplash.com/random/300x200?garlic-bread',
          popular: true,
          spicy: false,
          vegetarian: true,
        },
        {
          id: '6',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing and croutons',
          price: 8.99,
          image: 'https://source.unsplash.com/random/300x200?caesar-salad',
          popular: false,
          spicy: false,
          vegetarian: true,
        },
      ],
    },
  ],
};

const RestaurantDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState({});

  const handleAddToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((sum, [itemId, count]) => {
      const item = mockRestaurant.menu
        .flatMap((category) => category.items)
        .find((item) => item.id === itemId);
      return sum + (item?.price || 0) * count;
    }, 0);
  };

  const MenuItem = ({ item }) => (
    <Card sx={{ display: 'flex', mb: 2, position: 'relative' }}>
      <Box
        component="img"
        sx={{
          width: 150,
          height: 150,
          objectFit: 'cover',
        }}
        src={item.image}
        alt={item.name}
      />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="h3">
              {item.name}
              {item.popular && (
                <Chip
                  size="small"
                  label="Popular"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {item.spicy && (
                <Chip size="small" label="Spicy" color="error" variant="outlined" />
              )}
              {item.vegetarian && (
                <Chip size="small" label="Vegetarian" color="success" variant="outlined" />
              )}
            </Box>
          </Box>
          <Typography variant="h6" color="primary">
            ${item.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <IconButton
            size="small"
            onClick={() => handleRemoveFromCart(item.id)}
            disabled={!cartItems[item.id]}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ mx: 2 }}>{cartItems[item.id] || 0}</Typography>
          <IconButton
            size="small"
            onClick={() => handleAddToCart(item.id)}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: 300,
          bgcolor: 'grey.900',
          color: 'common.white',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={mockRestaurant.image}
          alt={mockRestaurant.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pb: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
                {mockRestaurant.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={mockRestaurant.rating.average} precision={0.5} readOnly />
                  <Typography>({mockRestaurant.rating.count})</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon />
                  <Typography>{mockRestaurant.estimatedDeliveryTime} min</Typography>
                </Box>
                {mockRestaurant.cuisine.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                ))}
              </Box>
            </Box>
            <IconButton
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Menu Section */}
          <Grid item xs={12} md={8}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              {mockRestaurant.menu.map((category, index) => (
                <Tab key={category.category} label={category.category} />
              ))}
            </Tabs>

            {mockRestaurant.menu.map((category, index) => (
              <Box
                key={category.category}
                role="tabpanel"
                hidden={activeTab !== index}
              >
                {activeTab === index && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {category.category}
                    </Typography>
                    {category.items.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Grid>

          {/* Cart Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: 'sticky',
                top: theme.spacing(2),
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Order
              </Typography>
              {getTotalItems() > 0 ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    {Object.entries(cartItems).map(([itemId, count]) => {
                      if (count === 0) return null;
                      const item = mockRestaurant.menu
                        .flatMap((category) => category.items)
                        .find((item) => item.id === itemId);
                      return (
                        <Box
                          key={itemId}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography>
                            {count}x {item.name}
                          </Typography>
                          <Typography>
                            ${(item.price * count).toFixed(2)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                      ${getTotalPrice().toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<CartIcon />}
                  >
                    Proceed to Checkout
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary" align="center">
                  Your cart is empty
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RestaurantDetails;
