import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">关于我们</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  公司简介
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  加入我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">客户服务</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground">
                  配送信息
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  退换货政策
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">购物指南</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/payment" className="hover:text-foreground">
                  支付方式
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground">
                  账户安全
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">关注我们</h3>
            <p className="text-sm text-muted-foreground mb-4">获取最新优惠和产品信息</p>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent">
                <span className="text-xs">微信</span>
              </div>
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent">
                <span className="text-xs">微博</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Mall 电商平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}
