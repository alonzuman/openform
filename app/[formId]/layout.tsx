import React, { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="h-[100dvh] snap-y snap-mandatory overflow-y-hidden">
      {props.children}
    </div>
  );
}
