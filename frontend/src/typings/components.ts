import { MouseEventHandler } from 'react';

export interface BaseHtmlComponentProps {
    className?: string;
}

export interface ClickableComponentProps extends BaseHtmlComponentProps {
    onClick?: MouseEventHandler;
}
