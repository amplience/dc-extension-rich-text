import React, { PropsWithChildren } from "react";

import { withStyles, WithStyles } from "@material-ui/core";
import clsx from "clsx";

const styles = {
  root: {
    display: "block",
    width: "100%",
    minHeight: 150,
    margin: "0 10px 10px 0",
    position: "relative" as "relative"
  },

  content: {
  },

  "empty-slot": {},
  "populated-slot": {}
};

export type InlineChooserVariant = "empty-slot" | "populated-slot";

export interface InlineChooserProps
  extends PropsWithChildren<WithStyles<typeof styles>> {
  variant?: InlineChooserVariant;
  style?: React.CSSProperties;
  className?: string;
  aspectRatio?: string;
}

const InlineChooser: React.SFC<InlineChooserProps> = (props: InlineChooserProps) => {
  const { classes, children, className, variant = "empty", aspectRatio, ...other } = props;

  const aspectRatioPaddingTop: string | undefined = React.useMemo(() => {
    if (!aspectRatio) {
      return undefined;
    }

    const components = aspectRatio.split(':');
    if (components.length !== 2) {
      return undefined;
    }

    return Math.round(Number(components[1]) / Number(components[0])*100) + '%';
  }, [aspectRatio]);

  return (
    <div
      {...other}
      className={clsx(
        classes.root,
        {
          [classes["empty-slot"]]: variant === "empty-slot",
          [classes["populated-slot"]]: variant === "populated-slot"
        },
        className
      )}
    >
      {
        aspectRatio ? (
          <>
            <div style={{display: 'block', paddingTop: aspectRatioPaddingTop}}>&nbsp;</div>
            <div className={clsx(classes.content)}>{children}</div>
          </>
        ) : (
          <div className={clsx(classes.content)}>{children}</div>
        )
      }
      
    </div>
  );
};

export default withStyles(styles)(InlineChooser);
