import YouTubeVideo from 'react-youtube'
// import { useStyles } from './styles'
import styled from 'styled-components'

const ExternalWrapper = styled('div')`
  width: 100%;
  margin: 0 auto;
  @media(min-width: 768px) {
    max-width: 400px;
  }
  margin-bottom: 20px;
`
const ReactYoutubeContainer = styled('div')`
  position: relative;
  padding-bottom: 56.25%; // 16:9
  height: 0;
  overflow: hidden;
  background-color: #000;
  border-radius: 4px;
  @media(max-width: 767px) {
    margin-bottom: 25px;
  }
  @media(min-width: 768px) {
    margin-bottom: 40px;
  }

  & .react-youtube {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  & frame {
    width: 100%;
    height: 100%;
  }
`

interface IProps {
  id?: string
  videoId: string
}

export const YoutubePlayer = ({ videoId }: IProps) => {
  return (
    <>
      {!{ videoId } ? (
        <div>Incorrect props: videoId required!</div>
      ) : (
        <ExternalWrapper>
          <ReactYoutubeContainer>
            <YouTubeVideo videoId={videoId} className='react-youtube' />
          </ReactYoutubeContainer>
        </ExternalWrapper>
      )}
    </>
  )
}