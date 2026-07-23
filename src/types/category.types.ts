export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  isActive: boolean;
  parentId?: string | null;
  children?: Category[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  parentId?: string;
}


