interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function Heading({ title, subtitle, center }: HeadingProps) {
  return (
    <div className={`${center ? 'text-center' : 'text-start'}`}>
      <div className="text-2xl font-bold">{title}</div>
      <div className="mt-2 font-light text-neutral-500">{subtitle}</div>
    </div>
  );
  // return (
  //   <div className="mb-6 flex items-center justify-between space-y-2">
  //     <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
  //     <div className="flex items-center space-x-2"></div>
  //   </div>
  // );
}
