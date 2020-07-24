import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useLocation
} from "react-router-dom";

import CouponPage from './pages/CouponPage'
import UsePage from './pages/UsePage'
import MainPage from './pages/MainPage'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Main} />
        <Route path="/coupon" component={Coupon} />
        <Route path="/use" component={Use} />
      </Router>
    </div>
  );
}
const Main= () => (<MainPage />)
const Coupon= () => (<CouponPage token={useQuery().get('token')} />)
const Use = () => (<UsePage number={useQuery().get('number')} />)

export default App;
