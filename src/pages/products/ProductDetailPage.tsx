import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Package, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useGetProductQuery } from '@/store/api/productsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(Number(id), {
    skip: !id,
  });

  const handleShare = () => {
    if (navigator.share && product) {
      navigator
        .share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square animate-pulse rounded-lg bg-muted" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-20 animate-pulse rounded bg-muted" />
            <div className="h-10 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <EmptyState
          icon={Package}
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{
            label: 'Back to Products',
            onClick: () => navigate('/products'),
          }}
        />
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/products')} className="text-sm md:text-base">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3 md:space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
              <img
                src={images[selectedImage] || product.thumbnail}
                alt={product.title}
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {product.discountPercentage > 0 && (
                <Badge className="absolute right-3 top-3 md:right-4 md:top-4 bg-destructive text-destructive-foreground text-xs md:text-sm">
                  -{product.discountPercentage.toFixed(0)}% OFF
                </Badge>
              )}
            </div>
          </Card>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageLoaded(false);
                  }}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary',
                    selectedImage === index
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-transparent'
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 md:space-y-6">
          {/* Title and Brand */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-xs">
                  Low Stock
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
            <p className="mt-1 text-base md:text-lg text-muted-foreground">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4 md:h-5 md:w-5',
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs md:text-sm text-muted-foreground">
              ({product.stock} in stock)
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
            <span className="text-3xl md:text-4xl font-bold">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg md:text-xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-xs md:text-sm">
                  Save ${(product.price - discountedPrice).toFixed(2)}
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm md:text-base font-semibold">Description</h3>
            <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                size="lg"
                className="flex-1 text-sm md:text-base"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
                className="sm:w-auto"
              >
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                className="sm:w-auto"
              >
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs md:text-sm text-yellow-600">
                Only {product.stock} items left in stock!
              </p>
            )}
          </div>

          {/* Product Details Card */}
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <dl className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="text-muted-foreground">Brand</dt>
                  <dd className="font-medium">{product.brand}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">
                    <Link
                      to={`/products?category=${product.category}`}
                      className="text-primary hover:underline"
                    >
                      {product.category}
                    </Link>
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-medium">{product.stock} units</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-medium">#{product.id}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <Card>
        <Tabs defaultValue="details" className="w-full">
          <CardContent className="pt-4 md:pt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="text-xs md:text-sm">Details</TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs md:text-sm">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs md:text-sm">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 md:mt-6 space-y-4">
              <div>
                <h3 className="mb-2 text-sm md:text-base font-semibold">Product Details</h3>
                <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4 md:mt-6">
              <dl className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="font-medium">Product ID</dt>
                  <dd className="text-muted-foreground">{product.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="font-medium">Brand</dt>
                  <dd className="text-muted-foreground">{product.brand}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="font-medium">Category</dt>
                  <dd className="text-muted-foreground">{product.category}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-sm md:text-base">
                  <dt className="font-medium">Rating</dt>
                  <dd className="text-muted-foreground">{product.rating}/5</dd>
                </div>
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 md:mt-6">
              <EmptyState
                title="No reviews yet"
                description="Be the first to review this product!"
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
