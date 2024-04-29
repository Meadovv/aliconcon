import React from 'react';
import Slider from 'react-slick';
import ProductCard from '../ProductCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.css';

export default function ProductSlider({ products }) {
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        initialSlide: 1
    };
    return (
        <div>
            <Slider {...settings}>
                {products.map((product, index) => {
                    return (
                        <div key={index}>
                            <ProductCard imgSrc={product.img} />
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
