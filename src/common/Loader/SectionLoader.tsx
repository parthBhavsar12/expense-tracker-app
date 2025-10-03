export const SectionLoader = ({
  className,
  size = 'h-16 w-16'
}: {
  className?: string;
  size?: string;
}) => {
  return (
    <div
      className={`absolute inset-0 bg-white/50 backdrop-blur-sm z-[9] flex items-center justify-center ${className}`}>
      <span
        className={`relative border-[5px] border-[#e0e0e0] border-b-[var(--d-blue)] rounded-full block animate-spin ${size}`}
      />
    </div>
  );
};

export default SectionLoader;