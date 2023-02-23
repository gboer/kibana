/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable @kbn/eslint/module_migration */

import { euiDarkVars } from '@kbn/ui-theme';
import { I18nProvider } from '@kbn/i18n-react';

import React from 'react';
import type { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { Provider as ReduxStoreProvider } from 'react-redux';
import type { Store } from 'redux';
import { BehaviorSubject } from 'rxjs';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore as createReduxStore } from 'redux';

import type { Action } from '@kbn/ui-actions-plugin/public';
import { CellActionsProvider } from '@kbn/cell-actions';
import { mockGlobalState } from './global_state';
import { createKibanaContextProviderMock, createStartServicesMock } from '../lib/kibana_react.mock';
// import type { FieldHook } from '../../shared_imports';
import { createSecuritySolutionStorageMock, localStorageMock } from './mock_local_storage';
// import { UserPrivilegesProvider } from '../components/user_privileges/user_privileges_context';

interface Props {
  children?: React.ReactNode;
  store?: Store;
  onDragEnd?: (result: DropResult, provided: ResponderProvided) => void;
  cellActions?: Action[];
}

export const kibanaObservable = new BehaviorSubject(createStartServicesMock());

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock(),
});
window.scrollTo = jest.fn();
const MockKibanaContextProvider = createKibanaContextProviderMock();
const { storage } = createSecuritySolutionStorageMock();

const createStore = (state: any) => createReduxStore(() => {}, state);

/** A utility for wrapping children in the providers required to run most tests */
export const TestProvidersComponent: React.FC<Props> = ({
  children,
  store = createStore(mockGlobalState),
  onDragEnd = jest.fn(),
  cellActions = [],
}) => {
  const queryClient = new QueryClient();
  return (
    <I18nProvider>
      <MockKibanaContextProvider>
        <ReduxStoreProvider store={store}>
          <ThemeProvider theme={() => ({ eui: euiDarkVars, darkMode: true })}>
            <QueryClientProvider client={queryClient}>
              <CellActionsProvider getTriggerCompatibleActions={() => Promise.resolve(cellActions)}>
                <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
              </CellActionsProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </ReduxStoreProvider>
      </MockKibanaContextProvider>
    </I18nProvider>
  );
};

/**
 * A utility for wrapping children in the providers required to run most tests
 * WITH user privileges provider.
 */
const TestProvidersWithPrivilegesComponent: React.FC<Props> = ({
  children,
  store = createStore(mockGlobalState),
  onDragEnd = jest.fn(),
  cellActions = [],
}) => (
  <I18nProvider>
    <MockKibanaContextProvider>
      <ReduxStoreProvider store={store}>
        <ThemeProvider theme={() => ({ eui: euiDarkVars, darkMode: true })}>
          <CellActionsProvider getTriggerCompatibleActions={() => Promise.resolve(cellActions)}>
            <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
          </CellActionsProvider>
        </ThemeProvider>
      </ReduxStoreProvider>
    </MockKibanaContextProvider>
  </I18nProvider>
);

export const TestProviders = React.memo(TestProvidersComponent);
export const TestProvidersWithPrivileges = React.memo(TestProvidersWithPrivilegesComponent);

// export const useFormFieldMock = <T,>(options?: Partial<FieldHook<T>>): FieldHook<T> => {
//   return {
//     path: 'path',
//     type: 'type',
//     value: 'mockedValue' as unknown as T,
//     isPristine: false,
//     isDirty: false,
//     isModified: false,
//     isValidating: false,
//     isValidated: false,
//     isChangingValue: false,
//     errors: [],
//     isValid: true,
//     getErrorsMessages: jest.fn(),
//     onChange: jest.fn(),
//     setValue: jest.fn(),
//     setErrors: jest.fn(),
//     clearErrors: jest.fn(),
//     validate: jest.fn(),
//     reset: jest.fn(),
//     __isIncludedInOutput: true,
//     __serializeValue: jest.fn(),
//     ...options,
//   };
// };
