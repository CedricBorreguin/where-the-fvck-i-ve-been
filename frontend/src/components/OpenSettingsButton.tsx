import type React from "react";
import styled from "styled-components";

const OpenModalButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 10px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: var(--color-primary-dark);
    }

    img {
        display: block;
        width: 24px;
        height: 24px;
    }
`;

const OpenSettingsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <OpenModalButton onClick={onClick}>
            <img src="/icons/settings.svg" alt="Settings" width={24} height={24} />
        </OpenModalButton>
    );
};

export default OpenSettingsButton;
