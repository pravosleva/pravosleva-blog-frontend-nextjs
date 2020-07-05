import React from 'react'
import { privateRouteHOC } from '@/helpers/services/hoc/privateRouteHOC'
import { Layout } from '@/components/layout'
import { ProfilePage } from '@/components/ProfilePage'
import { IUserInfo } from '@/helpers/services/IUserInfo'
import { AuthToken } from '@/helpers/services/AuthToken'
import { withTranslator } from '@/hocs/with-translator'

interface IProps {
  auth: AuthToken
  userInfo: IUserInfo | null
  query: any
  t: (text: string) => string
}

function Page(props: IProps): React.ReactNode {
  return (
    <Layout>
      <ProfilePage {...props} />
    </Layout>
  )
}

export default privateRouteHOC(withTranslator(Page))
