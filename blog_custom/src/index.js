import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// import Edit from "./edit";
// import First from "./first";
// import Add from "./add";
// import Detail from "./detail";
// import Notes from "./notes";
// import MyLife from "./myLife";

const Edit = lazy(() => import("./edit"));
const First = lazy(() => import("./first"));
const Add = lazy(() => import("./add"));
const Detail = lazy(() => import("./detail"));
const Notes = lazy(() => import("./notes"));
const MyLife = lazy(() => import("./myLife"));
const UserSign = lazy(() => import("./sign"));

import { AppContainer } from "react-hot-loader";
import {
  HashRouter as Router,
  Route,
  Switch,
  Link,
  IndexRoute,
  withRouter,
} from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Suspense fallback={<div>loading.....</div>}>
          <Router>
            <App />
            <Switch>
              <Route path="/detail" component={Detail}></Route>
              <Route path="/edit" component={Edit}></Route>
              <Route path="/add" component={Add}></Route>
              <Route path="/notes" component={Notes}></Route>
              <Route path="/myLife" component={MyLife}></Route>
              <Route path="/sign" component={UserSign}></Route>
              <Route path="/*" component={First}></Route>
            </Switch>
          </Router>
        </Suspense>
      </div>
    );
  }
}

const render = (Component) => {
  ReactDOM.render(Component, document.getElementById("root"));
};
render(<Home />);
// if (module.hot) {
//   module.hot.accept("./first.js", () => {
//     // 当我们热更新的代码出现的时候，把App重新加载
//     debugger;
//     render(<Home />); // 重新渲染到 document 里面
//   });
// }
