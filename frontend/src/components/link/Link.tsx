import React from 'react';
import { ClickableComponentProps } from '../components-common-types.ts';
import cn from './Link.module.scss';

interface LinkProps extends ClickableComponentProps {
    href?: string;
    id?: string;
    theme?: string;
}

export default function Link(props: React.PropsWithChildren<LinkProps>) {
    let className = cn.link + (props.className ? ` ${props.className}` : '');
    if (props.theme) {
        const propName = `link_theme_${props.theme}`;
        if (cn[propName]) {
            className += ` ${cn[propName]}`;
        } else {
            console.error('Link theme not found:', props.theme);
        }
    }

    return (
        <a href={props.href} id={props.id} onClick={props.onClick} className={className}>{props.children}</a>
    );
}
