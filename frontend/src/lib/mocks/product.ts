import type { Product } from "$lib/types/product";

export const products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        description: "Powerful device for work and play",
        price: 1200,
        image: "/images/laptop.jpg"
    },
    {
        id: 2,
        name: "Headphones",
        description: "Noise-cancelling over-ear headphones",
        price: 200,
        image: "/images/headphones.jpg"
    }
];
