import {useEffect} from 'react';
import {useAppContext} from '../../utils/context-funcs.ts';

// TODO: How not to rebind listeners?
export default function ErrorListener() {
    const {
        errors,
        setErrors,
    } = useAppContext();

    useEffect(() => {
        console.log('Set error listeners');

        const onError = (event: ErrorEvent) => {
            const newErrors = errors.slice(0, 4);
            newErrors.splice(0, 0, event.error);
            setErrors(newErrors);
        };

        const onPromiseRejected = (event: PromiseRejectionEvent) => {
            const newErrors = errors.slice(0, 4);
            let reason: unknown = event.reason;
            if (!(reason instanceof Error)) {
                reason = new Error(String(reason));
            }
            newErrors.splice(0, 0, reason as Error);
            setErrors(newErrors);
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onPromiseRejected);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onPromiseRejected);
        };
    }, [errors, setErrors]);

    return <></>;
}
