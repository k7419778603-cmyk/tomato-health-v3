import type { Dish } from "../types";

type Props = {
  dish: Dish;
  className?: string;
};

function DishIcon({ dish }: { dish: Dish }) {
  const name = `${dish.dishName} ${dish.ingredients.join(" ")}`;

  // Very lightweight icon mapping: prioritize trust over visual variety.
  if (/(番茄|tomato)/.test(name)) {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 4c1.2.4 2 .4 3 0s1.8-.4 3 0c2 1 3 3 3 5 0 4-3 10-7 10S5 13 5 9c0-2 1-4 4-5Z"
          stroke="#5F7363"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 4c-1.5-1.3-3-.8-4 .2" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M15 4c1.5-1.3 3-.8 4 .2" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (/(鸡蛋|蛋)/.test(name)) {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c4 0 7 4.8 7 10.2C19 18.5 16.7 21 12 21S5 18.5 5 13.2C5 7.8 8 3 12 3Z"
          stroke="#5F7363"
          strokeWidth="1.6"
        />
        <path d="M8.3 10.2c.7-2 1.9-3.4 3.7-4.2" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (/(鱼|虾)/.test(name)) {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 12c-2.2 4-6 6-10 6-2.2 0-4.2-.7-6-2l2-4-2-4c1.8-1.3 3.8-2 6-2 4 0 7.8 2 10 6Z"
          stroke="#5F7363"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 12h.01" stroke="#5F7363" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (/(豆腐)/.test(name)) {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 7c2-2 8-2 10 0v10c-2 2-8 2-10 0V7Z"
          stroke="#5F7363"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 10h6" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (/(燕麦|麦)/.test(name)) {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 14c2-6 8-6 10 0"
          stroke="#5F7363"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M8 18c1.6-3 6.4-3 8 0" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 6v2" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11Z"
        stroke="#5F7363"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 14c1.2-1 2.3-1.4 4-1.6" stroke="#5F7363" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function DishMedia({ dish, className = "h-24 w-full" }: Props) {
  const showPhoto = Boolean(dish.image) && (dish.imageConfidence ?? 0) >= 0.7;

  if (showPhoto) {
    return <img src={dish.image} alt={dish.dishName} className={`${className} rounded-lg object-cover`} />;
  }

  const gradient =
    dish.mealType === "breakfast"
      ? "from-amber-100/70 to-white"
      : dish.mealType === "lunch"
        ? "from-leaf-100/70 to-white"
        : "from-tomato-100/70 to-white";

  return (
    <div className={`${className} relative overflow-hidden rounded-lg bg-white`} aria-label={`${dish.dishName} 媒体占位`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative flex h-full w-full items-center justify-center">
        <DishIcon dish={dish} />
      </div>
    </div>
  );
}

