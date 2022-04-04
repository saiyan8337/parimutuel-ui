import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface GeoContextProps {
  userGeo: { countryCode: string; countryName: string };
  isGeoBlocked: boolean;
}

const defaultContext: GeoContextProps = {
  userGeo: { countryCode: "", countryName: "" },
  isGeoBlocked: false,
};

export const GeoContext = createContext<GeoContextProps>(defaultContext);

const fetchGeo = () =>
  fetch("/api/geo", {
    headers: { "Content-Type": "application/json" },
  });

export const GeoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userGeo, setUserGeo] = useState(defaultContext.userGeo);
  const [isGeoBlocked, setIsGeoBlocked] = useState(defaultContext.isGeoBlocked);

  const fetchGeoBlock = async () => {
    const geoResponse = await fetchGeo();
    const result = await geoResponse.json();
    setUserGeo(result.geo);
    setIsGeoBlocked(result.geo.countryCode === "US");
  };

  useEffect(() => {
    fetchGeoBlock();
  }, []);

  return (
    <GeoContext.Provider
      value={{
        userGeo,
        isGeoBlocked,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = (): GeoContextProps => {
  const context = useContext(GeoContext);
  if (context === undefined) {
    throw new Error("useGeo must be used within a WhitelistProvider");
  }
  return context;
};
