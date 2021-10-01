import React, { useEffect, useRef, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { viewerNavItems } from '@/config/nav'
import { transitions } from '@/shared/theme'

import { Container, NavLink, NavTitle } from './BottomNav.style'

const Link: React.FC<typeof viewerNavItems[number]> = ({ to, icon, name }) => {
  const match = useMatch(to)
  return (
    <NavLink to={to} active={match}>
      {icon}
      <NavTitle variant="button3">{name}</NavTitle>
    </NavLink>
  )
}

const OPENING_MARGIN = 24

export const BottomNav = () => {
  const [open, setOpen] = useState(true)
  const pageYOffsetRef = useRef<number | null>(null)

  const toggleNavbar = () => {
    const scrollRange = pageYOffsetRef.current !== null ? window.scrollY - pageYOffsetRef.current : 0
    if (scrollRange >= OPENING_MARGIN) {
      setOpen(false)
    }
    if (scrollRange <= -OPENING_MARGIN) {
      setOpen(true)
    }
    if (Math.abs(scrollRange) >= OPENING_MARGIN || pageYOffsetRef.current === null) {
      pageYOffsetRef.current = window.scrollY
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleNavbar)

    return () => {
      window.removeEventListener('scroll', toggleNavbar)
    }
  }, [])

  return (
    <CSSTransition
      in={open}
      timeout={parseInt(transitions.timings.routing)}
      classNames="bottom-nav"
      unmountOnExit
      mountOnEnter
    >
      <Container>
        {viewerNavItems.map((item) => (
          <Link {...item} key={`bottomLink-${item.to}`} />
        ))}
      </Container>
    </CSSTransition>
  )
}
