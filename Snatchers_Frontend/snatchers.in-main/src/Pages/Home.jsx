import Crausel from "../components/Crausel/Crausel.jsx"
import DateNight from "../components/DateNight.jsx";
import Category from "../components/Category.jsx";
import Blog from "../components/Blog.jsx";
import NewProducts from "../components/NewProducts.jsx";
import EnhancedCategoryCarousel from "../components/EnhancedCategoryCarousel.jsx";
import ModelCatalog from "../components/ModelCatelog.jsx";
import OurStory from "../components/OurStory.jsx";
import AnimatedHeading from "../UI/AnimatedHeading.jsx";
import { 
  ScrollReveal, 
  StaggeredReveal, 
  ParallaxSection, 
  MagneticScroll, 
  ScrollTrigger, 
  ParallaxImage, 
  RevealOnScroll,
  ScrollBasedRotation,
  MorphingBackground,
  SimpleScrollReveal
} from "../components/ScrollAnimations";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Crausel />
      
      {/* Product section (new) */}
      {/*<ProductSection title="Trending Products" limit={12} />*/}
      
      {/* Test ProductDialog Links - Remove these after testing */}
      {/* <div className="bg-gray-100 p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Test ProductDialog (Remove after testing)</h3>
        <div className="space-x-4">
          <Link to="/product/1" className="text-blue-600 hover:underline">Test Product 1 (Local)</Link>
          <Link to="/product/2" className="text-blue-600 hover:underline">Test Product 2 (Local)</Link>
          <Link to="/product/3" className="text-blue-600 hover:underline">Test Product 3 (Local)</Link>
        </div>
      </div> */}
      
       <MagneticScroll strength={0.2}>
         <ScrollReveal direction="up" distance={60} duration={0.8}>
           <AnimatedHeading heading="Womens" subheading="Empowering styles for modern women" />
         </ScrollReveal>
       </MagneticScroll>
       
       {/* Women's Category Carousel - Moves Opposite to Scroll */}
       <ScrollReveal direction="up" distance={50} duration={0.8} delay={0.2}>
         <EnhancedCategoryCarousel 
           gender="women" 
           movementType="opposite"
           speed={0.4}
           stiffness={100}
           damping={30}
         />
       </ScrollReveal>
      
       <ScrollReveal direction="up" distance={60} duration={0.8}>
         <AnimatedHeading heading="Mens" subheading="Bold design for modern men" />
       </ScrollReveal>
       
       {/* Men's Category Carousel - Wave Movement */}
       <ScrollReveal direction="up" distance={50} duration={0.8} delay={0.2}>
         <EnhancedCategoryCarousel 
           gender="men" 
           movementType="wave"
           speed={0.4}
           stiffness={100}
           damping={30}
         />
       </ScrollReveal>
      
       <ParallaxSection speed={0.3} stiffness={150} damping={40}>
         <DateNight />
       </ParallaxSection>
      
      <ScrollReveal direction="up" distance={50} duration={0.7}>
        <Category />
      </ScrollReveal>
      
      <ScrollReveal direction="up" distance={60} duration={0.8}>
        <AnimatedHeading heading="Happy Customers" subheading="Making our customers happy." />
      </ScrollReveal>
      
      <ScrollBasedRotation rotationRange={[0, 5]} speed={0.5}>
        <StaggeredReveal staggerDelay={0.15} direction="up" distance={40}>
          <ModelCatalog />
        </StaggeredReveal>
      </ScrollBasedRotation>
      
      <ScrollReveal direction="up" distance={50} duration={0.7}>
        <NewProducts />
      </ScrollReveal>
      
      {/* <Testimonial /> */}
      
      <ParallaxImage speed={0.4} direction="up" stiffness={140} damping={35} enableRotation={true}>
        <ParallaxSection speed={0.2} stiffness={120} damping={30}>
          <Blog />
        </ParallaxSection>
      </ParallaxImage>
      
      <ScrollReveal direction="up" distance={60} duration={0.8}>
        <OurStory />
      </ScrollReveal>
      
      </>
  );
}

export default Home;

