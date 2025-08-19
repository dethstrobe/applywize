interface Props {
  size?: number
  id: string
  className?: string
}

export const Icon = ({ className, size = 24, id }: Props) => {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`/images/icons/sprite.svg#${id}`} />
    </svg>
  )
}
