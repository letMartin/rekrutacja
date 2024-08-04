import { Category } from './mockedApi';

export type CategoryListElement = {
  id: number;
  order: number;
  name: string;
  image: string;
  showOnHome: boolean;
  children: CategoryListElement[];
};

export const getTitleNumber = (title: string): number | null => {
  const parsedToInt = parseInt(
    title.includes('#') ? title.split('#')[0] : title,
    10
  );

  return isNaN(parsedToInt) ? null : parsedToInt;
};

export const sortByOrder = (a: CategoryListElement, b: CategoryListElement) => {
  return a.order - b.order;
};

export const mapCategory = (
  { Title, id, MetaTagDescription, name, children }: Category,
  isTopLevel = false
): CategoryListElement => {
  const order = getTitleNumber(Title) ?? id;

  return {
    id,
    name,
    order,
    image: MetaTagDescription,
    showOnHome: isTopLevel && Title.includes('#'),
    children: children.map((child) => mapCategory(child)).sort(sortByOrder),
  };
};

export const setShowOnHome = (
  categories: CategoryListElement[]
): CategoryListElement[] => {
  const MAX_CATEGORIES_TO_SHOW = 5;
  const DEFAULT_CATEGORIES_TO_SHOW = 3;

  if (categories.length <= MAX_CATEGORIES_TO_SHOW) {
    return categories.map((category) => ({ ...category, showOnHome: true }));
  }

  if (categories.some(({ showOnHome }) => showOnHome)) {
    return categories;
  }

  return categories.map((category, index) => ({
    ...category,
    showOnHome: index < DEFAULT_CATEGORIES_TO_SHOW,
  }));
};

export const categoryTree = async (
  getData: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  try {
    const { data } = await getData();

    if (!data?.length) {
      return [];
    }

    const mappedCategories = data
      .map((category) => mapCategory(category, true))
      .sort(sortByOrder);

    return setShowOnHome(mappedCategories);
  } catch (error) {
    // Show error where and if needed
    console.error('Error while fetching categories:', error);
    return [];
  }
};
