import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';

const RestaurantCard = ({ restaurant }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    _id,
    name,
    description,
    cuisine,
    rating,
    image = 'https://via.placeholder.com/300x200',
    estimatedDeliveryTime = '30-45',
  } = restaurant;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/restaurants/${_id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          sx={{
            objectFit: 'cover',
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <FavoriteBorderIcon color="primary" />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h6" component="h2" noWrap>
          {name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {cuisine.slice(0, 3).map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={rating.average} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({rating.count})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {estimatedDeliveryTime} min
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
