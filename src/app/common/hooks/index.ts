/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {AppModule, onCheckType} from '@common';

import {AppTheme, useTheme} from '@theme';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import {BackHandler, Keyboard, LayoutAnimation, Platform} from 'react-native';
import {shallowEqual, useSelector as useReduxSelector} from 'react-redux';
import debounce from 'lodash.debounce';
import {RootState} from '@store/all-reducers';

type UseStateFull<T = any> = {
  value: T;
  setValue: React.Dispatch<SetStateAction<T>>;
};

function useSelector<T>(
  selector: (state: RootState) => T,
  equalityFn = shallowEqual,
): T {
  return useReduxSelector<RootState, T>(selector, equalityFn);
}
type ConfigAnimated = {
  duration: number;
  type: keyof typeof LayoutAnimation.Types;
  creationProp: keyof typeof LayoutAnimation.Properties;
};

function useAnimatedState<T>(
  initialValue: T,
  config: ConfigAnimated = {
    duration: 500,
    creationProp: 'opacity',
    type: 'easeInEaseOut',
  },
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);

  const onSetState = useCallback(
    (newValue: T | ((prevState: T) => T)) => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          config.duration,
          LayoutAnimation.Types[config.type],
          LayoutAnimation.Properties[config.creationProp],
        ),
      );
      setValue(newValue);
    },
    [config],
  );
  return [value, onSetState];
}

export const useDebounce = (
  fnToDebounce: (...args: any[]) => any,
  durationInMs = 300,
) => {
  if (isNaN(durationInMs)) {
    throw new TypeError('durationInMs for debounce should be a number');
  }

  if (fnToDebounce == null) {
    throw new TypeError('fnToDebounce cannot be null');
  }

  if (typeof fnToDebounce !== 'function') {
    throw new TypeError('fnToDebounce should be a function');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce(fnToDebounce, durationInMs, {leading: true, trailing: false}),
    [fnToDebounce, durationInMs],
  );
};

export default useDebounce;

function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

type UseArrayActions<T> = {
  setValue: UseStateFull<T[]>['setValue'];
  add: (value: T | T[]) => void;
  push: (value: T | T[]) => void;
  pop: () => void;
  shift: () => void;
  unshift: (value: T | T[]) => void;
  clear: () => void;
  move: (from: number, to: number) => void;
  removeById: (
    id: T extends {id: string}
      ? string
      : T extends {id: number}
      ? number
      : unknown,
  ) => void;
  modifyById: (
    id: T extends {id: string}
      ? string
      : T extends {id: number}
      ? number
      : unknown,
    newValue: Partial<T>,
  ) => void;
  removeIndex: (index: number) => void;
};
type UseArray<T = any> = [T[], UseArrayActions<T>];
function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, setValue] = useState(initial);

  const push = useCallback((a: any) => {
    setValue(v => [...v, ...(Array.isArray(a) ? a : [a])]);
  }, []);

  const unshift = useCallback(
    (a: any) => setValue(v => [...(Array.isArray(a) ? a : [a]), ...v]),
    [],
  );

  const pop = useCallback(() => setValue(v => v.slice(0, -1)), []);

  const shift = useCallback(() => setValue(v => v.slice(1)), []);

  const move = useCallback(
    (from: number, to: number) =>
      setValue(it => {
        const copy = it.slice();
        copy.splice(to < 0 ? copy.length + to : to, 0, copy.splice(from, 1)[0]);
        return copy;
      }),
    [],
  );

  const clear = useCallback(() => setValue(() => []), []);

  const removeById = useCallback(
    (id: any) => setValue(arr => arr.filter((v: any) => v && v.id !== id)),
    [],
  );

  const removeIndex = useCallback(
    (index: number) =>
      setValue(v => {
        const copy = v.slice();
        copy.splice(index, 1);
        return copy;
      }),
    [],
  );
  const update = useCallback((index: number, newElement: any) => {
    setValue(a => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1, a.length),
    ]);
  }, []);

  const modifyById = useCallback(
    (id: any, newValue: any) =>
      setValue(arr =>
        arr.map((v: any) => (v.id === id ? {...v, ...newValue} : v)),
      ),
    [],
  );

  const actions = useMemo(
    () => ({
      setValue,
      add: push,
      unshift,
      push,
      move,
      clear,
      removeById,
      removeIndex,
      pop,
      shift,
      modifyById,
      update,
    }),
    [
      modifyById,
      push,
      unshift,
      move,
      clear,
      removeById,
      removeIndex,
      pop,
      shift,
      update,
    ],
  );
  return [value, actions];
}

