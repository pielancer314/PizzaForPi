import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  Pagination,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import RestaurantCard from '../components/restaurant/RestaurantCard';

// Mock data - replace with API call
const mockRestaurants = Array(12).fill(null).map((_, index) => ({
  _id: String(index + 1),
  name: ['Pizza Palace', 'Burger House', 'Sushi Master', 'Taco Time'][index % 4],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  cuisine: [
    ['Italian', 'Pizza', 'Fast Food'],
    ['American', 'Burgers', 'Fast Food'],
    ['Japanese', 'Sushi', 'Asian'],
    ['Mexican', 'Tacos', 'Fast Food'],
  ][index % 4],
  rating: {
    average: 3.5 + Math.random() * 1.5,
    count: 50 + Math.floor(Math.random() * 150),
  },
  image: `https://source.unsplash.com/random/400x300?restaurant-${index + 1}`,
  estimatedDeliveryTime: `${20 + Math.floor(Math.random() * 40)}-${35 + Math.floor(Math.random() * 40)}`,
}));

const cuisineTypes = [
  'All',
  'Italian',
  'American',
  'Japanese',
  'Mexican',
  'Chinese',
  'Indian',
  'Thai',
  'Mediterranean',
];

const sortOptions = [
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'deliveryTime', label: 'Delivery Time' },
  { value: 'popularity', label: 'Popularity' },
];

const RestaurantList = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const restaurantsPerPage = 9;

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine.includes(selectedCuisine);
    return matchesSearch && matchesCuisine;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating.average - a.rating.average;
      case 'deliveryTime':
        return parseInt(a.estimatedDeliveryTime.split('-')[0]) - parseInt(b.estimatedDeliveryTime.split('-')[0]);
      case 'popularity':
        return b.rating.count - a.rating.count;
      default:
        return 0;
    }
  });

  const paginatedRestaurants = sortedRestaurants.slice(
    (page - 1) * restaurantsPerPage,
    page * restaurantsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Restaurants
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                value={selectedCuisine}
                label="Cuisine Type"
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                {cuisineTypes.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Active Filters */}
      {(searchQuery || selectedCuisine !== 'All') && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchQuery && (
            <Chip
              label={`Search: ${searchQuery}`}
              onDelete={() => setSearchQuery('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCuisine !== 'All' && (
            <Chip
              label={`Cuisine: ${selectedCuisine}`}
              onDelete={() => setSelectedCuisine('All')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Restaurant Grid */}
      <Grid container spacing={3}>
        {paginatedRestaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
            <RestaurantCard restaurant={restaurant} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {sortedRestaurants.length > restaurantsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(sortedRestaurants.length / restaurantsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {sortedRestaurants.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No restaurants found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RestaurantList;
