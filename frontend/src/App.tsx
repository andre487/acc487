import AccDataHandler from '@components/accDataHandler/AccDataHandler.tsx';
import ErrorListener from '@components/errorListener/ErrorListener.tsx';
import Grid from '@components/grid/Grid.tsx';
import Grid2 from '@components/grid2/Grid.tsx';
import Header from '@components/header/Header.tsx';
import NotificationViewer from '@components/notificationViewer/NotificationViewer.tsx';
import {useAppContext} from '@context/appContext.ts';

export default function App() {
    const {
        accPureData,
        setAccPureData,
        errors,
        setErrors,
        notifications,
        setNotifications,
        config,
    } = useAppContext();

    return (
        <>
            <ErrorListener />
            <AccDataHandler />

            <Header user={config.user} />
            <NotificationViewer
                errors={errors}
                setErrors={setErrors}
                notifications={notifications}
                setNotifications={setNotifications} />
            <Grid2 accId={0} accPureData={accPureData} setAccPureData={setAccPureData} />
            <Grid accId={0} accPureData={accPureData} setAccPureData={setAccPureData} />
        </>
    );
}
