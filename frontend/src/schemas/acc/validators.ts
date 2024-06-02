import accountPureDataSchema from './AccountStatePureData.json';
import Ajv from 'ajv';
import {AccountStatePureData} from '@typings/acc.ts';

const ajv = new Ajv();
const iAccountStatePureDataSchemaValidator = ajv.compile(accountPureDataSchema);

export function validateAccountStatePureData(data: unknown): data is AccountStatePureData {
    return iAccountStatePureDataSchemaValidator(data);
}
