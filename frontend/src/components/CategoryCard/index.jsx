import {
    CategoryCardContainer,
} from './style';

export default function CategoryCard({ category }) {
    return (
        <CategoryCardContainer>
            <div>{category.name}</div>
        </CategoryCardContainer>
    );
}