type UseBooleanActions = {
  setValue: React.Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};
type UseBoolean = [boolean, UseBooleanActions];
function useBoolean(initial: boolean): UseBoolean {
  const [value, setValue] = useState<boolean>(initial);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  const actions = useMemo(
    () => ({setValue, toggle, setTrue, setFalse}),
    [setFalse, setTrue, toggle],
  );

  return useMemo(() => [value, actions], [actions, value]);
}

type UseNumberActions = {
  setValue: React.Dispatch<SetStateAction<number>>;
  increase: (value?: number) => void;
  decrease: (value?: number) => void;
};
type UseNumber = [number, UseNumberActions];
function useNumber(
  initial: number,
  {
    upperLimit,
    lowerLimit,
    loop,
    step = 1,
  }: {
    upperLimit?: number;
    lowerLimit?: number;
    loop?: boolean;
    step?: number;
  } = {},
): UseNumber {
  const [value, setValue] = useState<number>(initial);

  const decrease = useCallback(
    (d?: number) => {
      setValue(aValue => {
        const decreaseBy = d !== undefined ? d : step;
        const nextValue = aValue - decreaseBy;

        if (lowerLimit !== undefined) {
          if (nextValue < lowerLimit) {
            if (loop && upperLimit) {
              return upperLimit;
            }

            return lowerLimit;
          }
        }

        return nextValue;
      });
    },
    [loop, lowerLimit, step, upperLimit],
  );

  const increase = useCallback(
    (i?: number) => {
      setValue(aValue => {
        const increaseBy = i !== undefined ? i : step;
        const nextValue = aValue + increaseBy;

        if (upperLimit !== undefined) {
          if (nextValue > upperLimit) {
            if (loop) {
              return initial;
            }
            return upperLimit;
          }
        }

        return nextValue;
      });
    },
    [initial, loop, step, upperLimit],
  );

  const actions = useMemo(
    () => ({
      setValue,
      increase,
      decrease,
    }),
    [decrease, increase],
  );

  return [value, actions];
}

const useTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalIdRef = useRef<any>(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000); // Update every 1 second
    } else {
      clearInterval(intervalIdRef.current);
      setElapsedTime(0);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  return {elapsedTime, isRunning, toggleTimer};
};

function useStateFull<T = any>(initial: T): UseStateFull<T> {
  const [value, setValue] = useState(initial);

  return useMemo(
    () => ({
      value,
      setValue,
    }),
    [value],
  );
}

function usePrevious<T = any>(value: T): T | undefined {
  const currentRef = useRef<T>(value);
  const previousRef = useRef<T>();
  if (currentRef.current != value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}

type UseSetArrayStateAction<T extends object> = React.Dispatch<
  SetStateAction<Partial<T>>
>;
type UseSetStateArray<T extends object> = [
  T,
  UseSetArrayStateAction<T>,
  () => void,
];
function useSetStateArray<T extends object>(
  initialValue: T,
): UseSetStateArray<T> {
  const [value, setValue] = useState<T>(initialValue);

  const setState = useCallback(
    (v: SetStateAction<Partial<T>>) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v),
      }));
    },
    [setValue],
  );

  const resetState = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setState, resetState];
}

type UseSetStateAction<T extends object> = React.Dispatch<
  SetStateAction<Partial<T>>
