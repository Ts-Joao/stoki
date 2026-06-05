import { StockMoventType } from "@prisma/client";

export type TypeCreateMoviment = {
  productId: string;
  userId: string;
  quantity: number;
  note?: string;
  type: StockMoventType;
}