type Props = {
  name: string;
  image?: string;
  className?: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80";

export default function IngredientMedia({ name, image, className = "h-32 w-full" }: Props) {
  return (
    <div className={`${className} relative overflow-hidden rounded-xl border border-warm-border/60 bg-white`}>
      <img src={image || fallbackImage} alt={`${name}图片`} className="h-full w-full object-cover" />
      {/* Unify visual tone: clean, light, ingredient-card feeling */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/22" />
    </div>
  );
}

