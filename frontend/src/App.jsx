import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from './components/Routes';
import Layout from './components/Layout';

import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';

function App() {
    const { loader } = useSelector((state) => state.loader);

    return loader ? (
        <Spinner />
    ) : (
        <BrowserRouter>
            <Routes>
                {routers.map((router, index) => {
                    return (
                        <Route
                            key={index}
                            path={router.path}
                            element={
                                <Layout {...router} />
                            }
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
