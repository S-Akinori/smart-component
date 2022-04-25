interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Container = ({children, className, style}: Props) => {
  return (
    <div className={`container px-4 mx-auto ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Container