import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useLocation,
    Switch
} from "react-router-dom";

import CouponPage from './pages/CouponPage'
import UsePage from './pages/UsePage'
import MainPage from './pages/MainPage'
import Management from './Management'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/coupon" component={Coupon} />
          <Route path="/use" component={Use} />
          <Route path="/manage" component={Management} />
        </Switch>
      </Router>
    </div>
  );
}
const Main= () => (<MainPage />)
const Coupon= () => (<CouponPage token={useQuery().get('token')} />)
const Use = () => (<UsePage number={useQuery().get('number')} />)

export default App;
