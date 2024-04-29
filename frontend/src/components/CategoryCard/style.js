import styled from 'styled-components'

export const CategoryCardContainer = styled.div`
    background-color: var(--secondary-color);
    color: var(--primary-color);
    padding: 0.5rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 550;
    cursor: pointer;
    display: flex;
    text-transform: capitalize;
    &:hover {
        background-color: var(--primary-color);
        color: var(--secondary-color);
    }
`;