import cn from './NotificationViewer.module.scss';

export interface NotificationViewerProps {
    errors?: Error[];
    notifications?: string[];
}

export default function NotificationViewer(props: NotificationViewerProps) {
    return (
        <div className={cn.notificationViewer}>
            {props.errors?.map((error, index) => (
                <div key={index}
                     className={`${cn.notificationViewer__message} ${cn.notificationViewer__message_type_error}`}>
                    <div>
                        {error.stack ?
                            error.stack :
                            error.message}
                    </div>
                </div>
            ))}
            {props.notifications?.map((msg, index) => (
                <div key={index}
                     className={`${cn.notificationViewer__message} ${cn.notificationViewer__message_type_info}`}>
                    {msg}
                </div>
            ))}
        </div>
    );
}
