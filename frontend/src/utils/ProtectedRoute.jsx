import { React, useContext } from "react"
import { Navigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"

/** A higher-order component with conditional routing logic */
export function withCondition(
  Component,
  condition,
  redirectTo
) {
  return function InnerComponent(props) {
    return condition ? <Component {...props} /> : <Navigate to={redirectTo} replace />
  }
}

/** A more specific variation */
export const withLoggedIn = (Component) => {
  const {
    isAuthenticated,
  } = useAuth0();

  return (withCondition(
    Component,
    true,
    '/login'
  ))
}