import { DeepPartial, MockCloudEventAbstractFactory } from '../../types';
import { CloudEvent, CloudFunction, database } from 'firebase-functions/v2';
import {
  getBaseCloudEvent,
  getEventType,
} from '../helpers';
import {makeChangedDataSnapshot} from './helpers';

export const databaseOnRefWritten: MockCloudEventAbstractFactory<database.DatabaseEvent<
  database.DataSnapshot
>> = {
  generateMock(
    cloudFunction: CloudFunction<database.DatabaseEvent<any>>,
    cloudEventPartial?: DeepPartial<database.DatabaseEvent<any>>
  ): database.DatabaseEvent<any> {
    const instance = (cloudEventPartial?.instance as string) || 'instance-1';
    const firebaseDatabaseHost =
      (cloudEventPartial?.firebaseDatabaseHost as string) ||
      'firebaseDatabaseHost';
    const ref = (cloudEventPartial?.ref as string) || '/foo/bar';
    const location = (cloudEventPartial?.location as string) || 'us-central1';
    const params: Record<string, string> = cloudEventPartial?.params || {};

    return {
      // Spread common fields
      ...getBaseCloudEvent(cloudFunction),

      // Update fields specific to this CloudEvent
      data: makeChangedDataSnapshot(cloudFunction, cloudEventPartial, instance),

      instance,
      firebaseDatabaseHost,
      ref,
      location,
      params,
    };
  },
  match(cloudFunction: CloudFunction<CloudEvent<unknown>>): boolean {
    return (
      getEventType(cloudFunction) === 'google.firebase.database.ref.v1.written'
    );
  },
};
