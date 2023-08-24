function PageTitle(theme) {
  const { functions } = theme;

  const { pxToRem } = functions;

  return {
    fontSize: pxToRem(30),

    fontWeight: 600,
    lineHeight: pxToRem(38),
  };
}
export function ModalTitle(theme) {
  const { functions } = theme;

  const { pxToRem } = functions;

  return {
    fontSize: pxToRem(24),

    fontWeight: 700,
  };
}
export default PageTitle;
