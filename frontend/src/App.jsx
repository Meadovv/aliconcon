import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from './components/Routers';
import Layout from './components/Layout';
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {routers.map((router, index) => {
                        return <Route key={index} path={router.path} element={<Layout {...router}/>} />
                    })}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
