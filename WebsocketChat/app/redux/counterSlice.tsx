import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  counter: number;
}

const initialState: CounterState = {
  counter: 1,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state: CounterState) => {
      state.counter += 1;
    },
    decrement: (state: CounterState) => {
      state.counter -= 1;
    },
  },
});

export const { increament, decrement } = counterSlice.actions;

export default counterSlice.reducer;
