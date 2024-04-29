import styled from "styled-components";
import { Layout } from "antd";

export const HeaderContainer = styled(Layout.Header)`
    background-color: var(--secondary-color);
    display: flex;
    justify-content: space-between;
`;

export const LogoContainer = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-transform: uppercase;
    cursor: pointer;
`;

export const MenuContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

export const MenuItem = styled.div`
    color: var(--primary-color);
    cursor: pointer;
    font-weight: bold;
    text-transform: capitalize;
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    min-width: 700px;
`;