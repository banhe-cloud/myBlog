import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
alert(123312)
function Person() {
  return <div>人物</div>;
}
const render = (Component) => {
  ReactDOM.render(Component, document.getElementById("root"));
};
render(<Person/>);
