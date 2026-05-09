import { Link } from "react-router"

interface Props {
  to?: string;
  subtitle?: string;
}

export const CustomLogo = ({ to = '/', subtitle = 'Market' }: Props) => {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <img src="/logo.png" alt="logo" className="h-10 w-10" />
      <div className="hidden sm:block">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          The LoreVault
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-1 font-cinzel">
          {subtitle}
        </p>
      </div>
    </Link>
  )
}
