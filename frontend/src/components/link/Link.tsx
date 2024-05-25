import React from 'react';
import { ClickableComponentProps } from '../components-common-types.ts';
import './Link.css';

interface LinkProps extends ClickableComponentProps {
    href?: string;
    id?: string;
    theme?: string;
}

export default function Link(props: React.PropsWithChildren<LinkProps>) {
    let className = 'link' + (props.className ? ` ${props.className}` : '');
    if (props.theme) {
        className += ` link_theme_${props.theme}`;
    }

    return (
        <a href={props.href} id={props.id} onClick={props.onClick} className={className}>{props.children}</a>
    );
}
