import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export default UserContext;

export function UserContextProvider({ children }) {
  const [userRole, setUserRole] = useState(null);

  const memo = useMemo(() => {
    return { userRole, setUserRole };
  }, [userRole]);

  return <UserContext.Provider value={memo}>{children}</UserContext.Provider>;
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
