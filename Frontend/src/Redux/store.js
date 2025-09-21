import { configureStore } from "@reduxjs/toolkit";
import authSlice,{ setAuthUser } from "./authslice";

const store = configureStore({
     reducer: {   
        auth: authSlice 
     },
});

export default store;