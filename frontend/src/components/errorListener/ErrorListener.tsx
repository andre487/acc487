import {useEffect} from 'react';
import {useAppContext} from '../../context/appContext.ts';

export default function ErrorListener() {
    const {
        setErrors,
    } = useAppContext();

    useEffect(() => {
        console.log('Set error listeners');

        function onError(event: ErrorEvent) {
            setErrors(errors => {
                const newErrors = errors.slice(0, 4);
                newErrors.splice(0, 0, event.error);
                return newErrors;
            });
        }

        function onPromiseRejected(event: PromiseRejectionEvent) {
            let reason: unknown = event.reason;
            if (!(reason instanceof Error)) {
                reason = new Error(String(reason));
            }

            setErrors(errors => {
                const newErrors = errors.slice(0, 4);
                newErrors.splice(0, 0, reason as Error);
                return newErrors;
            });
        }

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onPromiseRejected);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onPromiseRejected);
        };
    }, [setErrors]);

    return <></>;
}
