import {css} from 'styled-components'

export const tooltipGlobalStyle = css`
  .rc-tooltip.rc-tooltip-zoom-appear,
  .rc-tooltip.rc-tooltip-zoom-enter {
    opacity: 0;
  }
  .rc-tooltip.rc-tooltip-zoom-enter,
  .rc-tooltip.rc-tooltip-zoom-leave {
    display: block;
  }
  .rc-tooltip-zoom-enter,
  .rc-tooltip-zoom-appear {
    opacity: 0;
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
    animation-play-state: paused;
  }
  .rc-tooltip-zoom-leave {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);
    animation-play-state: paused;
  }
  .rc-tooltip-zoom-enter.rc-tooltip-zoom-enter-active,
  .rc-tooltip-zoom-appear.rc-tooltip-zoom-appear-active {
    animation-name: rcToolTipZoomIn;
    animation-play-state: running;
  }
  .rc-tooltip-zoom-leave.rc-tooltip-zoom-leave-active {
    animation-name: rcToolTipZoomOut;
    animation-play-state: running;
  }
  @keyframes rcToolTipZoomIn {
    0% {
      opacity: 0;
      transform-origin: 50% 50%;
      transform: scale(0, 0);
    }
    100% {
      opacity: 1;
      transform-origin: 50% 50%;
      transform: scale(1, 1);
    }
  }
  @keyframes rcToolTipZoomOut {
    0% {
      opacity: 1;
      transform-origin: 50% 50%;
      transform: scale(1, 1);
    }
    100% {
      opacity: 0;
      transform-origin: 50% 50%;
      transform: scale(0, 0);
    }
  }
  .rc-tooltip {
    position: absolute;
    z-index: 1070;
    display: block;
    visibility: visible;
  }
  .rc-tooltip-hidden {
    display: none;
  }
  .rc-tooltip-inner {
    margin: 0 0 5px -1px;
    padding: 8px 10px;
    color: #000000;
    text-decoration: none;
    background-color: #ffffff;

    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;

    border: 1px solid #000000;
    box-sizing: border-box;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
  }
`
