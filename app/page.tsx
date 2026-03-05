import NavBar from "@/src/components/NavBar";
import Hero from "@/src/components/Hero";
import Products from "@/app/Products";
import History from "@/src/components/History";
import Footer from "@/src/components/Footer";
import Contact from "@/src/components/Contact";
export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <History />
      <Products />
      <Contact />
      <Footer />
    </>
  );
}
