import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface WhitelistContextProps {
  whitelist: string[];
  blacklist: string[];
}

const defaultContext: WhitelistContextProps = {
  whitelist: [],
  blacklist: [],
};

export const WhitelistContext = createContext<WhitelistContextProps>(defaultContext);

const fetchSheet = (list: "white" | "black") =>
  fetch(`/api/sheet?list=${list}`, {
    headers: { "Content-Type": "application/json" },
  });

export const WhitelistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [whitelist, setWhitelist] = useState(defaultContext.whitelist);
  const [blacklist, setBlacklist] = useState(defaultContext.blacklist);

  const fetchWhitelist = async () => {
    const response = await fetchSheet("white");
    const result = await response.json();
    setWhitelist(result.wallets);
  };

  const fetchBlacklist = async () => {
    const response = await fetchSheet("black");
    const result = await response.json();
    setBlacklist(result.wallets);
  };

  useEffect(() => {
    fetchWhitelist();
    fetchBlacklist();
  }, []);

  return (
    <WhitelistContext.Provider
      value={{
        whitelist,
        blacklist,
      }}
    >
      {children}
    </WhitelistContext.Provider>
  );
};

export const useWhitelist = (): WhitelistContextProps => {
  const context = useContext(WhitelistContext);
  if (context === undefined) {
    throw new Error("useWhitelist must be used within a WhitelistProvider");
  }
  return context;
};
