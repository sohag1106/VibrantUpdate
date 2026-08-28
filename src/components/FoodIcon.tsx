import { 
  Pizza, Beef, Cookie, Flame, Box, Sparkles, Compass, Layers, 
  GlassWater, Coffee, Salad, ChefHat, Soup, Utensils
} from 'lucide-react';

interface FoodIconProps {
  category: string;
  name?: string;
  className?: string;
}

export default function FoodIcon({ category, name = '', className = 'h-6 w-6' }: FoodIconProps) {
  const normalizedCategory = category.toLowerCase();
  const normalizedName = name.toLowerCase();

  // Try matching name first, then category
  let IconComponent = Utensils;
  let bgGradient = 'from-amber-400 to-orange-500 text-white';

  if (normalizedName.includes('pizza') || normalizedCategory.includes('pizza')) {
    IconComponent = Pizza;
    bgGradient = 'from-red-400 to-orange-500 text-white';
  } else if (normalizedName.includes('burger') || normalizedCategory.includes('burger')) {
    IconComponent = Beef;
    bgGradient = 'from-amber-500 to-red-500 text-white';
  } else if (normalizedName.includes('shingara') || normalizedCategory.includes('shingara')) {
    IconComponent = Cookie;
    bgGradient = 'from-yellow-400 to-amber-600 text-white';
  } else if (normalizedName.includes('wings') || normalizedCategory.includes('wings') || normalizedName.includes('chicken')) {
    IconComponent = Flame;
    bgGradient = 'from-orange-500 to-red-600 text-white';
  } else if (normalizedName.includes('meatbox') || normalizedCategory.includes('meatbox')) {
    IconComponent = Box;
    bgGradient = 'from-pink-500 to-rose-600 text-white';
  } else if (normalizedName.includes('shawrma') || normalizedCategory.includes('shawrma')) {
    IconComponent = Sparkles;
    bgGradient = 'from-teal-400 to-emerald-600 text-white';
  } else if (normalizedName.includes('subway') || normalizedCategory.includes('subway')) {
    IconComponent = Compass;
    bgGradient = 'from-blue-400 to-indigo-600 text-white';
  } else if (normalizedName.includes('sandwich') || normalizedCategory.includes('sandwich')) {
    IconComponent = Layers;
    bgGradient = 'from-yellow-400 to-orange-500 text-white';
  } else if (normalizedName.includes('juice') || normalizedCategory.includes('juice')) {
    IconComponent = GlassWater;
    bgGradient = 'from-cyan-400 to-blue-500 text-white';
  } else if (normalizedName.includes('coffee') || normalizedCategory.includes('coffee') || normalizedName.includes('tea') || normalizedName.includes('drink')) {
    IconComponent = Coffee;
    bgGradient = 'from-amber-700 to-yellow-900 text-white';
  } else if (normalizedName.includes('appetizer') || normalizedCategory.includes('appetizers') || normalizedName.includes('salad')) {
    IconComponent = Salad;
    bgGradient = 'from-emerald-400 to-teal-600 text-white';
  } else if (normalizedName.includes('pasta') || normalizedCategory.includes('pasta')) {
    IconComponent = ChefHat;
    bgGradient = 'from-indigo-400 to-purple-600 text-white';
  } else if (normalizedName.includes('chowmein') || normalizedCategory.includes('chowmein') || normalizedName.includes('noodles') || normalizedName.includes('soup')) {
    IconComponent = Soup;
    bgGradient = 'from-red-400 to-rose-500 text-white';
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${bgGradient} shadow-md shadow-indigo-100/10 h-full w-full rounded-2xl`}>
      <IconComponent className={className} />
    </div>
  );
}
