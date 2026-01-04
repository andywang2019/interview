"use client"

import { Smartphone, Laptop, Watch, Headphones, Camera, Gamepad2 } from "lucide-react"

const categories = [
  { name: "手机通讯", icon: Smartphone },
  { name: "电脑办公", icon: Laptop },
  { name: "智能手表", icon: Watch },
  { name: "影音娱乐", icon: Headphones },
  { name: "摄影摄像", icon: Camera },
  { name: "游戏设备", icon: Gamepad2 },
]

export default function CategoryBar() {
  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-8">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
                <category.icon className="h-8 w-8 text-foreground" />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
