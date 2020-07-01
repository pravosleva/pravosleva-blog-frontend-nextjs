import { connect } from 'react-redux'
import { compose, withPropsOnChange } from 'recompose'

const mapStateToProps = ({ common }) => ({ screenType: common.screenType })

export const withScreenType = compose(
  connect(mapStateToProps),
  withPropsOnChange(['screenType'], ({ screenType }) => ({
    isMobile: screenType === 'mobile',
  }))
)
