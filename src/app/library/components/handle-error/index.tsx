import React, {FC, memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {dispatch, useSelector} from '@common';
import {STT_INTERNAL_SERVER, STT_UNAUTHORIZED} from '@config/api.const';
import {setError, setShowErrorModalStatus} from '@store/app-reducer/reducer';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import isEqual from 'react-fast-compare';
import {AppDialog} from '@components';

const HandlingErrorComponent: FC = () => {
  const {t: getLabel} = useTranslation();

  const error = useSelector(state => state.app.error);
  const isShowModalError = useSelector(state => state.app.showModal);

  const open = useMemo(
    () =>
      Boolean(error) &&
      (isShowModalError ||
        error?.status === STT_INTERNAL_SERVER ||
        error?.status === STT_UNAUTHORIZED),
    [error, isShowModalError],
  );

  const msgError = useMemo(() => {
    if (error?.message) {
      switch (error?.status) {
        default:
          return error?.message;
      }
    } else {
      return getLabel('error:haveError');
    }
  }, [error]);

  const onSubmitDialog = () => {
    dispatch(setError(null));
    dispatch(setShowErrorModalStatus(true));
    if (error?.status === STT_UNAUTHORIZED) {
      navigate(APP_SCREENS.UN_AUTHORIZED);
    }
  };

  return (
    <>
      {Boolean(open) && (
        <AppDialog
          open={open}
          title={error?.title || ''}
          message={msgError}
          errorType
          showButton
          viewOnly={error?.viewOnly ?? true}
          onSubmit={onSubmitDialog}
          submitLabel={'OK'}
          modalType={{width: '80%'}}
        />
      )}
    </>
  );
};

export const HandlingError = memo(HandlingErrorComponent, isEqual);
