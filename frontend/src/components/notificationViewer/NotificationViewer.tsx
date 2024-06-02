import React, {useMemo, useRef, useEffect} from 'react';
import cn from './NotificationViewer.module.scss';
import {ErrorsSetter, NotificationsSetter} from '@context/appContext.ts';

export interface NotificationViewerProps {
    errors: Error[];
    setErrors: ErrorsSetter;
    notifications: string[];
    setNotifications: NotificationsSetter;
    messageTimeout?: number;
}

export default function NotificationViewer({
    errors,
    setErrors,
    notifications,
    setNotifications,
    messageTimeout = 10_000,
}: NotificationViewerProps) {
    const elems = useMemo(() => {
        const elems = [
            ...errors.map((error, index): [number, Error] => [index, error]),
            ...notifications.map((msg, index): [number, string] => [index, msg]),
        ];
        elems.sort((a, b) => a[0] - b[0]);
        return elems;
    }, [errors, notifications]);

    return (
        <div className={cn.notificationViewerWrapper}>
            <div className={cn.notificationViewer}>
                {elems.map((x, idx) => {
                    const elem = x[1];
                    const key = `${idx}:${elem}`;
                    if (elem instanceof Error) {
                        return <NotificationMessage
                            key={key}
                            elem={elem}
                            setNewElems={setErrors}
                            messageTimeout={messageTimeout} />;
                    } else {
                        return <NotificationMessage
                            key={key}
                            elem={elem}
                            setNewElems={setNotifications}
                            messageTimeout={messageTimeout} />;
                    }
                })}
            </div>
        </div>
    );
}

interface NotificationMessageProps<T> {
    elem: T;
    messageTimeout: number;
    setNewElems: (setter: (elems: T[]) => T[]) => void;
}

function NotificationMessage<T>({
    elem,
    setNewElems,
    messageTimeout,
}: NotificationMessageProps<T>) {
    const domRef = useRef(null);

    let text = String(elem);
    if (elem instanceof Error && elem.stack) {
        text = elem.stack;
    }

    const messageTypeClass = elem instanceof Error ?
        cn.notificationViewer__message_type_error :
        cn.notificationViewer__message_type_info;

    useEffect(() => {
        const tm = setTimeout(() => {
            removeNotificationElement(domRef.current, elem, setNewElems);
        }, messageTimeout);
        return () => clearTimeout(tm);
    }, [elem, setNewElems, messageTimeout]);

    function onClick(event: React.MouseEvent) {
        const domElem = event.target as HTMLDivElement;
        removeNotificationElement(domElem, elem, setNewElems);
    }

    useEffect(() => {
        if (domRef.current == null) {
            console.warn('Notification element ref is null');
            return;
        }
        const domElem = domRef.current as HTMLDivElement;
        domElem.classList.remove(cn.notificationViewer__message_invisible);
    });

    return (
        <div ref={domRef}
            onClick={onClick}
            className={`${cn.notificationViewer__message} ${messageTypeClass}`}>
            {text}
        </div>
    );
}

function removeNotificationElement<T>(
    domElem: HTMLDivElement | null,
    elem: T,
    setNewElems: (setter: (elems: T[]) => T[]) => void,
) {
    if (!domElem) {
        return;
    }
    domElem.classList.add(cn.notificationViewer__message_invisible);
    domElem.addEventListener('animationend', () => {
        setNewElems(elems => elems.filter(x => x !== elem));
    });
}
