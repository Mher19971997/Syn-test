// prismaTypes.ts
import { Prisma } from "@prisma/client";

// Типы для моделей
export type User = Prisma.UserGetPayload<object>;
export type Industry = Prisma.IndustryGetPayload<object>;
export type SelectedUserIndustry =
  Prisma.SelectedUserIndustryGetPayload<object>;
