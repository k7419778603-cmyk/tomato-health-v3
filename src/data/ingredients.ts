export type IngredientCategory = "蔬菜" | "水果" | "主食" | "蛋白质" | "豆制品" | "汤菜搭配" | "其他";

export const ingredientCategories: IngredientCategory[] = ["蔬菜", "水果", "主食", "蛋白质", "豆制品", "汤菜搭配", "其他"];

export type IngredientItem = {
  id: string;
  name: string;
  image: string;
  /** 用户新增或后续可补全；静态条目可为空 */
  category?: IngredientCategory;
  highlight: string;
  summary: string;
  suitableFor: string[];
  detail: string[];
};

const baseImg = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;

export const ingredientItems: IngredientItem[] = [
  { id: "i1", name: "西兰花", image: baseImg("photo-1459411621453-7b03977f4bfc"), highlight: "富含膳食纤维和维C", summary: "适合做低油清炒或焯拌。", suitableFor: ["高血压", "高血糖", "体重管理"], detail: ["西兰花体积大、能量密度低，适合替换高热量配菜。", "建议烹饪时少油少盐，保留脆感更易坚持。"] },
  { id: "i2", name: "番茄", image: baseImg("photo-1546094096-0df4bcaaa337"), highlight: "酸甜易搭配，适合做汤", summary: "可用于降低重口味依赖。", suitableFor: ["高血压", "高血脂"], detail: ["番茄可用于增加菜品风味，减少额外盐和酱料。", "适合与鸡蛋、豆腐、鱼类搭配。"] },
  { id: "i3", name: "冬瓜", image: baseImg("photo-1512621776951-a57141f2eefd"), highlight: "口感清淡，适合汤菜", summary: "晚餐轻负担首选配菜。", suitableFor: ["高血压", "高尿酸", "脂肪肝"], detail: ["冬瓜常用于清汤和蒸煮，适合低盐饮食结构。", "与虾仁、豆腐搭配实用性高。"] },
  { id: "i4", name: "南瓜", image: baseImg("photo-1478145046317-39f10e56b5e9"), highlight: "替换精制主食的好选择", summary: "作为主食替换更容易控量。", suitableFor: ["高血糖", "体重管理"], detail: ["南瓜可替换部分米面，降低主食总量。", "注意份量，搭配蛋白和蔬菜更稳。"] },
  { id: "i9", name: "苹果", image: baseImg("photo-1567306226416-28f0efdc88ce"), highlight: "便携水果，容易执行", summary: "适合作为加餐替换甜点。", suitableFor: ["高血糖", "体重管理"], detail: ["整果优于果汁，建议搭配坚果少量食用。", "控制在一份水果量即可。"] },
  { id: "i10", name: "蓝莓", image: baseImg("photo-1490474418585-ba9bad8fd0ea"), highlight: "低负担水果选择", summary: "可用于早餐或酸奶搭配。", suitableFor: ["高血糖", "高血脂"], detail: ["蓝莓可作为甜味替代，减少高糖甜品。", "注意总水果份量。"] },
  { id: "i13", name: "玉米", image: baseImg("photo-1551754655-cd27e38d2076"), highlight: "主食替换友好", summary: "便于控制精制主食比例。", suitableFor: ["高血糖", "体重管理"], detail: ["玉米可替换部分米饭和面食。", "搭配蛋白和蔬菜更稳。"] },
];
