export const PropDefinition = (props: {
  data: {
    field: string;
    type?: string;
    required?: boolean;
    border?: boolean;
  };
}) => {
  return (
    <div className="nx-mt-4 prop" key={props.data.field}>
      {props.data.border != false && <hr className="nx-mb-4" />}
      <div className="nx-leading-7 nx-font-bold">
        {props.data.field}
        {props.data.required && (
          <span className="nx-text-gray-400 nx-ml-1 nx-font-semibold">*</span>
        )}
      </div>
      {props.data.type && (
        <code className="nx-leading-7 nx-text-gray-500 nx-text-[.9em]">{props.data.type}</code>
      )}
    </div>
  );
};
