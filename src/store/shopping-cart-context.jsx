/*This is a file inside of a 'store' folder, used for saving mutual 'context' which can be later wrapped 
around different components and provided to them */

import { createContext, useState } from "react";

import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({   //defining initial values: can be string, number, array or object
    items: [],
    addItemToCart: () => {},   // adding an empty dummy function - updating state only via context, not props
    updateItemQuantity: () => {}   // another default function, for updating quantity of each item in cart
});

// New approach: handling all contect in a special contect-file:
// this function will manage and provide all context data:
export default function CartContextProvider({children}){
// moving all logic (except what is returned) from App.jsx here:

// state for keeping track of items in the cart:
const [shoppingCart, setShoppingCart] = useState({
    items: [],
  });

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart, // function used as a value of the property 'addItemToCart'
    updateItemQuantity: handleUpdateCartItemQuantity
  };

  return <CartContext.Provider value={ctxValue}>
    {children}
  </CartContext.Provider>

}
