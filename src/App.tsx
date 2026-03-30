import { useMemo, useState } from "react";
import BrandMark from "./components/BrandMark";
import { useProfiles } from "./context/ProfilesContext";
import { ingredientCategories, ingredientItems, type IngredientCategory, type IngredientItem } from "./data/ingredients";
import { newsItems } from "./data/news";
import type { DayPlan, DiseaseTag, Dish, DishDifficulty, DishMealType, MealPlan, NavKey, Profile } from "./types";
import IngredientMedia from "./components/IngredientMedia";
import HomeDashboard from "./components/home/HomeDashboard";
import { safeRandomId } from "./utils/id";

const navItems: Array<{ key: NavKey; label: string }> = [
  { key: "home", label: "首页" },
  { key: "nutrition", label: "饮食计划" },
  { key: "news", label: "资讯/新闻" },
  { key: "knowledge", label: "知识科普" },
  { key: "settings", label: "设置" },
];

const chronicTypes: Profile["chronicType"][] = [
  "高血压",
  "高血糖 / 糖尿病风险",
  "高尿酸 / 痛风",
  "高血脂 / 血脂异常",
  "脂肪肝",
  "体重管理 / 肥胖风险",
  "其他",
];

const chronicFocus: Record<Profile["chronicType"], { title: string; points: string[]; image: string }> = {
  高血压: {
    title: "低盐 · 控油 · 晚餐不过量",
    points: ["食盐 ≤ 5g/天", "烹调油 25-30g/天", "优先蒸煮炖，少重口味"],
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
  },
  "高血糖 / 糖尿病风险": {
    title: "主食控制 · 饮料替换 · 晚间少加餐",
    points: ["主食减量到半碗", "含糖饮料改无糖", "晚间避免高糖零食"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
  },
  "高尿酸 / 痛风": {
    title: "低嘌呤 · 多喝水 · 少酒",
    points: ["饮水量优先达标", "减少高嘌呤食材", "酒精摄入尽量避免"],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80",
  },
  "高血脂 / 血脂异常": {
    title: "减少加工食品和油炸",
    points: ["减少炸物频率", "优先天然食材", "外食少选重口味"],
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1400&q=80",
  },
  脂肪肝: {
    title: "控制总热量和晚餐负担",
    points: ["减少含糖饮料", "晚餐不过量", "避免夜宵叠加"],
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=80",
  },
  "体重管理 / 肥胖风险": {
    title: "总量管理 · 进食节奏管理",
    points: ["每餐八分饱", "稳定三餐节奏", "先替换再减少"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80",
  },
  其他: {
    title: "建立可执行饮食替换习惯",
    points: ["每天一条替换动作", "先稳住三餐结构", "根据回执微调"],
    image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1400&q=80",
  },
};

const bloodPressureBands = [
  "正常：<120 / <80",
  "升高：120-129 / <80",
  "1级高血压：130-139 或 80-89",
  "2级高血压：>=140 或 >=90",
  "严重高血压：>180 和/或 >120",
];
const bloodSugarBands = [
  "空腹正常：<=99 mg/dL",
  "空腹糖前：100-125 mg/dL",
  "空腹糖尿病范围：>=126 mg/dL",
  "A1C 正常：<5.7%",
  "A1C 糖前：5.7%-6.4%",
  "A1C 糖尿病范围：>=6.5%",
];
const uricBands = ["正常范围", "偏高（需控嘌呤）", "明显偏高（重点控嘌呤+饮水）"];
const lipidBands = ["轻度异常", "中度异常", "明显异常（减少油炸加工）"];
const fattyBands = ["轻度脂肪肝", "中度脂肪肝", "重度风险（严格控总量）"];
const weightBands = ["BMI 正常", "超重", "肥胖风险（优先总量管理）"];

type RawMealOption = { title: string; subtitle: string; image: string };
type RawMeal = {
  title: string;
  subtitle: string;
  image: string;
  salt: string;
  oil: string;
  alternatives: RawMealOption[];
};
type RawDayPlan = { day: string; breakfast: RawMeal; lunch: RawMeal; dinner: RawMeal };

const initialWeekPlanRaw: RawDayPlan[] = [
  {
    day: "周一",
    breakfast: {
      title: "鸡蛋 + 小米粥 + 全麦馒头",
      subtitle: "稳能量开局",
      image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "玉米粥 + 鸡蛋 + 全麦面包", subtitle: "简洁早餐", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=500&q=80" },
        { title: "豆浆 + 杂粮馒头", subtitle: "通勤友好", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "清蒸鱼 + 半碗饭 + 西蓝花",
      subtitle: "中午稳压",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "番茄牛腩 + 杂粮饭", subtitle: "中式家常", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=500&q=80" },
        { title: "鸡胸肉炒时蔬 + 半碗饭", subtitle: "高蛋白", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "番茄豆腐汤 + 虾仁冬瓜",
      subtitle: "晚餐轻负担",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "山药排骨汤 + 青菜", subtitle: "温和收尾", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80" },
        { title: "丝瓜虾皮汤 + 豆腐", subtitle: "少油快手", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周二",
    breakfast: {
      title: "燕麦粥 + 水煮蛋 + 苹果半个",
      subtitle: "控糖优先",
      image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "玉米 + 无糖酸奶 + 鸡蛋", subtitle: "低负担", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80" },
        { title: "红薯 + 无糖豆浆", subtitle: "快速组合", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "清炖牛肉 + 青菜 + 半碗饭",
      subtitle: "减少加工盐",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "中低油",
      alternatives: [
        { title: "香菇鸡丁 + 杂粮饭", subtitle: "油盐平衡", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80" },
        { title: "清蒸鸡腿 + 西芹", subtitle: "清爽稳妥", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "冬瓜豆腐汤 + 清炒油麦菜",
      subtitle: "晚间不过量",
      image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "虾仁丝瓜汤 + 紫菜蛋花", subtitle: "简单好做", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=500&q=80" },
        { title: "青菜豆腐煲 + 小米饭", subtitle: "家庭常见", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周三",
    breakfast: {
      title: "红薯 + 鸡蛋 + 无糖豆浆",
      subtitle: "提高饱腹感",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "杂粮粥 + 水煮蛋", subtitle: "温和控量", image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80" },
        { title: "玉米 + 无糖酸奶", subtitle: "外带友好", image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "番茄鸡胸肉 + 西蓝花 + 半碗饭",
      subtitle: "蛋白优先",
      image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "清蒸鲈鱼 + 青菜", subtitle: "低油高蛋白", image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=500&q=80" },
        { title: "牛肉芹菜 + 杂粮饭", subtitle: "中式快炒", image: "https://images.unsplash.com/photo-1604908177070-2720d4d8f6f6?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "紫菜虾皮汤 + 清炒菜花",
      subtitle: "减少夜间负担",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "丝瓜鸡蛋汤 + 生菜", subtitle: "晚间轻食", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" },
        { title: "菌菇汤 + 蒸蛋", subtitle: "简单温和", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周四",
    breakfast: {
      title: "小米南瓜粥 + 鸡蛋",
      subtitle: "清淡开场",
      image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "燕麦粥 + 鸡蛋", subtitle: "控糖友好", image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=500&q=80" },
        { title: "玉米 + 牛奶", subtitle: "极简早餐", image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "清蒸鸡腿 + 黄瓜 + 半碗饭",
      subtitle: "少酱料",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "中低油",
      alternatives: [
        { title: "牛肉土豆炖菜", subtitle: "家庭炖煮", image: "https://images.unsplash.com/photo-1604908177225-4ad95d866cdf?auto=format&fit=crop&w=500&q=80" },
        { title: "豆腐虾仁煲", subtitle: "蛋白替换", image: "https://images.unsplash.com/photo-1601315576607-5e50f4d78f56?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "番茄蛋汤 + 青菜豆腐",
      subtitle: "睡前不油腻",
      image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "冬瓜排骨汤 + 生菜", subtitle: "低负担", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80" },
        { title: "海带豆腐汤 + 菜心", subtitle: "家常平衡", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周五",
    breakfast: {
      title: "全麦馒头 + 鸡蛋 + 无糖豆浆",
      subtitle: "通勤前轻负担",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "玉米粥 + 鸡蛋", subtitle: "省时稳妥", image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80" },
        { title: "红薯 + 牛奶", subtitle: "简洁替换", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "清蒸鱼 + 西红柿炒蛋 + 半碗饭",
      subtitle: "外食可替换",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "中低油",
      alternatives: [
        { title: "青椒鸡丁 + 半碗饭", subtitle: "少油快炒", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80" },
        { title: "虾仁冬瓜 + 小米饭", subtitle: "控油方案", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "山药排骨汤 + 清炒菠菜",
      subtitle: "周末前稳住",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "豆腐菌菇汤 + 油麦菜", subtitle: "轻松收尾", image: "https://images.unsplash.com/photo-1601315576607-5e50f4d78f56?auto=format&fit=crop&w=500&q=80" },
        { title: "丝瓜蛋花汤 + 蒸南瓜", subtitle: "晚间简化", image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周六",
    breakfast: {
      title: "无糖豆浆 + 水煮蛋 + 玉米半根",
      subtitle: "晚起也能稳结构",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "杂粮粥 + 茶叶蛋（少卤）", subtitle: "少酱少卤", image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80" },
        { title: "蒸南瓜 + 无糖酸奶", subtitle: "快手组合", image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "清蒸鲈鱼 + 凉拌黄瓜 + 半碗饭",
      subtitle: "外食可替换",
      image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "白切鸡 + 焯菠菜 + 小米饭", subtitle: "少蘸料", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80" },
        { title: "番茄蛋 + 清炒豆芽 + 半碗饭", subtitle: "家常少油", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "菌菇豆腐汤 + 蒜蓉生菜",
      subtitle: "聚餐后清淡收尾",
      image: "https://images.unsplash.com/photo-1601315576607-5e50f4d78f56?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "紫菜蛋花汤 + 焯西兰花", subtitle: "汤菜为主", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=500&q=80" },
        { title: "丝瓜肉片汤 + 拌芹菜", subtitle: "少芡少酱", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
  {
    day: "周日",
    breakfast: {
      title: "杂粮粥 + 蒸蛋羹 + 小番茄",
      subtitle: "清淡暖胃",
      image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "燕麦 + 牛奶 + 香蕉半根", subtitle: "注意份量", image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=500&q=80" },
        { title: "全麦三明治（少酱）+ 黑咖啡", subtitle: "少加工酱料", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    lunch: {
      title: "白灼虾 + 西蓝花 + 半碗饭",
      subtitle: "聚餐日后补蛋白",
      image: "https://images.unsplash.com/photo-1601315576607-5e50f4d78f56?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "清蒸带鱼 + 焯芦笋 + 杂粮饭", subtitle: "少红烧", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80" },
        { title: "芹菜炒香干 + 鸡胸肉 + 半碗饭", subtitle: "香干少放", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    dinner: {
      title: "冬瓜丸子汤 + 清炒芥蓝",
      subtitle: "汤菜为主 · 少油",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=500&q=80",
      salt: "低盐",
      oil: "少油",
      alternatives: [
        { title: "番茄菌菇汤 + 蒸茄子", subtitle: "免重口", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80" },
        { title: "海带豆芽汤 + 蒜茸菠菜", subtitle: "早吃晚餐", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=500&q=80" },
      ],
    },
  },
];

const slugDishTitle = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    // Keep Chinese, letters, numbers and dash to make ids stable.
    .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, "");

const dishIdFor = (mealType: DishMealType, dishName: string) => `dish-${mealType}-${slugDishTitle(dishName)}`;

const difficultyFromTitle = (title: string): DishDifficulty => {
  if (/(蒸|炖|汤|粥|水煮|焯|炝)/.test(title)) return "easy";
  if (/(清炒|翻炒|快炒|煲|小炒)/.test(title)) return "medium";
  return "hard";
};

const ingredientsFromTitle = (title: string): string[] => {
  const hits: string[] = [];
  const add = (v: string) => {
    if (!hits.includes(v)) hits.push(v);
  };

  // Map dish text keywords -> ingredient names (for icon + trust).
  if (title.includes("番茄")) add("番茄");
  if (title.includes("鸡蛋") || title.includes("蛋")) add("鸡蛋");
  if (title.includes("豆腐")) add("豆腐");
  if (title.includes("鱼") || title.includes("虾")) add("鱼虾");
  if (title.includes("西蓝花") || title.includes("西兰花")) add("西蓝花");
  if (title.includes("冬瓜")) add("冬瓜");
  if (title.includes("南瓜")) add("南瓜");
  if (title.includes("菠菜")) add("菠菜");
  if (title.includes("芹菜")) add("芹菜");
  if (title.includes("燕麦") || title.includes("麦")) add("燕麦");
  if (title.includes("玉米")) add("玉米");
  if (title.includes("小米")) add("小米");
  if (title.includes("红薯")) add("红薯");
  if (title.includes("苹果")) add("苹果");
  if (title.includes("紫菜")) add("紫菜");
  if (title.includes("山药")) add("山药");
  if (title.includes("牛肉")) add("牛肉");
  if (title.includes("鸡胸肉")) add("鸡胸肉");
  if (title.includes("鸡腿") || title.includes("鸡")) add("鸡肉");
  if (title.includes("菌菇")) add("菌菇类");
  if (title.includes("坚果")) add("坚果类");

  return hits.length ? hits : ["食材"];
};

const diseaseTagsFrom = (title: string, salt: string, oil: string): DiseaseTag[] => {
  const tags: DiseaseTag[] = [];
  if (/低盐/.test(salt)) tags.push("lowSalt");
  if (/少油|中低油/.test(oil)) {
    tags.push("lowOil");
    tags.push("lowFat");
  }
  if (/(无糖|控糖|半碗|杂粮|红薯|玉米|小米|全麦)/.test(title)) {
    tags.push("lowSugar");
    tags.push("weightControl");
  }
  if (tags.length === 0) tags.push("weightControl");
  return Array.from(new Set(tags));
};

const IMAGE_CONFIDENCE_PLACEHOLDER = 0.15;

const dishById: Record<string, Dish> = (() => {
  const map: Record<string, Dish> = {};
  const mealKeys: DishMealType[] = ["breakfast", "lunch", "dinner"];

  const upsertDish = (mealType: DishMealType, dishName: string, dishSubtitle: string, image: string, salt: string, oil: string) => {
    const id = dishIdFor(mealType, dishName);
    if (map[id]) return;

    map[id] = {
      id,
      dishName,
      dishSubtitle,
      mealType,
      diseaseTags: diseaseTagsFrom(dishName, salt, oil),
      ingredients: ingredientsFromTitle(dishName),
      difficulty: difficultyFromTitle(dishName),
      salt,
      oil,
      image,
      imageConfidence: IMAGE_CONFIDENCE_PLACEHOLDER,
    };
  };

  initialWeekPlanRaw.forEach((day) => {
    mealKeys.forEach((mealKey) => {
      const meal = day[mealKey];
      upsertDish(mealKey, meal.title, meal.subtitle, meal.image, meal.salt, meal.oil);
      meal.alternatives.forEach((opt) => {
        upsertDish(mealKey, opt.title, opt.subtitle, opt.image, meal.salt, meal.oil);
      });
    });
  });

  return map;
})();

const initialWeekPlan: DayPlan[] = initialWeekPlanRaw.map((day) => {
  const toMeal = (mealType: DishMealType): MealPlan => {
    const meal = day[mealType];
    return {
      dishId: dishIdFor(mealType, meal.title),
      alternatives: meal.alternatives.map((alt) => dishIdFor(mealType, alt.title)),
    };
  };

  return {
    day: day.day,
    breakfast: toMeal("breakfast"),
    lunch: toMeal("lunch"),
    dinner: toMeal("dinner"),
  };
});

const quickQuestions = ["今天外出聚餐，怎么控制盐油", "今天加班，晚餐怎么简化", "我不吃辣，能不能换一道", "今晚不想吃鱼，能换什么"];
const aiReplyMap: Record<string, string> = {
  "今晚不想吃鱼，能换什么": "可换清炖鸡胸或豆腐虾仁，盐量维持低档。",
  "今天外出聚餐，饮食怎么调整": "优先蒸煮，主食减量 1/4，饮料只选无糖。",
  "我不吃辣，能不能换一版": "已切到不辣版，仍保留低盐少油结构。",
  "今天加班，晚餐怎么简化": "今晚用一汤一菜一蛋白，20 分钟内可完成。",
};

const mealUiMap: Record<DishMealType, { label: string; icon: string; headBg: string; cardBg: string; border: string }> = {
  breakfast: {
    label: "早餐",
    icon: "晨",
    headBg: "bg-amber-50",
    cardBg: "bg-amber-50/55",
    border: "border-amber-200/80",
  },
  lunch: {
    label: "午餐",
    icon: "午",
    headBg: "bg-leaf-300/25",
    cardBg: "bg-leaf-300/20",
    border: "border-leaf-300/75",
  },
  dinner: {
    label: "晚餐",
    icon: "晚",
    headBg: "bg-indigo-50",
    cardBg: "bg-indigo-50/70",
    border: "border-indigo-200/80",
  },
};

function App() {
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, updateActiveProfile } = useProfiles();

  const [entered, setEntered] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [selectedChronic, setSelectedChronic] = useState<Profile["chronicType"]>(activeProfile.chronicType);
  const [nickname, setNickname] = useState(activeProfile.name);
  const [gender, setGender] = useState<Profile["gender"]>(activeProfile.gender);
  const [age, setAge] = useState(activeProfile.age);
  const [coreMetricBand, setCoreMetricBand] = useState(activeProfile.coreMetric);
  const [isThinking, setIsThinking] = useState(false);
  const [canOpenPlan, setCanOpenPlan] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [weekPlan, setWeekPlan] = useState(initialWeekPlan);
  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState("先稳住低盐结构，再做菜品微调。");
  const [recipeDetail, setRecipeDetail] = useState<null | {
    dishId: string;
    mealType: DishMealType;
    dayLabel: string;
    alternatives: string[];
  }>(null);
  // 今日饮食回执在“饮食计划页”已移除，因此对应状态不再保留。
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [knowledgeIngredients, setKnowledgeIngredients] = useState<IngredientItem[]>(() => [...ingredientItems]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [addIngredientName, setAddIngredientName] = useState("");
  const [addIngredientCategory, setAddIngredientCategory] = useState<IngredientCategory>("蔬菜");
  const [addIngredientHighlight, setAddIngredientHighlight] = useState("");
  const [addIngredientScenario, setAddIngredientScenario] = useState("");
  const [addIngredientImageUrl, setAddIngredientImageUrl] = useState("");
  const [addIngredientNotes, setAddIngredientNotes] = useState("");
  const [addIngredientNameError, setAddIngredientNameError] = useState(false);

  const currentFocus = chronicFocus[selectedChronic];
  const selectedNews = newsItems.find((n) => n.id === selectedNewsId) ?? null;
  const selectedIngredient = knowledgeIngredients.find((i) => i.id === selectedIngredientId) ?? null;

  const currentBands = useMemo(() => {
    if (selectedChronic === "高血压") return bloodPressureBands;
    if (selectedChronic === "高血糖 / 糖尿病风险") return bloodSugarBands;
    if (selectedChronic === "高尿酸 / 痛风") return uricBands;
    if (selectedChronic === "高血脂 / 血脂异常") return lipidBands;
    if (selectedChronic === "脂肪肝") return fattyBands;
    if (selectedChronic === "体重管理 / 肥胖风险") return weightBands;
    return ["轻度关注", "中度关注", "重点管理"];
  }, [selectedChronic]);

  const resetAddIngredientForm = () => {
    setAddIngredientName("");
    setAddIngredientCategory("蔬菜");
    setAddIngredientHighlight("");
    setAddIngredientScenario("");
    setAddIngredientImageUrl("");
    setAddIngredientNotes("");
    setAddIngredientNameError(false);
  };

  const saveNewIngredient = () => {
    const name = addIngredientName.trim();
    if (!name) {
      setAddIngredientNameError(true);
      return;
    }
    setAddIngredientNameError(false);
    const highlight = addIngredientHighlight.trim() || "常见搭配，易执行";
    const summary = addIngredientScenario.trim() || "可根据当日菜单灵活替换使用。";
    const scenarioTrim = addIngredientScenario.trim();
    const suitableFor = scenarioTrim ? [scenarioTrim] : ["日常饮食"];
    const notesTrim = addIngredientNotes.trim();
    const detail = notesTrim ? [notesTrim] : ["可自行根据耐受与医嘱微调份量。"];
    const imageUrl = addIngredientImageUrl.trim();
    const newItem: IngredientItem = {
      id: `custom-${safeRandomId()}`,
      name,
      category: addIngredientCategory,
      image: imageUrl,
      highlight,
      summary,
      suitableFor,
      detail,
    };
    setKnowledgeIngredients((prev) => [...prev, newItem]);
    setShowAddIngredientModal(false);
    resetAddIngredientForm();
  };

  const saveDietProfile = () => {
    updateActiveProfile({
      ...activeProfile,
      name: nickname || activeProfile.name,
      gender,
      age: age || activeProfile.age,
      chronicType: selectedChronic,
      coreMetric: coreMetricBand || activeProfile.coreMetric,
      focusArea: `${selectedChronic} 饮食搭配`,
      goal: "本周稳住三餐结构并减少偏离",
      statusTags: ["慢病饮食", "可执行计划", "每日回执"],
    });
    setIsThinking(true);
    setCanOpenPlan(false);
    window.setTimeout(() => {
      setIsThinking(false);
      setCanOpenPlan(true);
    }, 1600);
  };

  const askAi = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setAiReply(aiReplyMap[q] ?? "已改成更简单菜品，同时保持低盐少油。");
    setAiInput("");
  };

  const updateMeal = (dayIdx: number, mealKey: DishMealType, mode: "replace" | "dislike" | "simple") => {
    setWeekPlan((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;

        const meal = day[mealKey];
        const options = meal.alternatives;

        const selectedDishId =
          mode === "replace"
            ? options[0] ?? meal.dishId
            : mode === "dislike"
              ? options[1] ?? options[0] ?? meal.dishId
              : // "更简单"：在现有候选里选择 difficulty 最轻的菜品（来自菜品库）
                options.find((id) => dishById[id]?.difficulty === "easy") ?? options[0] ?? meal.dishId;

        // 保留原型的“候选列表旋转”体验：让后续点击更容易逐步试到其他方案。
        const rotated = options.length > 1 ? [...options.slice(1), options[0]] : options;

        return {
          ...day,
          [mealKey]: { ...meal, dishId: selectedDishId, alternatives: rotated },
        };
      })
    );
  };

  const mealCardIsWeekend = (dayLabel: string) => dayLabel === "周六" || dayLabel === "周日";

  /** 餐卡仅此一行：具体、克制；周末与工作日的控制重点略有区分 */
  const getMealCardTip = (chronic: Profile["chronicType"], mealKey: DishMealType, dayLabel: string) => {
    const wknd = mealCardIsWeekend(dayLabel);

    if (chronic === "高血压") {
      if (mealKey === "breakfast") {
        if (wknd) return "避免加工咸食";
        // 周一到周五早餐卡片避免重复文案，保持同一控制逻辑（少盐/少重口/少加工）
        if (dayLabel === "周一") return "少酱少腌起步";
        if (dayLabel === "周二") return "蒸煮优先";
        if (dayLabel === "周三") return "不选腌制加工";
        if (dayLabel === "周四") return "少调味料";
        if (dayLabel === "周五") return "早餐清淡少重口";
        return "早餐清淡少重口";
      }
      if (mealKey === "lunch") return wknd ? "外食少重口" : "蒸煮优先";
      return wknd ? "晚餐不过量" : "晚餐清淡";
    }

    if (chronic === "高血糖 / 糖尿病风险") {
      if (mealKey === "breakfast") return wknd ? "早餐控甜与主食量" : "主食定量";
      if (mealKey === "lunch") return wknd ? "聚餐先菜后饭" : "少喝含糖饮料";
      return wknd ? "晚间不加餐" : "晚间少甜";
    }

    if (chronic === "高尿酸 / 痛风") {
      if (mealKey === "breakfast") return wknd ? "少浓汤与酒精" : "清淡蛋白起步";
      if (mealKey === "lunch") return wknd ? "聚餐控酒与海鲜量" : "低嘌呤搭配";
      return wknd ? "晚间多补水" : "全天足量饮水";
    }

    if (chronic === "高血脂 / 血脂异常") {
      if (mealKey === "breakfast") return wknd ? "少油炸与起酥" : "少饱和脂肪";
      if (mealKey === "lunch") return wknd ? "外食少油炸" : "少加工肉";
      return wknd ? "晚餐控油" : "晚餐清淡";
    }

    if (chronic === "脂肪肝") {
      if (mealKey === "breakfast") return wknd ? "少含糖饮品" : "控甜味早餐";
      if (mealKey === "lunch") return wknd ? "聚餐少油炸甜品" : "控精制主食";
      return wknd ? "晚餐减量" : "晚餐不过量";
    }

    if (chronic === "体重管理 / 肥胖风险") {
      if (mealKey === "breakfast") return wknd ? "八分饱开端" : "稳定进食量";
      if (mealKey === "lunch") return wknd ? "聚餐控总量" : "先菜后主食";
      return wknd ? "晚餐早吃少吃" : "晚餐控量";
    }

    if (mealKey === "breakfast") return wknd ? "少加工、少重口" : "三餐结构稳定";
    if (mealKey === "lunch") return wknd ? "外食选清淡做法" : "少油少盐";
    return wknd ? "晚餐不过量" : "晚餐清淡";
  };

  const saltLabelFrom = (salt: string) => {
    // Household measure: 1茶勺盐约等于6g，这里给“单人一餐”的可执行建议，使用“约”避免误导。
    if (/低盐/.test(salt)) return "盐约 1/4 茶勺（收口时微调）";
    return "盐约 1/4 茶勺（收口时微调）";
  };

  const oilLabelFrom = (oil: string) => {
    if (/中低油/.test(oil)) return "油约 1-1.5 茶勺（少量、分次）";
    if (/少油/.test(oil)) return "油约 1 茶勺（只够润锅）";
    return "油约 1 茶勺（只够润锅）";
  };

  const servingFromDishName = (dishName: string, mealType: DishMealType) => {
    const has = (re: RegExp) => re.test(dishName);

    const carb = (() => {
      if (has(/半碗饭|半碗/)) return "主食半碗";
      if (has(/一碗饭|全碗饭|一碗/)) return "主食一碗";
      if (has(/馒头/)) return mealType === "breakfast" ? "全麦馒头半个" : "主食半碗";
      if (has(/面包/)) return mealType === "breakfast" ? "全麦面包 1 片" : "主食半碗";
      if (has(/粥|米粥|小米粥|玉米粥|燕麦粥|小米南瓜粥/))
        return mealType === "breakfast" ? "一碗粥" : "主食半碗";
      if (has(/玉米/)) return "玉米一小份";
      return mealType === "breakfast" ? "主食一小份" : "主食半碗";
    })();

    const protein = (() => {
      if (has(/鸡蛋/)) return "鸡蛋 1 个";
      if (has(/水煮蛋/)) return "鸡蛋 1 个";
      if (has(/鱼|虾|虾仁/)) return "鱼虾一掌心份量";
      if (has(/鸡胸肉/)) return "鸡胸肉一掌心份量";
      if (has(/牛肉/)) return "牛肉半掌心份量";
      if (has(/豆腐/)) return "豆腐半块（或一小块）";
      if (has(/排骨/)) return "排骨少量（半掌心）";
      return "蛋白一掌心份量";
    })();

    const veg = (() => {
      if (has(/西蓝花|西兰花/)) return "西蓝花两拳";
      if (has(/黄瓜/)) return "黄瓜 1/2 根";
      if (has(/菠菜|油麦菜|生菜/)) return "两拳绿叶菜";
      if (has(/冬瓜/)) return "冬瓜一碗";
      if (has(/南瓜/)) return "南瓜一小碗";
      if (has(/芹菜/)) return "两拳芹菜";
      if (has(/菜花/)) return "一碗菜花";
      if (has(/紫菜/)) return "紫菜一小把";
      if (has(/菌菇/)) return "菌菇一碗";
      if (has(/西红柿|番茄/)) return "番茄 2-3 颗";
      return "蔬菜两拳（或一碗）";
    })();

    // Breakfast: 常见结构“主食 + 蛋白 + 可选水果/蔬菜”
    if (mealType === "breakfast") {
      if (has(/苹果/)) return `${carb}；${protein}；苹果 1/2 个（或小份）`;
      if (has(/蓝莓/)) return `${carb}；${protein}；蓝莓一小把`;
      return `${carb}；${protein}；蔬菜/补充一小份`;
    }

    return `${carb}；${protein}；${veg}`;
  };

  const recipeStepsFrom = (dishName: string) => {
    const lower = dishName;

    if (/清蒸/.test(lower)) {
      return [
        "食材处理干净，沥干表面水分。",
        "用建议盐量轻调（不需要重酱），拌匀后静置片刻。",
        "上锅蒸至熟透；出锅后尽量保留原汁。",
        "需要再滴少量油提香即可，别加重口味酱汁。",
      ];
    }

    if (/炖|煲/.test(lower)) {
      return [
        "锅中加清水/清汤为底，先放“较难熟”的食材。",
        "煮到半熟后加入蛋白类，继续小火煮熟。",
        "盐在接近出锅时微调；油做到分次少量。",
        "汤类出锅后趁热吃，别反复加热。",
      ];
    }

    if (/粥/.test(lower)) {
      return [
        "把主食谷物/食材洗净，冷水下锅。",
        "大火煮开后转小火，期间偶尔搅拌防粘。",
        "煮到你想要的黏稠度；鸡蛋类可单独水煮后搭配。",
        "如需要调味，收口时用少量盐或不加盐。",
      ];
    }

    if (/汤/.test(lower)) {
      return [
        "用清汤/清水做底，先把汤底食材煮到软。",
        "加入蛋白和蔬菜，煮熟透。",
        "盐在出锅前微调；油保持少量，尽量不加重酱。",
        "最后关火静置 1 分钟再盛出。",
      ];
    }

    if (/水煮|焯/.test(lower)) {
      return [
        "水烧开后放入食材，保持翻滚状态煮熟/焯熟。",
        "捞出沥干；需要时用清汤或少量调味轻拌。",
        "用建议盐量微调；油用少量滴入。",
        "搭配主食一起吃，别额外加重口蘸料。",
      ];
    }

    if (/清炒|快炒|翻炒/.test(lower)) {
      return [
        "热锅后加入少量油，迅速下蔬菜翻炒。",
        "蛋白类先处理到位（如鸡胸肉/鱼肉切小），快炒至熟。",
        "关火前再用盐微调，尽量不再加多余酱料。",
        "出锅后保持清爽口感，避免“越拌越咸”。",
      ];
    }

    // Default: 蒸煮为主的低负担路径
    return [
      "先用蒸/煮方式让食材熟透，避免多次加酱。",
      "盐在出锅前少量微调；油做到分次少量。",
      "减少重口调味来源，优先用食材本身的鲜味。",
      "如果吃不下，就把主食减少 1/4，保持三餐结构。",
    ];
  };

  const recipeFor = (dish: Dish | undefined, mealType: DishMealType) => {
    if (!dish) {
      return {
        serving: "主食半碗；蛋白一掌心；蔬菜两拳",
        seasoning: "盐约 1/4 茶勺；油约 1 茶勺",
        steps: ["蒸煮为主，盐油少量收口调味。"],
      };
    }
    return {
      serving: servingFromDishName(dish.dishName, mealType),
      seasoning: `${saltLabelFrom(dish.salt)}；${oilLabelFrom(dish.oil)}`,
      steps: recipeStepsFrom(dish.dishName),
    };
  };

  if (!entered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-bg to-white text-warm-text">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-warm-border bg-white/80"><BrandMark size={22} /></div>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-semibold tracking-tight">欢迎你，{activeProfile.name}，来到番茄健康管家</h1>
              <p className="mt-4 text-base text-warm-text/75">先建立你的慢病饮食档案，再开始本周管理</p>
              <button onClick={() => setEntered(true)} className="mt-8 rounded-full bg-warm-text px-8 py-3 text-sm text-white hover:opacity-90">Enter</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <HomeDashboard
      nickname={nickname}
      setNickname={setNickname}
      gender={gender}
      setGender={setGender}
      age={age}
      setAge={setAge}
      chronicTypes={chronicTypes}
      selectedChronic={selectedChronic}
      setSelectedChronic={setSelectedChronic}
      currentBands={currentBands}
      coreMetricBand={coreMetricBand}
      setCoreMetricBand={setCoreMetricBand}
      saveDietProfile={saveDietProfile}
      showProfileEditor={showProfileEditor}
      setShowProfileEditor={setShowProfileEditor}
      isThinking={isThinking}
      canOpenPlan={canOpenPlan}
      currentFocus={currentFocus}
      setActiveNav={(v) => setActiveNav(v)}
      aiReply={aiReply}
      aiInput={aiInput}
      setAiInput={setAiInput}
      askAi={askAi}
      quickQuestions={quickQuestions}
    />
  );

  const renderNutrition = () => (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-6 shadow-soft">
          <h3 className="text-xl font-semibold">本周饮食计划</h3>
          <p className="mt-1 text-sm text-warm-text/75">围绕{activeProfile.chronicType}饮食重点生成</p>
        </section>

        <div className="grid gap-3">
          {weekPlan.map((day, dayIdx) => (
            <article key={day.day} className="rounded-2xl border border-warm-border/70 bg-white p-4">
              <p className="text-sm font-semibold">{day.day}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
                  const meal = day[mealKey];
                  const dish = dishById[meal.dishId];
                  const ui = mealUiMap[mealKey];
                  return (
                    <div
                      key={mealKey}
                      className={`flex min-h-[198px] flex-col justify-between rounded-2xl border p-4 ${ui.border} ${ui.cardBg}`}
                    >
                      <div>
                        <p className="text-xs font-medium text-warm-text/70">{ui.label}</p>
                        <p className="mt-2 min-h-10 overflow-hidden text-base font-semibold leading-6 text-warm-text">
                          {dish.dishName}
                        </p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setRecipeDetail({
                              dishId: meal.dishId,
                              mealType: mealKey,
                              dayLabel: day.day,
                              alternatives: meal.alternatives,
                            })
                          }
                          className="w-1/2 inline-flex items-center justify-center rounded-full border border-warm-border/80 bg-white/90 px-2 py-2 text-[11px] text-warm-text/80"
                        >
                          查看做法
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateMeal(dayIdx, mealKey, "replace");
                            setRecipeDetail(null);
                          }}
                          className="w-1/2 inline-flex items-center justify-center rounded-full border border-warm-border/80 bg-white/90 px-2 py-2 text-[11px] text-warm-text/80"
                        >
                          换一道菜
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-warm-border/75 bg-warm-card p-4 shadow-soft">
        <p className="text-sm font-semibold">AI 饮食微调</p>
        <div className="mt-3 grid gap-2">
          {quickQuestions.map((q) => <button key={q} onClick={() => askAi(q)} className="rounded-xl border border-warm-border bg-white px-3 py-2 text-left text-xs">{q}</button>)}
        </div>
        <div className="mt-3 rounded-xl border border-leaf-300/70 bg-leaf-300/20 p-3 text-xs text-warm-text/85">{aiReply}</div>
      </aside>

      {recipeDetail ? (() => {
        const dish = dishById[recipeDetail.dishId];
        const recipe = recipeFor(dish, recipeDetail.mealType);
        const cardTip = getMealCardTip(activeProfile.chronicType, recipeDetail.mealType, recipeDetail.dayLabel);
        const altId = recipeDetail.alternatives.find((id) => id !== recipeDetail.dishId && dishById[id]);
        const altDish = altId ? dishById[altId] : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-warm-border bg-white shadow-soft">
              <div className="flex items-start justify-between gap-3 border-b border-warm-border/60 bg-warm-bg/60 p-5">
                <div>
                  <p className="text-xs tracking-wide text-warm-text/60">菜谱详情</p>
                  <h3 className="mt-1 text-xl font-semibold leading-snug">{dish.dishName}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRecipeDetail(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-border/70 bg-white"
                  aria-label="关闭"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="#5F7363" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs tracking-wide text-warm-text/60">为什么适合</p>
                    <p className="mt-1 text-sm text-warm-text/80">{cardTip}，便于对照执行。</p>
                  </div>

                  <div>
                    <p className="text-xs tracking-wide text-warm-text/60">建议分量</p>
                    <p className="mt-1 text-sm text-warm-text/85">{recipe.serving}</p>
                  </div>

                  <div>
                    <p className="text-xs tracking-wide text-warm-text/60">调味建议</p>
                    <p className="mt-1 text-sm text-warm-text/85">{recipe.seasoning}</p>
                  </div>

                  <div>
                    <p className="text-xs tracking-wide text-warm-text/60">简化做法步骤（4步）</p>
                    <div className="mt-2 space-y-2 text-sm text-warm-text/85">
                      {recipe.steps.slice(0, 4).map((s, i) => (
                        <div key={`r-${i}`} className="flex gap-2">
                          <span className="flex-none w-5 text-[11px] text-warm-text/60">{i + 1}.</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {altDish ? (
                    <div>
                      <p className="text-xs tracking-wide text-warm-text/60">可替换建议</p>
                      <p className="mt-1 text-sm text-warm-text/85">如果不合口味，可换成：{altDish.dishName}</p>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setRecipeDetail(null)}
                  className="mt-5 w-full rounded-full bg-warm-text px-5 py-3 text-sm text-white"
                >
                  返回本周饮食计划
                </button>
              </div>
            </div>
          </div>
        );
      })() : null}
    </div>
  );

  const renderNews = () => {
    if (selectedNews) {
      return (
        <article className="rounded-2xl border border-warm-border/75 bg-warm-card p-6 shadow-soft">
          <button onClick={() => setSelectedNewsId(null)} className="text-xs text-warm-text/65 underline underline-offset-4">返回列表</button>
          <h2 className="mt-4 text-2xl font-semibold">{selectedNews.title}</h2>
          <p className="mt-1 text-sm text-warm-text/65">
            {selectedNews.publishedAt} · {selectedNews.author} · 来源：{selectedNews.sourceName}
          </p>
          <div className="mt-4 grid gap-3">
            {selectedNews.content.map((p) => <p key={p} className="text-sm text-warm-text/85">{p}</p>)}
          </div>
          <a
            href={selectedNews.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-warm-text/70 underline underline-offset-4"
          >
            阅读原文
          </a>
        </article>
      );
    }
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">慢病饮食资讯</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {newsItems.map((n) => (
            <article key={n.id} onClick={() => setSelectedNewsId(n.id)} className="cursor-pointer rounded-2xl border border-warm-border/75 bg-warm-card p-4 shadow-soft transition hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-warm-border/60 bg-white text-xs text-warm-text/70">
                  资讯
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-snug">{n.title}</h3>
                  <p className="mt-2 text-sm text-warm-text/75">{n.summary}</p>
                  <p className="mt-2 text-xs text-warm-text/60">{n.publishedAt} · {n.author}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  const renderAddIngredientModal = () =>
    showAddIngredientModal ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4" role="dialog" aria-modal="true" aria-labelledby="add-ingredient-title">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-warm-border bg-white shadow-soft">
          <div className="border-b border-warm-border/60 bg-warm-bg/60 p-5">
            <h3 id="add-ingredient-title" className="text-lg font-semibold">新增食材</h3>
            <p className="mt-1 text-xs text-warm-text/65">填写后保存，将出现在食材知识库列表中</p>
          </div>
          <div className="space-y-3 p-5">
            <label className="block text-sm">
              食材名称 <span className="text-tomato-600">*</span>
              <input
                value={addIngredientName}
                onChange={(e) => {
                  setAddIngredientName(e.target.value);
                  setAddIngredientNameError(false);
                }}
                className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm ${addIngredientNameError ? "border-tomato-500" : "border-warm-border"}`}
                placeholder="例如：紫甘蓝"
              />
              {addIngredientNameError ? <p className="mt-1 text-xs text-tomato-600">请填写食材名称</p> : null}
            </label>
            <label className="block text-sm">
              分类 <span className="text-tomato-600">*</span>
              <select
                value={addIngredientCategory}
                onChange={(e) => setAddIngredientCategory(e.target.value as IngredientCategory)}
                className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-sm"
              >
                {ingredientCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              一句话特点（选填）
              <input value={addIngredientHighlight} onChange={(e) => setAddIngredientHighlight(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-sm" placeholder="简短一句话" />
            </label>
            <label className="block text-sm">
              适合场景（选填）
              <input value={addIngredientScenario} onChange={(e) => setAddIngredientScenario(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-sm" placeholder="如：早餐加餐、晚餐配菜" />
            </label>
            <label className="block text-sm">
              图片链接（选填）
              <input value={addIngredientImageUrl} onChange={(e) => setAddIngredientImageUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-sm" placeholder="https://..." />
            </label>
            <label className="block text-sm">
              备注（选填）
              <textarea value={addIngredientNotes} onChange={(e) => setAddIngredientNotes(e.target.value)} rows={2} className="mt-1 w-full resize-none rounded-lg border border-warm-border bg-white px-3 py-2 text-sm" placeholder="可补充个人习惯或医嘱提醒" />
            </label>
          </div>
          <div className="flex gap-2 border-t border-warm-border/60 bg-warm-bg/40 p-4">
            <button
              type="button"
              onClick={() => {
                setShowAddIngredientModal(false);
                resetAddIngredientForm();
              }}
              className="flex-1 rounded-full border border-warm-border bg-white px-4 py-2.5 text-sm"
            >
              取消
            </button>
            <button type="button" onClick={saveNewIngredient} className="flex-1 rounded-full bg-warm-text px-4 py-2.5 text-sm text-white">
              保存
            </button>
          </div>
        </div>
      </div>
    ) : null;

  const renderKnowledge = () => {
    if (selectedIngredient) {
      return (
        <>
          <article className="rounded-2xl border border-warm-border/75 bg-warm-card p-6 shadow-soft">
            <button onClick={() => setSelectedIngredientId(null)} className="text-xs text-warm-text/65 underline underline-offset-4">
              返回食材库
            </button>
            <IngredientMedia name={selectedIngredient.name} image={selectedIngredient.image || undefined} className="mt-3 h-56 w-full" />
            <h2 className="mt-4 text-2xl font-semibold">{selectedIngredient.name}</h2>
            {selectedIngredient.category ? (
              <p className="mt-1 text-xs text-warm-text/60">分类：{selectedIngredient.category}</p>
            ) : null}
            <p className="mt-1 text-sm text-leaf-600">{selectedIngredient.highlight}</p>
            <p className="mt-2 text-sm text-warm-text/80">{selectedIngredient.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedIngredient.suitableFor.map((t) => (
                <span key={t} className="rounded-full border border-leaf-300/70 bg-leaf-300/25 px-2.5 py-1 text-xs text-leaf-600">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {selectedIngredient.detail.map((p) => (
                <p key={p} className="text-sm text-warm-text/85">
                  {p}
                </p>
              ))}
            </div>
          </article>
          {renderAddIngredientModal()}
        </>
      );
    }
    return (
      <>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">食材知识库</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {knowledgeIngredients.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedIngredientId(item.id)}
                className="cursor-pointer rounded-2xl border border-warm-border/75 bg-warm-card p-4 shadow-soft transition hover:-translate-y-0.5"
              >
                <IngredientMedia name={item.name} image={item.image || undefined} className="h-36 w-full" />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  {item.category ? (
                    <span className="rounded-full border border-warm-border/70 bg-white px-2 py-0.5 text-[11px] text-warm-text/65">{item.category}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-leaf-600">{item.highlight}</p>
                <p className="mt-2 text-sm text-warm-text/80">{item.summary}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-dashed border-warm-border/90 bg-white p-4 shadow-soft">
              <button
                type="button"
                onClick={() => {
                  resetAddIngredientForm();
                  setShowAddIngredientModal(true);
                }}
                className="flex h-full min-h-[240px] w-full flex-col items-center justify-center rounded-xl bg-warm-bg/55 text-warm-text/70 transition hover:bg-warm-bg"
                aria-label="添加食材"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-warm-border bg-white text-2xl">+</span>
                <span className="mt-3 text-sm font-medium">添加食材</span>
                <span className="mt-1 text-xs text-warm-text/60">补充你常吃但未收录的食材</span>
              </button>
            </article>
          </div>
        </section>
        {renderAddIngredientModal()}
      </>
    );
  };

  const renderSimple = (title: string, lines: string[]) => (
    <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-6 shadow-soft">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3">
        {lines.map((line) => <div key={line} className="rounded-xl border border-warm-border/60 bg-white p-4 text-sm">{line}</div>)}
      </div>
    </section>
  );

  const renderMain = () => {
    switch (activeNav) {
      case "home":
        return renderHome();
      case "nutrition":
        return renderNutrition();
      case "news":
        return renderNews();
      case "knowledge":
        return renderKnowledge();
      case "settings":
        return renderSimple("设置", ["界面语言：中文", "本地档案：最多 5 个", "饮食计划：每日可微调"]);
      case "profile":
        return renderSimple("档案入口", ["请在首页饮食档案区进行编辑与保存。"]);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-bg to-white text-warm-text">
      <header className="sticky top-0 z-10 border-b border-warm-border/60 bg-warm-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-warm-border bg-white"><BrandMark size={20} /></div>
            <p className="text-base font-semibold tracking-wide">番茄健康管家</p>
          </div>
          <nav className="hidden md:flex items-center gap-2 rounded-full border border-warm-border bg-white/80 px-2 py-1">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setActiveNav(item.key)} className={`rounded-full px-3 py-1.5 text-sm transition ${activeNav === item.key ? "bg-warm-bg text-warm-text" : "text-warm-text/70 hover:bg-warm-bg/70"}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <select
              value={activeProfileId}
              onChange={(e) => {
                setActiveProfileId(e.target.value);
                const next = profiles.find((p) => p.id === e.target.value);
                if (next) {
                  setNickname(next.name);
                  setGender(next.gender);
                  setAge(next.age);
                  setSelectedChronic(next.chronicType);
                  setCoreMetricBand(next.coreMetric);
                }
              }}
              className="rounded-full border border-warm-border bg-white px-3 py-2 text-sm"
            >
              {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
            </select>
            <button onClick={() => setActiveNav("home")} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-border bg-white" aria-label="编辑档案">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="#5F7363" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{renderMain()}</main>
    </div>
  );
}

export default App;
