import styled from "styled-components";

export const RecommendContainer = styled.div`
    margin: 25px;
    padding: 15px;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    background: linear-gradient(to bottom, var(--secondary-color), white);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
`;

export const Title = styled.div`
    color: var(--primary-color);
    text-transform: capitalize;
    font-size: 1.2rem;
    font-weight: 650;
`;