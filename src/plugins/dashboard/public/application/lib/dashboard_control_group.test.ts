/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Filter } from '@kbn/es-query';
import { mockControlGroupInput } from '../../../../controls/common/mocks';
import { ControlGroupContainer } from '../../../../controls/public/control_group/embeddable/control_group_container';
import { combineDashboardFiltersWithControlGroupFilters } from './dashboard_control_group';

jest.mock('../../../../controls/public/control_group/embeddable/control_group_container');

const testFilter1: Filter = {
  meta: {
    key: 'testfield',
    alias: null,
    disabled: false,
    negate: false,
  },
  query: { match_phrase: { testfield: 'hello' } },
};

const testFilter2: Filter = {
  meta: {
    key: 'testfield',
    alias: null,
    disabled: false,
    negate: false,
  },
  query: { match_phrase: { testfield: 'guten tag' } },
};

const testFilter3: Filter = {
  meta: {
    key: 'testfield',
    alias: null,
    disabled: false,
    negate: false,
  },
  query: {
    bool: {
      should: {
        0: { match_phrase: { testfield: 'hola' } },
        1: { match_phrase: { testfield: 'bonjour' } },
      },
    },
  },
};

const mockControlGroupContainer = new ControlGroupContainer(mockControlGroupInput());

describe('Test dashboard control group', () => {
  describe('Combine dashboard filters with control group filters test', () => {
    it('Combined filter pills do not get overwritten', async () => {
      const dashboardFilterPills = [testFilter1, testFilter2];
      mockControlGroupContainer.getOutput = jest.fn().mockReturnValue({ filters: [] });
      const combinedFilters = combineDashboardFiltersWithControlGroupFilters(
        dashboardFilterPills,
        mockControlGroupContainer
      );
      expect(combinedFilters).toEqual(dashboardFilterPills);
    });

    it('Combined control filters do not get overwritten', async () => {
      const controlGroupFilters = [testFilter1, testFilter2];
      mockControlGroupContainer.getOutput = jest
        .fn()
        .mockReturnValue({ filters: controlGroupFilters });
      const combinedFilters = combineDashboardFiltersWithControlGroupFilters(
        [] as Filter[],
        mockControlGroupContainer
      );
      expect(combinedFilters).toEqual(controlGroupFilters);
    });

    it('Combined dashboard filter pills and control filters do not get overwritten', async () => {
      const dashboardFilterPills = [testFilter1, testFilter2];
      const controlGroupFilters = [testFilter3];
      mockControlGroupContainer.getOutput = jest
        .fn()
        .mockReturnValue({ filters: controlGroupFilters });
      const combinedFilters = combineDashboardFiltersWithControlGroupFilters(
        dashboardFilterPills,
        mockControlGroupContainer
      );
      expect(combinedFilters).toEqual(dashboardFilterPills.concat(controlGroupFilters));
    });
  });
});
