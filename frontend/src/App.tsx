import {useEffect} from 'react';
import Header from './components/header/Header.tsx';
import NotificationViewer from './components/notificationViewer/NotificationViewer.tsx';
import {useAppContext} from './utils/context.tsx';
import Grid from './components/grid/Grid.tsx';
import {AccountStateData} from './models/acc.ts';

export default function App() {
    const {appData, setAppData, config} = useAppContext();

    // Set errors listeners
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

    // Get accounts data
    useEffect(() => {
        const url = `${config.apiBaseUrl}/api/accounts/get-data`;
        const abortController = new AbortController();

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            signal: abortController.signal,
        }).then(resp => {
            return resp.json();
        }).then(data => {
            setAppData({
                ...appData,
                accData: AccountStateData.fromJson(data.data),
            });
        }).catch(err => {
            if (err.name == 'AbortError') {
                console.log(err.message);
            } else {
                throw err;
            }
        });

        return () => {
            abortController.abort({name: 'AbortError', message: 'GetData called twice'});
        };
    }, []);

    // Send accounts data
    useEffect(() => {
        if (!appData.accData?.version) {
            return;
        }

        const url = `${config.apiBaseUrl}/api/accounts/set-data`;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: appData.accData.toJSON(),
            credentials: 'include',
        }).then(resp => {
            return resp.json();
        }).then(data => {
            if (data.status !== 'OK') {
                throw new Error(`Status is not OK: ${data.status}`);
            }
        });
    }, [appData.accData?.version]);

    console.log('appData:', appData);

    return (
        <>
            <Header user={config.user} />
            <NotificationViewer errors={appData.errors} notifications={appData.notifications} />
            <Grid accId={0} appData={appData} setAppData={setAppData} />
        </>
    );
}
