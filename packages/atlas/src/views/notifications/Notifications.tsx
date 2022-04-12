import React from 'react'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionClose, SvgActionRead, SvgActionUnread } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNotifications } from '@/providers/notifications'
import { formatNumberShort } from '@/utils/number'

import { useSelectedNotifications } from './Notifications.hooks'
import {
  FloatingActionBar,
  Header,
  MarkAllReadWrapper,
  NotificationEmptyRectangle,
  NotificationEmptyRectangleWithText,
  StyledLayoutGrid,
  StyledNotificationTile,
  StyledPill,
} from './Notifications.styles'

export const Notifications = () => {
  const { selectedNotifications, setNotificationSelected, selectAllNotifications, unselectAllNotifications } =
    useSelectedNotifications()
  const smMatch = useMediaMatch('sm')

  const { notifications, markNotificationsAsRead, markNotificationsAsUnread } = useNotifications()

  const unreadNumber = notifications.filter((notification) => !notification.read).length
  const hasSelectedSomeUnreadNotifications = selectedNotifications.some((notification) => !notification.read)

  const closeButtonNode = (
    <Button variant="tertiary" size="large" onClick={unselectAllNotifications} iconOnly icon={<SvgActionClose />} />
  )

  const markAllAsRead = () => markNotificationsAsRead(notifications)
  const markSelectedAsRead = () => markNotificationsAsRead(selectedNotifications)
  const markSelectedAsUnread = () => markNotificationsAsUnread(selectedNotifications)
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <Text variant={smMatch ? 'h700' : 'h600'}>Notifications</Text>
          {!!unreadNumber && (
            <>
              <StyledPill label={`${unreadNumber} unread`} />
              <MarkAllReadWrapper>
                <Button variant="secondary" size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </MarkAllReadWrapper>
            </>
          )}
        </Header>

        <div>
          {notifications.length > 0 ? (
            notifications.map((notification, idx) => (
              <StyledNotificationTile
                key={`notification-${notification.id}-${idx}`}
                notification={notification}
                selected={!!selectedNotifications.find((notif) => notif.id === notification.id)}
                onCheckboxChange={(selected) => setNotificationSelected(notification, selected)}
                onClick={() => markNotificationsAsRead(notification)}
              />
            ))
          ) : (
            <NotificationsEmptyFallback />
          )}
        </div>
      </GridItem>

      {selectedNotifications.length > 0 && (
        <FloatingActionBar>
          <Text variant="t300" secondary margin={{ right: smMatch ? 8 : undefined, left: !smMatch ? 4 : undefined }}>
            {formatNumberShort(selectedNotifications.length)} item(s) selected
          </Text>
          {!smMatch && closeButtonNode}
          <Button size="large" variant="tertiary" onClick={() => selectAllNotifications(notifications)}>
            Select all
          </Button>
          <Button
            size="large"
            icon={smMatch ? hasSelectedSomeUnreadNotifications ? <SvgActionUnread /> : <SvgActionRead /> : undefined}
            variant="tertiary"
            onClick={() => {
              hasSelectedSomeUnreadNotifications ? markSelectedAsRead() : markSelectedAsUnread()
              unselectAllNotifications()
            }}
          >
            Mark as {hasSelectedSomeUnreadNotifications ? 'read' : 'unread'}
          </Button>
          {smMatch && closeButtonNode}
        </FloatingActionBar>
      )}
    </StyledLayoutGrid>
  )
}

const NotificationsEmptyFallback = () => {
  return (
    <>
      <NotificationEmptyRectangle />
      <NotificationEmptyRectangle opacity={0.8} />
      <NotificationEmptyRectangleWithText>
        <NotificationEmptyRectangle opacity={0.5} absolute />
        <Text variant="h500" secondary>
          You don’t have any notifications
        </Text>
      </NotificationEmptyRectangleWithText>
      <NotificationEmptyRectangle opacity={0.3} />
      <NotificationEmptyRectangle opacity={0.1} />
    </>
  )
}
