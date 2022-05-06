import { DeepPartial, MockCloudEventPartials } from '../../types';
import { CloudFunction } from 'firebase-functions/v2';
import { getEventFilters, getEventType, PROJECT_ID } from '../helpers';
import {
  AppDistributionEvent,
  NewTesterDevicePayload,
} from 'firebase-functions/v2/alerts/appDistribution';

export const alertsAppDistributionOnNewTesterIosDevicePublished: MockCloudEventPartials<AppDistributionEvent<
  NewTesterDevicePayload
>> = {
  generatePartial(
    _: CloudFunction<AppDistributionEvent<NewTesterDevicePayload>>
  ): DeepPartial<AppDistributionEvent<NewTesterDevicePayload>> {
    const source = `//firebasealerts.googleapis.com/projects/${PROJECT_ID}`;
    const now = new Date().toISOString();

    return {
      source,
      data: {
        createTime: now,
        endTime: now,
        payload: {
          '@type':
            'type.googleapis.com/google.events.firebase.firebasealerts.v1.AppDistroNewTesterIosDevicePayload',
          testerName: 'tester name',
          testerEmail: 'test@test.com',
          testerDeviceModelName: 'tester device model name',
          testerDeviceIdentifier: 'tester device identifier',
        },
      },
    };
  },
  match(
    cloudFunction: CloudFunction<AppDistributionEvent<NewTesterDevicePayload>>
  ): boolean {
    return (
      getEventType(cloudFunction) ===
        'google.firebase.firebasealerts.alerts.v1.published' &&
      getEventFilters(cloudFunction)?.alerttype ===
        'appDistribution.newTesterIosDevice'
    );
  },
};
