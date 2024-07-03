import React from "react";
import "../pages/global.css";
import { RiLoader5Line } from "react-icons/ri";

function Loader() {
  return (
    <div className="spinner">
      <RiLoader5Line size={"7vw"} classsName="App-logo" />
    </div>
  );
}
export default Loader;
