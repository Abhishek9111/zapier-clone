"use client";
export const Input = ({
  label,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  onChange: (e: any) => void;
  type?: "text" | "password";
}) => {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      <input
        className="border rounded px-4 w-full border-black py-2"
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};
