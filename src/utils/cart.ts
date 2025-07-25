const cartDetails = [
  {
    id: "1",
    quantity: 2,
    size: "42",
    possibleSizes: ["42", "40", "38", "36"],
    price: 29.99,
    name: "Premium Oxford Shirt",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    quantity: 1,
    size: "40",
    possibleSizes: ["42", "40", "38", "36"],
    price: 49.99,
    name: "Pinstripe Formal Shirt",
    image: "https://via.placeholder.com/150",
  },
];
export const getCartDetails = () => {
  return cartDetails;
};
