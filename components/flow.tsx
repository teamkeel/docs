export const Flow = (props: { flow: string; height?: number }) => {
  return (
    <iframe
      src={`http://127.0.0.1:5173/demo/flows/${props.flow}?transparent=true`}
      allowTransparency={true}
      style={{ width: "calc(100% + 16px)", height: props.height || 500, margin: "0 -8px" }}
    />
  );
};
