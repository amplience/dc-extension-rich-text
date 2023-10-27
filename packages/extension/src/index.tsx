import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-sans/500.css";
import App from "./App";
import "./index.css";
import { initGainsight } from "./gainsight";

ReactDOM.render(<App />, document.getElementById("root"));

initGainsight();
