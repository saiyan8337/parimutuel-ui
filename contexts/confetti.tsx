import React, { useCallback, useContext, useState } from "react";
import Particles, { Container, Main } from "react-tsparticles";

import config from "@constants/animation";

type ConfettiContextProps = {
  showConfetti: () => void;
  removeConfetti: () => void;
};

const defaultContext: ConfettiContextProps = {
  showConfetti: () => null,
  removeConfetti: () => null,
};

export const ConfettiContext = React.createContext<ConfettiContextProps>(defaultContext);

export const ConfettiProvider: React.FC = ({ children }) => {
  const [isShow, setIsShow] = useState(false);

  const showConfetti = useCallback(() => {
    setIsShow(true);
    setTimeout(() => {
      setIsShow(false);
    }, 5000);
  }, []);

  const removeConfetti = useCallback(() => {
    setIsShow(false);
  }, []);

  const options: any = { ...config, autoPlay: true }; // eslint-disable-line

  const particlesInit = (main: Main) => {
    console.log(main);
  };
  const particlesLoaded = (container: Container) => {
    console.log("container", container);
  };

  const style = {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 99999,
    pointerEvents: "none",
  } as any; // eslint-disable-line

  return (
    <ConfettiContext.Provider
      value={{
        showConfetti,
        removeConfetti,
      }}
    >
      {children}
      {isShow && (
        <Particles
          style={style}
          init={particlesInit}
          loaded={particlesLoaded}
          options={{ ...options }}
        />
      )}
    </ConfettiContext.Provider>
  );
};

export const useConfetti = (): ConfettiContextProps => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error("useConfetti must be used within a ConfettiProvider");
  }
  return context;
};
