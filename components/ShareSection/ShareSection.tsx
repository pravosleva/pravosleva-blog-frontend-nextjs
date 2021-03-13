import styled, { css } from 'styled-components'
import {
  // EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  // LivejournalShareButton,
  // MailruShareButton,
  // OKShareButton,
  // PinterestShareButton,
  // PocketShareButton,
  // RedditShareButton,
  TelegramShareButton,
  TelegramIcon,
  // TumblrShareButton,
  TwitterShareButton,
  TwitterIcon,
  // ViberShareButton,
  VKShareButton,
  VKIcon,
  WhatsappShareButton,
  WhatsappIcon,
  // WorkplaceShareButton
} from "react-share";

interface IWrapperProps {
  bgSrc: string
}

const Wrapper = styled('div')<IWrapperProps>`
  @media(min-width: 768px) {
    margin-bottom: 35px;

    border-radius: 10px;
    & .article-wrapper, & .article-wrapper:after {
      border-radius: 10px;
    }
  }
  @media(max-width: 767px) {
    margin-bottom: 30px;
  }
  ${({ bgSrc }) => bgSrc && css`
    & > .article-wrapper {
      padding-top: 25px;
      width: 100%;
      // background: linear-gradient(rgba(255, 255, 255, 0.65), transparent);
      background: linear-gradient(110deg, rgba(0, 0, 0, .1) 60%, rgba(255, 255, 255, .4) 60%);
      display: block;
      position: relative;
    }
    & > .article-wrapper::after {
      content: '';
      background: url(${bgSrc});
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      filter: grayscale(1) opacity(80%);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
      // opacity: 0.8;
    }
    & > .article-wrapper__big-image-as-container {
      width: 100%;
      min-height: 250px;
      margin: 10px 0 50px 0;

      display: flex;
      flex-direction: column;

      @media(min-width: 768px) {
        justify-content: space-between;
      }
      @media(max-width: 767px) {
        justify-content: space-evenly;
      }
    }
  `}
`

interface IProps {
  bgSrc: string
  slug: string
  title: string
}

export const ShareSection = ({ bgSrc, slug, title }: IProps) => {
  // console.log(bgSrc)
  return (
    <Wrapper bgSrc={bgSrc}>
      <div className='article-wrapper white tiles-grid-item-in-article'>
        <div className='btns-wrapper'>
          <FacebookShareButton quote={title} url={`http://pravosleva.ru/article/${slug}`}>
            <FacebookIcon
              bgStyle={{
                boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
              }}
              size={32}
              round
              className='custom-share-btn'
            />
          </FacebookShareButton>
          <VKShareButton title={title} image={bgSrc} url={`https://pravosleva.ru/article/${slug}`}>
            <VKIcon size={32} round className='custom-share-btn' />
          </VKShareButton>
          <LinkedinShareButton url={`https://pravosleva.ru/article/${slug}`}>
            <LinkedinIcon size={32} round className='custom-share-btn' />
          </LinkedinShareButton>
          <TelegramShareButton url={`https://pravosleva.ru/article/${slug}`}>
            <TelegramIcon size={32} round className='custom-share-btn' />
          </TelegramShareButton>
          <TwitterShareButton url={`https://pravosleva.ru/article/${slug}`}>
            <TwitterIcon size={32} round className='custom-share-btn' />
          </TwitterShareButton>
          <WhatsappShareButton url={`https://pravosleva.ru/article/${slug}`}>
            <WhatsappIcon size={32} round className='custom-share-btn' />
          </WhatsappShareButton>
        </div>
      </div>
      <style jsx>{`
        .btns-wrapper {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: space-evenly;
        }
        .btns-wrapper > .custom-share-btn:not(:last-child) {
          margin-right: 10px;
        }
      `}</style>
    </Wrapper>
  )
}
