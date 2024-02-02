"use client";

import { decode } from "blurhash";
import { animated, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";

export type BlurImage = {
  url: string;
  hash: string;
  width: number;
  height: number;
};

export type SlideImageProps = {
  style?: React.CSSProperties;
  images?: [];
};

const images: BlurImage[] = [
  {
    url: "https://images.unsplash.com/photo-1614079878578-1301ea379ac7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NTk5MTR8MHwxfHNlYXJjaHwxfHxjYXR8ZW58MHwxfHxncmVlbnwxNzA2NTMwOTUxfDA&ixlib=rb-4.0.3&q=85",
    hash: "LTHBYr_2E1M{E19Gxat7~q%2RjRj",
    width: 4000,
    height: 6000,
  },
];

export function SlideImage(props: SlideImageProps) {
  return (
    <div className="slide-image" style={props.style}>
      {images.map(image => (
        <TransitionImage key={image.url} {...image} />
      ))}
    </div>
  );
}

function TransitionImage({ hash, url }: BlurImage) {
  const [loading, setLoading] = useState(true);

  const imgStyle = useSpring({
    opacity: loading ? 0 : 1,
    width: "100%",
    height: "100%",
  });

  const blurStyle = useSpring({
    opacity: loading ? 1 : 0,
    width: "100%",
    height: "100%",
  });
  useEffect(() => {
    const image = new Image();
    image.src = url;

    image.onload = () => {
      setLoading(false);
    };
  }, []);

  return (
    <div style={{ height: "100%", position: "absolute", top: 0 }}>
      <animated.div style={blurStyle}>
        <BlurHash hash={hash} />
      </animated.div>

      <animated.div className="blur-image-animated" style={imgStyle}>
        {!loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `url(${url}) center center`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </animated.div>
    </div>
  );
}

function BlurHash({ hash }: { hash: string }) {
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!blurCanvasRef.current) return;

    const clientRect = blurCanvasRef.current.getBoundingClientRect();

    const pixels = decode(hash, clientRect.width, clientRect.height);
    const ctx = blurCanvasRef.current.getContext("2d")!;
    const image = ctx.createImageData(clientRect.width, clientRect.height);

    image.data.set(pixels);
    ctx.putImageData(image, 0, 0);
  }, [hash]);

  return (
    <canvas
      style={{ width: "100%", height: "100%" }}
      ref={blurCanvasRef}
    ></canvas>
  );
}
