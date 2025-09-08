// src/data/productsData.js
import shirt from "../assets/dress.jpg";
import jeans from "../assets/jeans.jpg";
import jacket from "../assets/jacket.jpg";
import sneakers from "../assets/tshirt.jpg";
import dress from "../assets/dress.jpg";
import heels from "../assets/jeans.jpg";
import kidsShirt from "../assets/kids/kid1.jpg";
import kidsShoes from "../assets/kids/kids3.jpg";

export const products = {
  men: [
    {
      id: 1,
      name: "Classic White Shirt",
      price: 29.99,
      description: "Crisp cotton shirt, perfect for both casual and formal wear.",
      rating: 4,
      size: "M, L, XL",
      category: "shirts",
      image: shirt,
    },
    {
      id: 2,
      name: "Designer Jeans",
      price: 40,
      description: "Slim fit jeans for everyday casual wear.",
      rating: 5,
      size: "30, 32, 34, 36",
      category: "pants",
      image: jeans,
    },
    {
      id: 3,
      name: "Leather Jacket",
      price: 120,
      description: "Premium black leather jacket with modern fit.",
      rating: 5,
      size: "M, L, XL",
      category: "jackets",
      image: jacket,
    },
    {
      id: 4,
      name: "Casual Sneakers",
      price: 60,
      description: "Comfortable sneakers designed for all-day wear.",
      rating: 4,
      size: "40, 41, 42, 43, 44",
      category: "shoes",
      image: sneakers,
    },
  ],
  women: [
    {
      id: 5,
      name: "Summer Dress",
      price: 49.99,
      description: "Floral summer dress, lightweight and breezy.",
      rating: 5,
      size: "S, M, L",
      category: "dresses",
      image: dress,
    },
    {
      id: 6,
      name: "Elegant Heels",
      price: 70,
      description: "High heels with sleek finish for formal occasions.",
      rating: 4,
      size: "36, 37, 38, 39, 40",
      category: "shoes",
      image: heels,
    },
  ],
  kids: [
    {
      id: 7,
      name: "Kids Graphic Shirt",
      price: 19.99,
      description: "Soft cotton T-shirt with fun prints for kids.",
      rating: 5,
      size: "XS, S, M",
      category: "tops",
      image: kidsShirt,
    },
    {
      id: 8,
      name: "Kids Sneakers",
      price: 29.99,
      description: "Lightweight sneakers built for active kids.",
      rating: 4,
      size: "28, 29, 30, 31, 32",
      category: "shoes",
      image: kidsShoes,
    },
  ],
};
