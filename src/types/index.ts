export type NavKey = "home" | "nutrition" | "news" | "knowledge" | "contact" | "profile";
export type ChronicType =
  | "高血压"
  | "高血糖 / 糖尿病风险"
  | "高尿酸 / 痛风"
  | "高血脂 / 血脂异常"
  | "脂肪肝"
  | "体重管理 / 肥胖风险"
  | "其他";

export type Profile = {
  id: string;
  name: string;
  gender: "男" | "女" | "其他";
  age: number;
  chronicType: ChronicType;
  coreMetric: string;
  focusArea: string;
  goal: string;
  statusTags: string[];
  checkupAlert: "none" | "mild" | "followup";
  updatedAt: string;
};

export type PlanCard = {
  key: NavKey;
  title: string;
  todayFocus: string;
  summary: string;
  status: "待开始" | "进行中" | "已完成";
};

export type DiseaseTag =
  | "lowSalt"
  | "lowOil"
  | "lowSugar"
  | "lowPurine"
  | "lowFat"
  | "weightControl";

export type DishMealType = "breakfast" | "lunch" | "dinner";
export type DishDifficulty = "easy" | "medium" | "hard";

export type Dish = {
  id: string;
  dishName: string;
  dishSubtitle: string;
  mealType: DishMealType;
  diseaseTags: DiseaseTag[];
  ingredients: string[];
  difficulty: DishDifficulty;
  salt: string;
  oil: string;
  image?: string;
  imageConfidence?: number;
};

export type MealPlan = {
  dishId: string;
  // `alternatives` 的顺序决定“换一道菜/我不爱吃/更简单”的选择逻辑
  // 约定：alternatives[0] 恒等于当前 dishId
  alternatives: string[];
};

export type DayPlan = {
  day: string;
  breakfast: MealPlan;
  lunch: MealPlan;
  dinner: MealPlan;
};