>;
type UseSetState<T extends object> = {
  setState: UseSetStateAction<T>;
  state: T;
  resetState: () => void;
};
function useSetState<T extends object>(initialValue: T): UseSetState<T> {
  const [state, setState, resetState] = useSetStateArray(initialValue);

  return useMemo(
    () => ({
      setState,
      resetState,
      state,
    }),
    [setState, resetState, state],
  );
}

function useStyle<T>(style: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return style(theme);
}

function useAsyncState<T>(
  initialValue: T,
): [
  T,
  (newValue: SetStateAction<T>, callback?: (newState: T) => void) => void,
] {
  const [state, setState] = useState(initialValue);
  const _callback = useRef<(newState: T) => void>();

  const _setState = (
    newValue: SetStateAction<T>,
    callback?: (newState: T) => void,
  ) => {
    if (callback) {
      _callback.current = callback;
    }
    setState(newValue);
  };

  useEffect(() => {
    if (typeof _callback.current === 'function') {
      _callback.current(state);
      _callback.current = undefined;
    }
  }, [state]);
  return [state, _setState];
}

type Init<T> = () => T;
function useConst<T>(init: Init<T>) {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = init();
  }

  return ref.current;
}

function useUnMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(() => () => callback(), []);
}

function useDidMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, []);
}

function useForceUpdate() {
  const unloadingRef = useRef(false);
  const [forcedRenderCount, setForcedRenderCount] = useState(0);

  useUnMount(() => (unloadingRef.current = true));

  return useCallback(() => {
    !unloadingRef.current && setForcedRenderCount(forcedRenderCount + 1);
  }, [forcedRenderCount]);
}

function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

  React.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeAllListeners('keyboardWillShow');
        Keyboard.removeAllListeners('keyboardWillHide');
      } else {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
      }
    };
  }, []);

  return isKeyboardShown;
}

function useDisableBackHandler(disabled: boolean, callback?: () => void) {
  // function
  const onBackPress = useCallback(() => {
    if (onCheckType(callback, 'function')) {
      callback();
    }
    return true;
  }, [callback]);

  useEffect(() => {
    if (disabled) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [disabled, onBackPress]);
}

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}

function useMounted(callback: () => void, deps: any[] = []) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

function useIsMounted() {
  const isMountedRef = useRef<boolean | null>(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
}

const useEffectOnce = (cb: React.EffectCallback) => {
  useEffect(cb, []);
};

const useDeepCompareEffect = (
  callback: React.EffectCallback,
  dependencies: React.DependencyList | any,
) => {
  const currentDependenciesRef = useRef();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
};

async function checkIfFirstLaunch() {
  try {
    const hasFirstLaunched = AppModule.storage.getString('@usesr_onboarded');
    if (hasFirstLaunched === null || hasFirstLaunched === undefined) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

const useGetOnboardingStatus = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isFirstLaunchIsLoading, setIsFirstLaunchIsLoading] = useState(true);

  React.useEffect(() => {
    const asyncF = async () => {
      const firstLaunch = await checkIfFirstLaunch();
      setIsFirstLaunch(firstLaunch);
      setIsFirstLaunchIsLoading(false);
    };
    asyncF();
  }, []);

  return {
    isFirstLaunch: isFirstLaunch,
    isLoading: isFirstLaunchIsLoading,
  };
};

export {
  useGetOnboardingStatus,
  useIsMounted,
  useDisableBackHandler,
  useDismissKeyboard,
  useEffectOnce,
  useInterval,
  useSelector,
  useDeepCompareEffect,
  useArray,
  useBoolean,
  useNumber,
  useStateFull,
  usePrevious,
  useSetState,
  useStyle,
  useAsyncState,
  useConst,
  useUnMount,
  useForceUpdate,
  useAnimatedState,
  useMounted,
  useIsKeyboardShown,
  useDidMount,
  useTimer,
};
