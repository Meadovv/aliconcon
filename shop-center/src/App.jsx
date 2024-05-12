import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Error from './pages/Error';
import CONFIG from './configs';

import Private from './components/Private';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Categories from './pages/Category/Category';
import Menu from './pages/Menu';
import Settings from './pages/Setting';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/logout" element={
                    <Private>
                        <Logout />
                    </Private>
                } />


                <Route path="/setting" element={
                    <Private>
                        <Settings />
                    </Private>
                } />

                <Route path="/" element={
             
                        <Menu />
              
                } />

                <Route path="/categories" element={
                        <Categories />
                } />


                <Route path="*" element={<Error error={CONFIG.ERROR.PAGE_NOT_FOUND}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
