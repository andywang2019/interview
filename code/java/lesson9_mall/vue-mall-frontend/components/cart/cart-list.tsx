"use client"

import { useState } from "react"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const mockCartItems = [
  {
    id: 1,
    productId: 1,
    name: "iPhone 15 Pro Max",
    image: "/modern-smartphone.png",
    price: 9999,
    quantity: 1,
    stock: 10,
  },
  {
    id: 2,
    productId: 3,
    name: "AirPods Pro 2代",
    image: "/generic-wireless-earbuds.png",
    price: 1899,
    quantity: 2,
    stock: 20,
  },
]

export default function CartList() {
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [selectedItems, setSelectedItems] = useState<number[]>([1, 2])

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + delta))
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
    setSelectedItems((selected) => selected.filter((itemId) => itemId !== id))
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((selected) =>
      selected.includes(id) ? selected.filter((itemId) => itemId !== id) : [...selected, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Checkbox checked={selectedItems.length === cartItems.length} onCheckedChange={toggleSelectAll} />
            <span className="font-medium">全选</span>
          </div>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex gap-4">
              <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => toggleSelectItem(item.id)} />
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <p className="text-primary font-bold text-lg">¥{item.price}</p>
              </div>
              <div className="flex flex-col items-end gap-4">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
          <h2 className="text-xl font-bold mb-4">订单摘要</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">已选商品</span>
              <span>{selectedItems.length} 件</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">小计</span>
              <span>¥{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">运费</span>
              <span className="text-accent">免运费</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">总计</span>
                <span className="text-2xl font-bold text-primary">¥{totalPrice}</span>
              </div>
            </div>
          </div>
          <Button className="w-full" size="lg" disabled={selectedItems.length === 0}>
            去结算
          </Button>
        </div>
      </div>
    </div>
  )
}
