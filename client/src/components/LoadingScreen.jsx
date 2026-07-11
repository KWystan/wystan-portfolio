import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Noise from './Noise';

export default function LoadingScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 400);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <StyledWrapper className={fadeOut ? 'fade-out' : ''}>
      <div className="noise-overlay">
        <Noise patternAlpha={12} />
      </div>
      <div className="inner">
        <svg className="heart" viewBox="-5 -5 278 56" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <filter id="blur">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <g transform="translate(29.1 -127.42)">
            <path
              pathLength={1}
              d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36"
              id="line"
            />
          </g>
          <g transform="translate(29.1 -127.42)">
            <path
              pathLength={1}
              d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36"
              id="point"
              filter="url(#blur)"
            />
          </g>
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  transition: opacity 0.4s ease, visibility 0.4s ease;

  &.fade-out {
    opacity: 0;
    visibility: hidden;
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .inner {
    width: min(336px, 85vw);
  }

  .heart {
    display: block;
    width: 100%;
    height: auto;
  }

  .heart #line {
    fill: none;
    stroke: #000;
    stroke-width: 1.5;
    stroke-linecap: butt;
    stroke-linejoin: round;
    stroke-miterlimit: 4;
    stroke-opacity: 0.7;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: dash 2.8s ease-in-out infinite;
  }
  .heart #point {
    fill: none;
    stroke: #000;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 0.1;
    stroke-opacity: 0.9;
    stroke-dasharray: 0.0001, 0.9999;
    stroke-dashoffset: 1;
    animation: dash 2.8s ease-in-out infinite;
  }
  @keyframes dash {
    0% {
      stroke-dashoffset: 1;
    }
    60% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
