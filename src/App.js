import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    useLocation
} from "react-router-dom";

import CouponPage from './pages/CouponPage'
import UsePage from './pages/UsePage'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/coupon">
          <Coupon />
        </Route>
        <Route path="/use">
          <Use />
        </Route>
      </Router>
    </div>
  );
}
function Coupon(){
  const query = useQuery();
  return (<CouponPage token={query.get('token')} />)
}

function Use(){
  const query = useQuery();
  return (<UsePage number={query.get('number')} />)
}

export default App;
