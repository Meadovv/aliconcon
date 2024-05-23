import React from 'react';
import './index.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sliderNumber = 2;

const HeaderSlider = () => {
    let settings = {
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="slider">
            <div className="container">
                <div className="slider-content overflow-x-hidden">
                    <Slider {...settings}>
                        {Array.from({ length: sliderNumber }).map((_, index) => {
                            return (
                                <div className="slider-item" key={index}>
                                    <img src={`/images/slider/${index + 1}.jpg`} alt="" />
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default HeaderSlider;
