import React, { useRef } from 'react'
import { Modal as UiModal } from '@/ui-kit'
import { FooterRow } from '@/ui-kit/molecules/Modal/FooterRow'
import { Button } from '@/ui-kit/atoms'
import styled, { css } from 'styled-components'
import ImageGallery from 'react-image-gallery';
import useStateWithCallback from 'use-state-with-callback';
// import {
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from '~/common/styled-mui/template/smartprice/ProductReviewSection/components/svg';

// const ImageGallery = lazy(() =>
//   // @ts-ignore
//   import(
//     /* webpackChunkName: "ImageGallery" */ 'react-image-gallery'
//   ) // .then(({ ImageGallery }) => ({
//   //   default: ImageGallery,
//   // }))
// );

const maxImgHeight = 300;
const BodySection = styled('div')`
  && .image-gallery .image-gallery-swipe {
    // min-height: 50px !important;
    min-height: ${maxImgHeight}px !important;
    max-height: ${maxImgHeight}px !important;
  }
  && .image-gallery .image-gallery-swipe img {
    min-height: ${maxImgHeight}px !important;
    max-height: ${maxImgHeight}px !important;
    object-fit: contain;
  }
  /* & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail.active { } */

  /* & > div:nth-child(2) > div:nth-child(1) {
    width: 100%;
    width: 500px;
  } */
  &
    > div:nth-child(2)
    > div:nth-child(1)
    .image-gallery-thumbnails-container
    > button:not(:last-child) {
    margin-right: 15px;
  }
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail,
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail:hover {
    transition: transform 0.5s linear;
    border: none;
  }
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail:hover {
    transform: scale(1.1);
  }
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail.active {
    border: 1px solid #3882c4 !important;
  }
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail-inner,
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail-inner:hover,
  & > div:nth-child(2) > div:nth-child(1) .image-gallery-thumbnail.active,
  & > div:nth-child(2) > div:nth-child(1) img {
    border-radius: 4px !important;
  }
  & > div:nth-child(2) > div:nth-child(1) img {
    max-height: 325px;
  }
  &
    > div:nth-child(2)
    > div:nth-child(1)
    .image-gallery-icon.image-gallery-left-nav,
  &
    > div:nth-child(2)
    > div:nth-child(1)
    .image-gallery-icon.image-gallery-right-nav {
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2)) !important;
    transform: translateY(-50%) scale(0.7);
  }
  &
    > div:nth-child(2)
    > div:nth-child(1)
    .image-gallery-icon.image-gallery-left-nav:hover,
  &
    > div:nth-child(2)
    > div:nth-child(1)
    .image-gallery-icon.image-gallery-right-nav:hover {
    color: #3882c4;
    transform: translateY(-50%) scale(0.8);
  }
`;


interface IProps {
  isOpened: boolean
  title: string
  onHideModal: () => void
  targetActionLabel: string
  onClickTargetAction: () => void
  photos: string[]
  description?: string
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
interface IArrProps {
  right?: boolean
  left?: boolean
}
const Arr = styled('div')<IArrProps>`
  ${({ right }) => right && css`
    @media(max-width: 767px) {
      padding-left: 10px;
    }
    @media(min-width: 768px) {
      padding-left: 15px;
    }
  `}
  ${({ left }) => left && css`
    @media(max-width: 767px) {
      padding-right: 10px;
    }
    @media(min-width: 768px) {
      padding-right: 15px;
    }
  `}
  
  /* @media(min-width: 768px) {
    padding: 0;
  } */

  display: flex;
  justify-content: center;
  align-items: center;
`
const Circle = styled('div')`
  cursor: pointer;
  width: 30px;
  height: 30px;
  background-color: lightgray;
  &:hover {
    background-color: gray;
  }
  border-radius: 50%;
  & > i {
    color: #fff;
  }
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const Body = ({ photos }) => {
  const galleryRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_activeGalleryIndex, setActiveGalleryIndex] = useStateWithCallback(
    0,
    (currentIndex: number) => {
      if (!!galleryRef?.current) {
        // @ts-ignore
        galleryRef?.current.slideToIndex(currentIndex);
      }
    }
  );
  const activeGalleryIndexInc = () => {
    setActiveGalleryIndex((i: number) =>
      i < photos.length - 1 ? i + 1 : 0
    );
  };
  const activeGalleryIndexDec = () => {
    setActiveGalleryIndex((i: number) =>
      i > 0 ? i - 1 : photos.length - 1
    );
  };

  return (
    <Wrapper>
      <Arr left><Circle onClick={activeGalleryIndexDec}><i className="fas fa-arrow-left" /></Circle></Arr>
      {/* JSON.stringify(photos) */}
      <BodySection>
        <ImageGallery
          ref={galleryRef}
          showFullscreenButton={false}
          showPlayButton={false}
          items={photos}
          showThumbnails={false}
          showNav={false}
        />
      </BodySection>
      <Arr right><Circle onClick={activeGalleryIndexInc}><i className="fas fa-arrow-right" /></Circle></Arr>
    </Wrapper>
  )
}

export const Modal = ({ isOpened, title, onHideModal, onClickTargetAction, targetActionLabel, photos, description }: IProps) => {
  return (
    <>
      {isOpened && (
        <UiModal
          size="large"
          modalTitle={title}
          // modalSubtitle="process.env"
          closeModal={onHideModal}
          renderBodyContent={() => (
            <div>
              <Body photos={photos} />
              {
                description && (
                  <div style={{ marginTop: '30px' }}>
                    {description}
                  </div>
                )
              }
            </div>
          )}
          renderFooterContent={() => (
            <FooterRow>
              <Button typeName="secondary" size="small" width="medium" onClick={onClickTargetAction}>
                {targetActionLabel}
              </Button>
            </FooterRow>
          )}
        />
      )}
    </>
  )
}
