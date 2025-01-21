// import { useState } from "react";   - not needed anymore, state is resolved in context-component

import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";
// import { CartContext } from "./store/shopping-cart-context.jsx"; // importing CONTEXT from the store-folder

import CartContextProvider from "./store/shopping-cart-context.jsx";

function App() {
  // // state for keeping track of items in the cart
  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  // function handleAddItemToCart(id) {
  //   setShoppingCart((prevShoppingCart) => {
  //     const updatedItems = [...prevShoppingCart.items];

  //     const existingCartItemIndex = updatedItems.findIndex(
  //       (cartItem) => cartItem.id === id
  //     );
  //     const existingCartItem = updatedItems[existingCartItemIndex];

  //     if (existingCartItem) {
  //       const updatedItem = {
  //         ...existingCartItem,
  //         quantity: existingCartItem.quantity + 1,
  //       };
  //       updatedItems[existingCartItemIndex] = updatedItem;
  //     } else {
  //       const product = DUMMY_PRODUCTS.find((product) => product.id === id);
  //       updatedItems.push({
  //         id: id,
  //         name: product.title,
  //         price: product.price,
  //         quantity: 1,
  //       });
  //     }

  //     return {
  //       items: updatedItems,
  //     };
  //   });
  // }

  // function handleUpdateCartItemQuantity(productId, amount) {
  //   setShoppingCart((prevShoppingCart) => {
  //     const updatedItems = [...prevShoppingCart.items];
  //     const updatedItemIndex = updatedItems.findIndex(
  //       (item) => item.id === productId
  //     );

  //     const updatedItem = {
  //       ...updatedItems[updatedItemIndex],
  //     };

  //     updatedItem.quantity += amount;

  //     if (updatedItem.quantity <= 0) {
  //       updatedItems.splice(updatedItemIndex, 1);
  //     } else {
  //       updatedItems[updatedItemIndex] = updatedItem;
  //     }

  //     return {
  //       items: updatedItems,
  //     };
  //   });
  // }

  // const ctxValue = {
  //   items: shoppingCart.items,
  //   addItemToCart: handleAddItemToCart, // function used as a value of the property 'addItemToCart'
  //   updateItemQuantity: handleUpdateCartItemQuantity
  // };

  return (

    // NEW: wrapping our child-components with context-provider (context is handled outside of the App.jsx):

    <CartContextProvider>
      <Header />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))}
      </Shop>
    </CartContextProvider>
  );
}

export default App;
