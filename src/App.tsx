import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AnalyticsManager } from '@/AnalyticsManager'
import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { GlobalStyles } from '@/styles'

import { MainLayout } from './MainLayout'
import { CreateMemberModal } from './components/_auth/CreateMemberModal'
import { SignInStepsStepper } from './components/_auth/SignInSteps'
import { AssetsManager } from './providers/assets'
import { JoystreamProvider } from './providers/joystream'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
import { StorageProvidersProvider } from './providers/storageProviders'
import { ActiveUserProvider } from './providers/user'

export const App = () => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <AnalyticsManager />
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <OverlayManagerProvider>
            <ActiveUserProvider>
              <JoystreamProvider>
                <StorageProvidersProvider>
                  <ConfirmationModalProvider>
                    <MainLayout />
                    <Snackbars />
                    <AssetsManager />
                    <SignInStepsStepper />
                    <CreateMemberModal />
                  </ConfirmationModalProvider>
                </StorageProvidersProvider>
              </JoystreamProvider>
            </ActiveUserProvider>
          </OverlayManagerProvider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}
