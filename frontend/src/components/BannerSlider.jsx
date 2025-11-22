import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToFilters } from "../hooks/useScrollToFilters";

const SLIDES = [
  {
    id: 1,
    title: "Summer Sale!",
    subtitle: "Up to 50% off on selected items",
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1920&h=600&fit=crop",
    cta: "Shop Now",
    bgColor: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Discover the latest trends",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop",
    cta: "Explore",
    bgColor: "from-green-500 to-blue-600",
  },
  {
    id: 3,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop",
    cta: "Learn More",
    bgColor: "from-orange-500 to-red-500",
  },
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollToFilters = useScrollToFilters();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleButtonClick = () => {
    const currentSlideData = SLIDES[currentSlide];
    if (currentSlideData.cta === "Learn More") {
      navigate("/about");
    } else {
      scrollToFilters();
    }
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gray-900 mt-16">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-80`}
          ></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 drop-shadow-lg">
                {slide.subtitle}
              </p>
              <button
                onClick={handleButtonClick}
                className="bg-white text-gray-900 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105 duration-200"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full transition-all backdrop-blur-sm"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full transition-all backdrop-blur-sm"
      >
        →
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentSlide ? "bg-gray-700" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
