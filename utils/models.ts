// models.ts
export interface Note {
  id: string;
  clientId: string;
  categoryId: string;
  text: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
