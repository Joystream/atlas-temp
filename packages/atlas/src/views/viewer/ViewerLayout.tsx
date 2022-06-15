import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { FC, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { Loader } from '@/components/_loaders/Loader'
import { BottomNav } from '@/components/_navigation/BottomNav'
import { PrivateRoute } from '@/components/_navigation/PrivateRoute'
import { SidenavViewer } from '@/components/_navigation/SidenavViewer'
import { TopbarViewer } from '@/components/_navigation/TopbarViewer'
import { Modal } from '@/components/_overlays/Modal'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'
import { NotificationsView } from '@/views/notifications'
import {
  CategoryView,
  ChannelView,
  ChannelsView,
  HomeView,
  MemberView,
  NewView,
  NftsView,
  PopularView,
  SearchView,
  VideoView,
} from '@/views/viewer'

import { DiscoverView } from './DiscoverView/DiscoverView'
import { EditMembershipView } from './EditMembershipView/EditMembershipView'
import { NotFoundView } from './NotFoundView'

const viewerRoutes = [
  { path: relativeRoutes.viewer.search(), element: <SearchView /> },
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.popular(), element: <PopularView /> },
  { path: relativeRoutes.viewer.new(), element: <NewView /> },
  { path: relativeRoutes.viewer.discover(), element: <DiscoverView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
  { path: relativeRoutes.viewer.category(), element: <CategoryView /> },
  { path: relativeRoutes.viewer.member(), element: <MemberView /> },
  { path: relativeRoutes.viewer.nfts(), element: <NftsView /> },
]

const ENTRY_POINT_ROUTE = absoluteRoutes.viewer.index()

export const ViewerLayout: FC = () => {
  const location = useLocation()
  const locationState = location.state as RoutingState
  const { memberId, isWalletLoading } = useUser()
  const [localIsWalletLoading, setLocalIsWalletLoading] = useState(false)

  const navigate = useNavigate()
  const mdMatch = useMediaMatch('md')
  const { searchOpen } = useSearchStore()

  const displayedLocation = locationState?.overlaidLocation || location

  // delay displaying the global loader by 500ms so the extension can be initialized if it's already connected
  useEffect(() => {
    let timeout: number
    if (isWalletLoading) {
      timeout = window.setTimeout(() => setLocalIsWalletLoading(true), 500)
    } else {
      setLocalIsWalletLoading(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isWalletLoading])

  return (
    <>
      <StyledModal show={localIsWalletLoading} noBoxShadow>
        <Loader variant="xlarge" />
      </StyledModal>
      <TopbarViewer />
      <SidenavViewer />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorBoundary}
          onReset={() => {
            navigate(absoluteRoutes.viewer.index())
          }}
        >
          <SwitchTransition>
            <CSSTransition
              timeout={parseInt(transitions.timings.routing)}
              classNames={transitions.names.fadeAndSlide}
              key={displayedLocation.pathname}
            >
              <Routes location={displayedLocation}>
                {viewerRoutes.map((route) => (
                  <Route key={route.path} {...route} />
                ))}
                <Route
                  path={relativeRoutes.viewer.editMembership()}
                  element={
                    <PrivateRoute isAuth={!!memberId} element={<EditMembershipView />} redirectTo={ENTRY_POINT_ROUTE} />
                  }
                />
                <Route
                  path={absoluteRoutes.viewer.notifications()}
                  element={
                    <PrivateRoute isAuth={!!memberId} element={<NotificationsView />} redirectTo={ENTRY_POINT_ROUTE} />
                  }
                />
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </CSSTransition>
          </SwitchTransition>
        </ErrorBoundary>
      </MainContainer>
      {!mdMatch && !searchOpen && <BottomNav />}
    </>
  )
}

const StyledModal = styled(Modal)`
  height: 100vh;
  top: unset;
  left: unset;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainContainer = styled.main`
  position: relative;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  margin-left: var(--size-sidenav-width-collapsed);
  height: 100%;
`
