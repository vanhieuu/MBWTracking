import {
  CommonActions,
  NavigationAction,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {createRef} from 'react';
import {RootStackParamsList} from './screen-type';

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamsList>>();

export function navigate<RouteName extends keyof RootStackParamsList>(
  ...arg: undefined extends RootStackParamsList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamsList[RouteName]]
    : [screen: RouteName, params?: RootStackParamsList[RouteName]]
) {
  navigationRef.current?.navigate(
    arg[0] as any,
    arg.length > 1 ? arg[1] : undefined,
  );
}
export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack);
}

export function pop(screenCount: number) {
  navigationRef?.current?.dispatch(StackActions.pop(screenCount));
}

export function dispatchNav(action: NavigationAction) {
  navigationRef.current?.dispatch(action);
}
export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}
