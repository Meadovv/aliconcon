import styled from "styled-components";
import { Input as OriginalInput, Button } from "antd";

export const LoginButton = styled(Button)`
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    &:hover {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
        color: #fff;
    }
`;