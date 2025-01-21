/*This is a file inside of a 'store' folder, used for saving mutual 'context' which can be later wrapped 
around different components and provided to them */

// import { createContext, useState, useReducer } from "react";
import { createContext, useReducer } from "react";   // useState not needed anymore

import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  //defining initial values: can be string, number, array or object
  items: [],
  addItemToCart: () => {}, // adding an empty dummy function - updating state only via context, not props
  updateItemQuantity: () => {}, // another default function, for updating quantity of each item in cart
});

// New approach: handling all contect in a special contect-file:

// reducer-function will get triggered by dispatching values and will then produce a new state:
// must be defined outside of useReducer-hook, because it cannot be re-executed each time when component re-executes
// reducer-function should accept 2 parameter: state and action
// state = latest state snapshot
// reducer-function will be called by React after dispatching so-called 'action'
function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    // return {};

    // const updatedItems = [...prevShoppingCart.items];
    const updatedItems = [...state.items]; // state = latest state

    const existingCartItemIndex = updatedItems.findIndex(
      // (cartItem) => cartItem.id === id
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // const product = DUMMY_PRODUCTS.find((product) => product.id === id);
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        // id: id,
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // if we have a more complex state, we should copy previous state first (to not loose any data)
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    // const updatedItems = [...prevShoppingCart.items];
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      // (item) => item.id === productId
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    // updatedItem.quantity += amount;
    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

// this function will manage and provide all context data:
export default function CartContextProvider({ children }) {
  // moving all logic (except what is returned) from App.jsx here:

  // NEW: useReducer-hook:

  // const [state, dispatchFunction] = useReducer();

  // Dispatch-function allows us to dispatch so called 'actions',
  // These 'actions' will be handled by some yet-to-be-defined reducer-function.

  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );
  // passing a pointer to a reducer-function to the useReducer-hook as a 1st argument
  // 2nd argument of useReducer-function is initial value; initial state

  // -> useState-hook is not needed anymore (state for keeping track of items in the cart),
  // because we are now managing everything through useReducer:
  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  function handleAddItemToCart(id) {
    // NEW: dispatching an action (string, number or mostly an object):
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });

    // setShoppingCart((prevShoppingCart) => {
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
    // });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      // payload: {
      //   productId: productId,
      //   amount: amount
      // }
      payload: {
        productId,
        amount, // shortened, when key and value are the same expression.
      },
    });

    // setShoppingCart((prevShoppingCart) => {
    //   const updatedItems = [...prevShoppingCart.items];
    //   const updatedItemIndex = updatedItems.findIndex(
    //     (item) => item.id === productId
    //   );

    //   const updatedItem = {
    //     ...updatedItems[updatedItemIndex],
    //   };

    //   updatedItem.quantity += amount;

    //   if (updatedItem.quantity <= 0) {
    //     updatedItems.splice(updatedItemIndex, 1);
    //   } else {
    //     updatedItems[updatedItemIndex] = updatedItem;
    //   }

    //   return {
    //     items: updatedItems,
    //   };
    // });
  }

  const ctxValue = {
    // items: shoppingCart.items,
    items: shoppingCartState.items, // using the state from useReducer-hook
    addItemToCart: handleAddItemToCart, // function used as a value of the property 'addItemToCart'
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
