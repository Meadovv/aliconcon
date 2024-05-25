import React from 'react';
import './index.scss';
import Product from '../Product';

import { IoSearch } from 'react-icons/io5';
import FilterModal from '../Modal/Filter';

import { useDispatch } from 'react-redux';
import { openModal } from '../../reducer/actions/modal.slice';

const ProductList = ({ products, showFilter, categories, emptyBackground }) => {
    const dispatch = useDispatch();
    const [filteredProducts, setFilteredProducts] = React.useState(products);
    const [filter, setFilter] = React.useState({
        category: '',
        lowPrice: 0,
        highPrice: 0,
    });

    React.useEffect(() => {
        setFilteredProducts(
            products.filter((product) => {
                if (filter.category !== '' && product.category._id !== filter.category) return false;
                if (filter.lowPrice !== 0 && product.price < filter.lowPrice) return false;
                if (filter.highPrice !== 0 && product.price > filter.highPrice) return false;

                return true;
            }),
        );
    }, [products, filter]);

    return (
        <>
            <FilterModal applyFilter={setFilter} categories={categories}/>
            <div
                style={{
                    marginBottom: '2rem',
                    display: showFilter ? 'flex' : 'none',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                    }}
                >
                    Filter
                </div>
                <IoSearch
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => dispatch(openModal({ modal: 'filter' }))}
                />
            </div>
            <div className="product-lists grid bg-whitesmoke my-3" style={{
                backgroundColor: emptyBackground ? 'white' : 'whitesmoke'
            }}>
                {filteredProducts.map((product, index) => (
                    <Product key={index} product={product} />
                ))}
            </div>
        </>
    );
};

export default ProductList;
