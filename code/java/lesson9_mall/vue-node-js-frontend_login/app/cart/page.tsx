import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CartList from "@/components/cart/cart-list"

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">购物车</h1>
          <CartList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
