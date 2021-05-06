import React, { useCallback, useEffect, useState } from 'react'
import { Account, JoystreamJs } from '@/joystream-lib'
import { useUser } from '@/hooks'
import useConnectionStatus from '../useConnectionStatus'
import { NODE_URL, WEB3_APP_NAME } from '@/config/urls'

type JoystreamContextValue = {
  joystream: JoystreamJs | null
  accounts: Account[]
  extensionConnected: boolean | null
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId } = useUser()
  const { setNodeConnection } = useConnectionStatus()

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountsSet, setAccountsSet] = useState(false)
  const [extensionConnected, setExtensionConnected] = useState<boolean | null>(null)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )

  const handleAccountsUpdate = useCallback((accounts: Account[]) => {
    setAccounts(accounts)
    setAccountsSet(true)
  }, [])

  const handleExtensionConnectedUpdate = useCallback((connected: boolean) => {
    setExtensionConnected(connected)
  }, [])

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamJs(NODE_URL, WEB3_APP_NAME)
        setJoystream(joystream)

        setAccounts(joystream.accounts)
        joystream.onAccountsUpdate = handleAccountsUpdate
        joystream.onExtensionConnectedUpdate = handleExtensionConnectedUpdate
        joystream.onNodeConnectionUpdate = handleNodeConnectionUpdate
      } catch (e) {
        handleNodeConnectionUpdate(false)
        console.error('Failed to create JoystreamJs instance', e)
      }
    }

    init()

    return () => {
      joystream?.destroy()
    }
  }, [handleAccountsUpdate, handleExtensionConnectedUpdate, handleNodeConnectionUpdate, setNodeConnection])

  useEffect(() => {
    if (!joystream || !activeAccountId || !accountsSet) {
      return
    }

    if (joystream.selectedAccountId === activeAccountId) {
      return
    }

    joystream.setAccount(activeAccountId)
  }, [joystream, activeAccountId, accountsSet])

  return (
    <JoystreamContext.Provider value={{ accounts, joystream, extensionConnected }}>
      {children}
    </JoystreamContext.Provider>
  )
}
