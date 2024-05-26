import {useEffect} from 'react';
import Header from './components/header/Header.tsx';
import Code from './components/code/Code.tsx';
import NotificationViewer from './components/notification-viewer/NotificationViewer.tsx';
import {useAppContext} from './utils/context.tsx';

export default function App() {
    const {appData, setAppData, config} = useAppContext();

    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            appData.errors = (appData.errors ?? []).slice(0, 4);
            appData.errors.splice(0, 0, event.error);
            setAppData({...appData});
        };

        const onPromiseRejected = (event: PromiseRejectionEvent) => {
            appData.errors = (appData.errors ?? []).slice(0, 4);
            let reason: unknown = event.reason;
            if (!(reason instanceof Error)) {
                reason = new Error(String(reason));
            }
            appData.errors.splice(0, 0, reason as Error);
            setAppData({...appData});
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onPromiseRejected);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onPromiseRejected);
        };
    }, []);

    useEffect(() => {
        const url = `${config.apiBaseUrl}/test-data`;
        fetch(url, {credentials: 'include'}).then(resp => {
            return resp.json();
        }).then(data => {
            const newAppData = {...appData, appData: data};
            setAppData(newAppData);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    return (
        <>
            <Header user={config.user} />
            <NotificationViewer errors={appData.errors} notifications={appData.notifications} />
            <Code data={appData} />
        </>
    );
}
