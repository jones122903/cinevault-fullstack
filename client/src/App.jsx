import { Provider } from "react-redux";
import "./App.css";
import Router from "./Router";
import store from "./app/store.js";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router />
      </div>
    </Provider>
  );  
}

export default App;
