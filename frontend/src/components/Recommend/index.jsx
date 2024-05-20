import { useEffect, useState } from 'react'
import {
    RecommendContainer,
    Title
} from './style'
import { Button } from 'antd'
import { RightCircleOutlined } from '@ant-design/icons';
import ProductSlider from '../ProductSlider'

export default function Recommend({ title, fetchUrl }) {

    const [products, setProducts] = useState([
        {
            img: 'https://dummyimage.com/600x400/000/7CFC00',
        },
        {
            img: 'https://dummyimage.com/600x400/000/ccccc',
        },
        {
            img: 'https://dummyimage.com/600x400/000/dddddd',
        },
        {
            img: 'https://dummyimage.com/600x400/000/fff',
        },
        {
            img: 'https://dummyimage.com/600x400/000/B22222',
        },
        {
            img: 'https://dummyimage.com/600x400/000/7CFC00',
        },
        {
            img: 'https://dummyimage.com/600x400/000/ccccc',
        },
        {
            img: 'https://dummyimage.com/600x400/000/dddddd',
        },
        {
            img: 'https://dummyimage.com/600x400/000/B22222',
        },
        {
            img: 'https://dummyimage.com/600x400/000/7CFC00',
        },
    ])

    const fetchProducts = async () => {

    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <RecommendContainer>
            <Title>{title}</Title>
            <ProductSlider products={products}/>
            <Button type="primary" icon={<RightCircleOutlined />} style={{
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                color: '#fff'
            }} size='large'>
                Xem thêm
            </Button>
        </RecommendContainer>
    )
}