import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Protected = (Component) => {
  // logic to check if user is authenticated or not
  const { isAuthenticated, isLoading, user } = useAuth0();

  const InnerComponent = (props) => {
    if (isLoading) {
      return <h1>Loading...</h1>;
    } else if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      // Optionally, you can render an unauthorized message or redirect the user to a login page
      return <h1>Unauthorized</h1>;
    }
  };

  // Optionally, you can use the useEffect hook to handle the initial loading state
  useEffect(() => {
    // Perform any actions needed while loading, if required
    // For example, you can display a loading spinner or fetch additional data
    // This effect will only run once when the component mounts
    // You can remove this useEffect block if you don't need it
  }, [isLoading]);

  return InnerComponent;
}