import { AlertSeverity } from "@dc-extension-rich-text/common";
import {
  darken,
  IconButton,
  lighten,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

const styles = (theme: Theme) => ({
  root: {
    ...theme.typography.body2,
    display: "flex",
    flexDirection: "row" as "row",
    maxWidth: 300,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "transparent",
    padding: "6px 16px"
  },

  success: {
    color: darken(theme.palette.success.main, 0.6),
    backgroundColor: lighten(theme.palette.success.main, 0.9),
    "& $icon": {
      color: theme.palette.success.main
    }
  },

  info: {
    color: darken(theme.palette.info.main, 0.6),
    backgroundColor: lighten(theme.palette.info.main, 0.9),
    "& $icon": {
      color: theme.palette.info.main
    }
  },

  warning: {
    color: darken(theme.palette.warning.main, 0.6),
    backgroundColor: lighten(theme.palette.warning.main, 0.9),
    "& $icon": {
      color: theme.palette.warning.main
    }
  },

  error: {
    color: darken(theme.palette.error.main, 0.6),
    backgroundColor: lighten(theme.palette.error.main, 0.9),
    "& $icon": {
      color: theme.palette.error.main
    }
  },

  title: {
    fontWeight: theme.typography.fontWeightMedium
  },

  header: {
    display: "flex",
    flexDirection: "row" as "row"
  },

  content: {
    padding: "8px 0"
  },

  icon: {
    marginRight: 12,
    padding: "7px 0",
    display: "flex",
    fontSize: 22,
    opacity: 0.9
  },

  action: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: 16,
    marginRight: -8
  }
});

export interface RichTextAlertProps
  extends PropsWithChildren<WithStyles<typeof styles>> {
  severity: AlertSeverity;
  title: string;
  icon?: React.ReactElement;
  onClose?: () => void;
}

const RichTextAlert = (props: RichTextAlertProps) => {
  const { classes, children, severity, title, icon, onClose } = props;

  return (
    <div
      className={clsx(
        classes.root,
        {
          info: classes.info,
          success: classes.success,
          error: classes.error,
          warning: classes.warning
        }[severity]
      )}
    >
      <div className={classes.icon}>{icon}</div>
      <div className={classes.content}>
        <div className={classes.header}>
          <Typography variant="body1" className={classes.title}>
            {title}
          </Typography>
        </div>
        {children}
      </div>
      <div className={classes.action}>
        <IconButton onClick={onClose} size="small" color="inherit">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default withStyles(styles)(RichTextAlert);
