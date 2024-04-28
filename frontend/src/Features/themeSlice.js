import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: true,
  reducers: {
    toggleTheme: (state) => {
      state = !state;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   themeKey: "light", // or whatever your initial theme is
// };

// const themeSlice = createSlice({
//   name: "theme",
//   initialState,
//   reducers: {
//     toggleTheme(state) {
//       // Ensure that Immer is correctly handling state mutation
//       state.themeKey = state.themeKey === "light" ? "dark" : "light";
//     },
//   },
// });

// export const { toggleTheme } = themeSlice.actions;
// export default themeSlice.reducer;
