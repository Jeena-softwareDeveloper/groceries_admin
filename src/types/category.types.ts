export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  children?: Category[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  isActive: boolean;
  parentId?: string;
}

