import './NotificationViewer.css';

export interface NotificationViewerProps {
    errors?: Error[];
    notifications?: string[];
}

export default function NotificationViewer(props: NotificationViewerProps) {
    return (
        <div className="notification-viewer">
            {props.errors?.map((error, index) => (
                <div key={index} className="notification-viewer__message notification-viewer__message_type_error">
                    {error.stack ?
                        <div className="notification-viewer__error-stack">
                            {error.stack}
                        </div> :
                        <div className="notification-viewer__error-title">
                            {error.message}
                        </div>
                    }
                </div>
            ))}
            {props.notifications?.map((msg, index) => (
                <div key={index} className="notification-viewer__message notification-viewer__message_type_info">
                    {msg}
                </div>
            ))}
        </div>
    );
}
