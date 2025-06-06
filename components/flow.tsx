export const Flow = (props: { flow: string; height?: number }) => {
  const baseUrl = process.env.NEXT_PUBLIC_FLOWS_PREVIEW_URL;

  if (!baseUrl) {
    return null;
  }

  return (
    <iframe
      src={`${baseUrl}/${props.flow}?transparent=true`}
      allowTransparency={true}
      style={{ width: "calc(100% + 16px)", height: props.height || 500, margin: "0 -8px" }}
    />
  );
};
