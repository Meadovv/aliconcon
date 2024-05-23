import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routers from './components/Routers';
import Spinner from './components/Spinner';
import Layout from './components/Layout';

import PublicMiddleware from './components/Middlewares/Public';
import PrivateMiddleware from './components/Middlewares/Private';

function App() {
    
    const loader = useSelector((state) => state.loader);

    return loader ? (
        <Spinner />
    ) : (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicMiddleware />}>
                    {routers.map((router, index) => {
                        if(router.middleware === 'public') {
                            return <Route key={index} path={router.path} element={<Layout {...router}/>}/>
                        } else return null;
                    })}
                </Route>
                <Route element={<PrivateMiddleware />}>
                    {routers.map((router, index) => {
                        if(router.middleware === 'private') {
                            return <Route key={index} path={router.path} element={<Layout {...router}/>}/>
                        } else return null;
                    })}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
