import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routers from './components/Routes';
import Spinner from './components/Spinner';

function App() {
    const loader = useSelector(state => state.loader);
    console.log(loader);

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
                                null
                            }
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
