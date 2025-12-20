import type React from "react";
import styled from "styled-components";
import useI18n from "../i18n/useI18n";

const TitleContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 15%;
    right: 15%;
    background-color: var(--color-primary);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    z-index: 1000;
    pointer-events: all;

    h1 {
        margin: 0;
        color: white;
        text-align: center;
    }
`;

const Title: React.FC = () => {
    const { translate } = useI18n();

    return (
        <TitleContainer>
            <h1>{translate("app_title")}</h1>
        </TitleContainer>
    );
};

export default Title;
