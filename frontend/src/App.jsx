import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Private from './components/Private';

// Public
import Register from './pages/Register';
import Home from './pages/Home';

import Setting from './pages/Setting';

import Error from './pages/Error';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={null} />
                <Route path="/product/:productId" element={<ProductView />} />
                <Route path="/category" element={null} />
                <Route path="/category/:categoryId" element={null} />
                <Route path="/discounts" element={null} />
                <Route path="/discounts/:categoryId" element={null} />
                <Route path="/store/:storeId" element={null} />
                <Route path="/store/:storeId/products" element={null} />
                {/* Need login to use these routes */}
                {/* Shared */}
                <Route 
                    path="/setting" 
                    element={
                        <Private needLogin={false} children={<Setting />}/>
                    }
                />

                <Route path="*" element={<Error error={CONFIG.ERROR.PAGE_NOT_FOUND} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
