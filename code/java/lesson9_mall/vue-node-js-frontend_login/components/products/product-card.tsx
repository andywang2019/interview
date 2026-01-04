"use client"

import type React from "react"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  sales: number
  rating: number
}

export default function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Add to cart:", product.id)
    // TODO: 调用购物车 API
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    console.log("Toggle favorite:", product.id)
    // TODO: 调用收藏 API
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-background/80 hover:bg-background ${
              isFavorite ? "text-primary" : ""
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
              省 ¥{product.originalPrice - product.price}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-primary text-xl font-bold">¥{product.price}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground text-sm line-through">¥{product.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>已售 {product.sales}+</span>
            <span className="flex items-center gap-1">⭐ {product.rating}分</span>
          </div>

          <Button className="w-full" size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            加入购物车
          </Button>
        </div>
      </div>
    </Link>
  )
}
