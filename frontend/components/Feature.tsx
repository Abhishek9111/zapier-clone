export const Feature = ({
  title,
  subTitle,
}: {
  title: String;
  subTitle: String;
}) => {
  return (
    <div className="flex">
      <Check />
      <div className="flex flex-col justify-center">
        <div className="flex">
          <div className="pl-2 font-bold text-sm">{title}&nbsp;</div>
          <div className="text-sm">{subTitle}</div>
        </div>
      </div>
    </div>
  );
};

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}
