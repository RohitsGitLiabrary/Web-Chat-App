import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Loggedinwndow from "./pages/Loggedinwindow";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FirebaseProvider } from "./Firebase/Firebase";
import { ChatcontextProvider } from "./context/Chatcontext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    < FirebaseProvider  >
      <ChatcontextProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/Signup" element={<Signup />}></Route>
          <Route path="/Loggedinwindow" element={<Loggedinwndow />}></Route>
        </Routes>
      </ChatcontextProvider>
    </ FirebaseProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
