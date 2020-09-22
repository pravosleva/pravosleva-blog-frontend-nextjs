import React, { useState, useCallback, Suspense } from 'react'
// import styled from 'styled-components'
import { Button } from '@/ui-kit/atoms'
// import { Modal } from './components/Modal'
import { useUnscrolledBody } from '@/hooks/use-unscrolled-body'
import { lazy } from '@loadable/component';
import { withTranslator } from '@/hocs/with-translator'

const Modal = lazy(() =>
  // @ts-ignore
  import(
    /* webpackChunkName: "ModalGallery" */ './components/Modal'
  ).then(({ Modal }) => ({
    default: Modal,
  }))
);

interface IProps {
  photos: string[]
  title: string
  t: (str: string) => string
}

export const PhotosBtnWrapper = withTranslator(({ t, photos, title }: IProps) => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const { onBlockScrollBody } = useUnscrolledBody(false)
  const handleOpenModal = () => {
    setIsModalOpened(true)
    onBlockScrollBody(true)
  }
  const handleCloseModal = useCallback(() => {
    setIsModalOpened(false)
    onBlockScrollBody(false)
  }, [setIsModalOpened])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Button typeName='orange' size='small' width="medium" onClick={handleOpenModal}>{t('PHOTOS')}</Button>
      {typeof window !== 'undefined' && isModalOpened && (
        <Suspense fallback={<div>Loading...</div>}>
          <Modal
            // @ts-ignore
            isOpened={isModalOpened}
            title={title}
            onHideModal={handleCloseModal}
            targetActionLabel={t('CLOSE')}
            onClickTargetAction={handleCloseModal}
            photos={photos}
          />
        </Suspense>
      )}
    </div>
  )
})