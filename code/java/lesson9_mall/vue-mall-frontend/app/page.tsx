import Header from "@/components/layout/header"
import Hero from "@/components/home/hero"
import CategoryBar from "@/components/home/category-bar"
import ProductGrid from "@/components/home/product-grid"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryBar />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}
