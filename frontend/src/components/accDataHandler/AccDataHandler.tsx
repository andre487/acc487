import {useAppContext} from '../../utils/context-funcs.ts';
import {useEffect} from 'react';
import {AccountStateData} from '../../models/acc.ts';

export default function AccDataHandler() {
    const {
        accPureData,
        setAccPureData,
        config,
    } = useAppContext();

    // Get accounts data
    useEffect(() => {
        console.log('Get accounts data');

        const url = `${config.apiBaseUrl}/api/accounts/get-data`;
        const abortController = new AbortController();

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            signal: abortController.signal,
        }).then(resp => {
            return resp.json();
        }).then(data => {
            setAccPureData(AccountStateData.fromJson(data.data));
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
    }, [config.apiBaseUrl, setAccPureData]);

    // Send accounts data
    useEffect(() => {
        if (!accPureData.version) {
            return;
        }

        console.log('Send accounts data');

        const accData = new AccountStateData(accPureData.accounts, accPureData.version);
        const url = `${config.apiBaseUrl}/api/accounts/set-data`;
        const abortController = new AbortController();

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: accData.toJSON(),
            credentials: 'include',
            signal: abortController.signal,
        }).then(resp => resp.json()).then(data => {
            if (data.status !== 'OK') {
                throw new Error(`Status is not OK: ${data.status}`);
            }
        });

        return () => {
            abortController.abort({name: 'AbortError', message: 'SetData called twice'});
        };
    }, [accPureData, config.apiBaseUrl]);

    return <></>;
}
