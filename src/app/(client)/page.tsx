import About from "./_components/About";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import MainContainer from "./_components/MainContainer";
import NewsLetter from "./_components/NewsLetter";
import Products from "./_components/Products";
import SpecialProducts from "./_components/SpecialProducts";

const HomePage = () => {
  return (
    <>
      <MainContainer />
      <Header />
      <Hero />
      <SpecialProducts />
      <About />
      <Products />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default HomePage;
