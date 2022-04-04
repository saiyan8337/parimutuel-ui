import Crypto01 from "@public/images/btc.svg";
import Crypto02 from "@public/images/btch.svg";
import Crypto03 from "@public/images/chain.svg";
import Crypto04 from "@public/images/usd.svg";
import Crypto05 from "@public/images/usdc.svg";
import Crypto06 from "@public/images/usdt.svg";
import Crypto07 from "@public/images/bnb.svg";
import Crypto08 from "@public/images/eth.svg";
import Crypto09 from "@public/images/fil.svg";
import Crypto10 from "@public/images/btc.svg";
import Crypto11 from "@public/images/usd.svg";
import Crypto12 from "@public/images/btc.svg";
import Crypto13 from "@public/images/chain.svg";
import Crypto14 from "@public/images/usdt.svg";
import Crypto15 from "@public/images/eth.svg";
import Crypto16 from "@public/images/btc.svg";

export default {
  particles: {
    number: {
      value: 0,
    },
    shape: {
      type: "image",
      options: {
        image: [
          {
            src: Crypto01,
            width: 15,
            height: 15,
          },
          {
            src: Crypto02,
            width: 15,
            height: 15,
          },
          {
            src: Crypto03,
            width: 15,
            height: 15,
          },
          {
            src: Crypto04,
            width: 15,
            height: 15,
          },
          {
            src: Crypto05,
            width: 15,
            height: 15,
          },
          {
            src: Crypto06,
            width: 15,
            height: 15,
          },
          {
            src: Crypto07,
            width: 15,
            height: 15,
          },
          {
            src: Crypto08,
            width: 15,
            height: 15,
          },
          {
            src: Crypto09,
            width: 15,
            height: 15,
          },
          {
            src: Crypto10,
            width: 15,
            height: 15,
          },
          {
            src: Crypto11,
            width: 15,
            height: 15,
          },
          {
            src: Crypto12,
            width: 15,
            height: 15,
          },
          {
            src: Crypto13,
            width: 15,
            height: 15,
          },
          {
            src: Crypto14,
            width: 15,
            height: 15,
          },
          {
            src: Crypto15,
            width: 15,
            height: 15,
          },
          {
            src: Crypto16,
            width: 15,
            height: 15,
          },
        ],
      },
    },
    opacity: {
      value: 1,
      animation: {
        enable: true,
        minimumValue: 0,
        speed: 2,
        startValue: "max",
        destroy: "min",
      },
    },
    size: {
      value: 20,
      random: {
        enable: true,
        minimumValue: 3,
      },
    },
    links: {
      enable: false,
    },
    life: {
      duration: {
        sync: true,
        value: 5,
      },
      count: 1,
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: 10,
      },
      speed: 20,
      decay: 0.03,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "destroy",
        top: "none",
      },
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      resize: true,
    },
  },
  detectRetina: true,
  background: {
    color: "transparent",
  },
  emitters: {
    direction: "none",
    life: {
      count: 6,
      duration: 0.1,
      delay: 0.4,
    },
    rate: {
      delay: 0.1,
      quantity: 100,
    },
    size: {
      width: 0,
      height: 0,
    },
  },
};
