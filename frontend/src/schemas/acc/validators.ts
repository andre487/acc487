import IAccountStatePureDataSchema from './IAccountStatePureData.json';
import Ajv from 'ajv';
import {AccountStatePureData} from '../../types/acc.ts';

const ajv = new Ajv();
const iAccountStatePureDataSchemaValidator = ajv.compile(IAccountStatePureDataSchema);

export function validateAccountStatePureData(data: unknown): data is AccountStatePureData {
    return iAccountStatePureDataSchemaValidator(data);
}
