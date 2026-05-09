interface Props {
  title: string;
  subtitle: string;
}

export const AdminTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground">
        {subtitle}
      </p>
    </div>
  )
}
