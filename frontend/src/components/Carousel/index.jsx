import React, { useMemo } from 'react';
import { Carousel as OriginalCarousel, Button } from 'antd';
import { CarouselContainer, CarouselCard } from './style';

export default function Carousel() {

    const images = useMemo(() => Array.from({ length: 5 }, (_, index) => `https://source.unsplash.com/random/1920x600?fruit,${Date.now() % 10 + index}`), []);

    return (
        <CarouselContainer>
            <OriginalCarousel autoplay>
            {images && images.map((image, index) => {
                return (
                    <CarouselCard key={index}>
                        <img src={image} alt="carousel" style={{ width: '100%', height: 'auto' }} />
                    </CarouselCard>
                )
            })}
            </OriginalCarousel>
        </CarouselContainer>
    );
}