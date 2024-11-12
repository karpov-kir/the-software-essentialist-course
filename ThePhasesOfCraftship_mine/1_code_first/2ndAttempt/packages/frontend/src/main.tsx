import React from "react";
import ReactDOM from "react-dom/client";

import classNames from "./main.module.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className={classNames.root}>
      <h1>DDD forum</h1>
    </div>
  </React.StrictMode>,
);
