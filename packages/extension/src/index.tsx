import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/ibm-plex-sans";
import App from "./App";
import "./index.css";
import { initGainsight } from "./gainsight";

ReactDOM.render(<App />, document.getElementById("root"));

initGainsight();
