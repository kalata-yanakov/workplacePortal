import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import SignupForm from './components/SignUp/SignUp';
import UserContext, { getLoggedUser } from './components/Providers/UserContext';
import SidebarContext from './components/Providers/SidebarContext';
import Home from './components/Home/Home';
import MenuAppBar from './components/MenuBar/MenuBar';
import LoginForm from './components/Login/Login';
import ProfileCard from './components/Profile/Profile';
import Workplace from './components/Workplace/Workplace';
import CovidTable from './components/CovidTable/CovidTable';
import AdminMainComponent from './components/AdminMainComponent/AdminMainComponent';
import EmployeeTable from './components/EmployeeTable/EmployeeTable';
import ErrorPage from './components/ErrorPage/ErrorPage';
import CovidContext from './components/Providers/CovidContext';


function App() {
  const [user, setUser] = useState(getLoggedUser());
  const [showSidebar, toggleSidebar] = useState(false);
  const [covidData, setCovidData] = useState([]);

  return (
    <BrowserRouter>
      <SidebarContext.Provider value={{ showSidebar, toggleSidebar }}>
        <UserContext.Provider value={{ user, setUser }}>
          <CovidContext.Provider value={{ covidData, setCovidData }}>   
              <MenuAppBar />
            
              <Switch>
                <Redirect path='/' exact to='/home' />
                <Route path='/home' component={Home} />
                <Route path='/register'exact component={SignupForm} />
                <Route path='/login' component={LoginForm} />
                <Route path='/profile' exact component={ProfileCard} />
                <Route path='/workplace' exact component={Workplace} />
                <Route path='/admin' exact component={AdminMainComponent} />
                <Route path='/covidData' exact component={CovidTable} />
                <Route path='/userInfo' exact component={EmployeeTable} />
                <Route path='*' component={ErrorPage} />
              </Switch>
           
          </CovidContext.Provider>
        </UserContext.Provider>
      </SidebarContext.Provider>
    </BrowserRouter>
  );
}

export default App;
