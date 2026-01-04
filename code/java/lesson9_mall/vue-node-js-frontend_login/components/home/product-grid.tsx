"use client"

import { useState } from "react"
import ProductCard from "@/components/products/product-card"

// Mock data - 这些数据将通过 API 从后端获取
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 9999,
    originalPrice: 11999,
    image: "/iphone-15-pro-hands.png",
    sales: 1234,
    rating: 4.8,
  },
  {
    id: 2,
    name: "MacBook Pro 16英寸",
    price: 19999,
    originalPrice: 22999,
    image: "/silver-macbook-pro-desk.png",
    sales: 856,
    rating: 4.9,
  },
  {
    id: 3,
    name: "AirPods Pro 2代",
    price: 1899,
    originalPrice: 2199,
    image: "/airpods-pro-lifestyle.png",
    sales: 3456,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    price: 6299,
    originalPrice: 6999,
    image: "/apple-watch-ultra.jpg",
    sales: 567,
    rating: 4.8,
  },
  {
    id: 5,
    name: "iPad Air 5代",
    price: 4799,
    originalPrice: 5299,
    image: "/ipad-air-lifestyle.png",
    sales: 923,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Sony 索尼 WH-1000XM5",
    price: 2499,
    originalPrice: 2899,
    image: "/sony-headphones.png",
    sales: 1876,
    rating: 4.9,
  },
  {
    id: 7,
    name: "Dell XPS 13 笔记本",
    price: 8999,
    originalPrice: 9999,
    image: "/dell-xps-laptop.jpg",
    sales: 432,
    rating: 4.7,
  },
  {
    id: 8,
    name: "Samsung Galaxy S24",
    price: 5999,
    originalPrice: 6999,
    image: "/samsung-galaxy-phone.jpg",
    sales: 2134,
    rating: 4.6,
  },
]

export default function ProductGrid() {
  const [products] = useState(mockProducts)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">热门商品</h2>
        <button className="text-primary hover:underline">查看更多 →</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
