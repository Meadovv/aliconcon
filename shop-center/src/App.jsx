import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Error from './pages/Error';
import CONFIG from './configs';
import Home from './pages/Home';

import Private from './components/Private';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Setting from './pages/Setting';

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
                        <Setting />
                    </Private>
                } />

                <Route path="/" element={
                    <Private>
                        <Home />
                    </Private>
                } />



                <Route path="*" element={<Error error={CONFIG.ERROR.PAGE_NOT_FOUND}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
