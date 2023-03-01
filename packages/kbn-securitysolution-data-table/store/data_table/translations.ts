/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';

export const LOADING_EVENTS = i18n.translate(
  'securitySolutionDataTable.dataTable.loadingEventsDataLabel',
  {
    defaultMessage: 'Loading Events',
  }
);

export const UNIT = (totalCount: number) =>
  i18n.translate('securitySolutionDataTable.dataTable.unit', {
    values: { totalCount },
    defaultMessage: `{totalCount, plural, =1 {alert} other {alerts}}`,
  });
