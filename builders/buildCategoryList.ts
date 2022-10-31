/**
 * Categorize products per category
 * @param data
 * @returns
 */
export const buildCategoryList = (data: any) => {
  return data.reduce((acc: any, product: any) => {
    const { category, ...rest } = product;
    const categoryIndex = acc.findIndex((item: any) => item.category === category);

    if (categoryIndex > -1) {
      acc[categoryIndex].data.push(rest);
    } else {
      acc.push({ category, data: [rest] });
    }

    return acc;
  }, []);
};
