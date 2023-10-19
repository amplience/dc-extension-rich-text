export default (outerTheme: any) => {
  const typography = { ...outerTheme.typography };
  const fontFamily = "'IBM Plex Sans', sans-serif";
  const elements = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "button",
    "caption",
    "overline",
  ];
  typography.fontFamily = fontFamily;
  elements.map((element) => {
    typography[element].fontFamily = fontFamily;
  });

  return { ...outerTheme, typography };
};
