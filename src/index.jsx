import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BookmarksProvider } from "./context/BookmarksContext";
import "./index.css";

// TODO: Replace with real userId from auth system
const USER_ID = "123"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BookmarksProvider userId={USER_ID}>
      <App />
    </BookmarksProvider>
  </React.StrictMode>
);
