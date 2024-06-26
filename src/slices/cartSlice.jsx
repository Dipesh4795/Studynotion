import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);
      if (index >= 0) {
        toast.error("course already in cart");
        return;
      }
      state.cart.push(course);
      state.total += parseFloat(course.price);
      state.totalItems++;
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      localStorage.setItem("total", JSON.stringify(state.total));

      toast.success("course add in cart");
    },

    removeFromCart(state, action) {
      const courseid = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseid);

      if (index < 0) {
        toast.error("course is not found in cart");
      }
      if (index >= 0) {
        state.total -= parseFloat(state.cart[index].price);
        state.cart.splice(index, 1);

        state.totalItems--;
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        localStorage.setItem("total", JSON.stringify(state.total));

        toast.success("course remove from cart");
      }
    },
    resetCart(state) {
      state.cart = [];
      state.totalItems = 0;
      state.total = 0;
      //   localStorage.setItem("cart", JSON.stringify(state.cart));
      // localStorage.setItem("totalitems", JSON.stringify(state.totalitems));
      // localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
      toast.success("cart reset");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
