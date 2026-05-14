import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/utils';

interface ProductListItemProps {
  product: Product;
  className?: string;
}

/**
 * List-view product card for the products page.
 * Horizontal layout optimized for scanning product information.
 */
export const ProductListItem = React.memo(({ product, className }: ProductListItemProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const navigate = useNavigate();

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all hover:shadow-lg cursor-pointer',
        className
      )}
      onClick={() => navigate(`/products/${product.id}`)}
      role="article"
      aria-label={`Product: ${product.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/products/${product.id}`);
        }
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 md:w-56 shrink-0 aspect-video sm:aspect-square overflow-hidden bg-muted">
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
            <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground text-xs">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {product.category}
                  </Badge>
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-xs shrink-0">
                      Low Stock
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <div className="text-xl md:text-2xl font-bold">${discountedPrice.toFixed(2)}</div>
                {product.discountPercentage > 0 && (
                  <div className="text-sm text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            {/* Rating */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.stock} in stock)
              </span>
            </div>

            {/* Action */}
            <Button
              size="sm"
              variant="outline"
              className="group/btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}`);
              }}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Details
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
});

ProductListItem.displayName = 'ProductListItem';
