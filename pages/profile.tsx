import React from 'react'
import { privateRouteHOC } from '@/helpers/services/hoc/privateRouteHOC'
import { Layout } from '@/components/layout'
import { ProfilePage } from '@/components/ProfilePage'

function Page(): React.ReactNode {
  return (
    <Layout>
      <ProfilePage />
    </Layout>
  )
}

export default privateRouteHOC(Page)
