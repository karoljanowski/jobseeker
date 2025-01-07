import Hero from "@/components/Home/Hero";
import Menu from "@/components/Home/Menu";
import HowItWork from "@/components/Home/HowItWork";
import Features from "@/components/Home/Features";
import Pricing from "@/components/Home/Pricing";
import Footer from "@/components/Home/Footer";
export default function Home() {
  return (
    <div>
      <Menu />
      <Hero />
      <HowItWork />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}
