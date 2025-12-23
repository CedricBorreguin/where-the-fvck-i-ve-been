import type React from "react";
import styled from "styled-components";
import useI18n from "../i18n/useI18n";

const TitleContainer = styled.div`
    position: absolute;
    top: 10px;
    right: calc(10px + 44px + 3px);
    padding: 5px 10px;
    border-radius: 8px;
    background-color: #ffffffcc;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    z-index: 1000;
    pointer-events: all;
    gap: 3px;

    h1 {
        margin: 0;
        color: var(--color-primary);
        text-align: center;
        font-size: 0.85rem;
    }

    p {
        margin: 0;
        color: var(--color-primary);
        font-size: 0.7rem;
        text-align: center;
        margin-left: 10px;

        a {
            color: var(--color-primary);
        }
    }
`;

const Title: React.FC = () => {
    const { translate } = useI18n();

    return (
        <TitleContainer>
            <h1>{translate("app_title")}</h1>

            <p>
                {translate("developed_by")}{" "}
                <a
                    href="https://www.linkedin.com/in/cedric-borreguin/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Cedric Borreguín
                </a>
            </p>
        </TitleContainer>
    );
};

export default Title;
