import styled, { css } from 'styled-components'

interface IProps {
  bgSrc: string
}

const Wrapper = styled('div')<IProps>`
  margin-bottom: 30px;
  ${({ bgSrc }) => bgSrc && css`
    & > .article-wrapper {
      width: 100%;
      background: linear-gradient(rgba(255, 255, 255, 0.65), transparent);
      display: block;
      position: relative;
    }
    & > .article-wrapper::after {
      content: '';
      background: url(${bgSrc});
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      filter: grayscale(1);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
    }
    & > .article-wrapper__big-image-as-container {
      border-radius: 0;
      width: 100%;
      min-height: 250px;
      margin: 10px 0 50px 0;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `}
`

export const ShareSection = ({ bgSrc }: IProps) => {
  console.log(bgSrc)
  return (
    <Wrapper bgSrc={bgSrc}>
      <div className='article-wrapper white tiles-grid-item-in-article'>
        ShareSection
      </div>
    </Wrapper>
  )
}