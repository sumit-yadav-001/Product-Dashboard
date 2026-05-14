import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = React.memo(({ product, className }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          {!imageError ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className={cn(
                'h-full w-full object-cover transition-all duration-300 group-hover:scale-105',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
          {product.discountPercentage > 0 && (
            <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <Badge className="absolute left-2 top-2 bg-yellow-500">
              Low Stock
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute left-2 top-2 bg-destructive">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold transition-colors hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>
        
        <div className="mt-2 flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.stock} in stock)</span>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-xl font-bold">${discountedPrice.toFixed(2)}</span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          size="sm"
          disabled={product.stock === 0}
          asChild
        >
          <Link to={`/products/${product.id}`}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'Out of Stock' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
