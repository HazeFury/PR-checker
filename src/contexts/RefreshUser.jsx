import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const RefreshUser = createContext();

export default RefreshUser;

export function RefreshUserProvider({ children }) {
  const [refreshUser, setRefreshUser] = useState(false);

  const contextUserRefresh = useMemo(() => {
    return { refreshUser, setRefreshUser };
  }, [refreshUser]);

  return (
    <RefreshUser.Provider value={contextUserRefresh}>
      {children}
    </RefreshUser.Provider>
  );
}

RefreshUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
