import Carousel from '../../components/Carousel';
import CategorySlider from '../../components/CategorySlider';
import Recommend from '../../components/Recommend';

export default function Home() {
    return (
        <>
            <CategorySlider />
            <Carousel />
            <Recommend title="Bán chạy" fetchUrl="/api/products/recommend" />
            <Recommend title="Săn sale" fetchUrl="/api/products/recommend" />
            <Recommend title="Nhập khẩu chính hãng" fetchUrl="/api/products/recommend" />
            <Recommend title="Đề xuất cho bạn" fetchUrl="/api/products/recommend" />
            <Recommend title="Mới lên kệ" fetchUrl="/api/products/recommend" />
        </>
    );
}
