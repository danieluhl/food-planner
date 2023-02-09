import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const exampleData: Prisma.ExampleCreateInput[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const recipeSeedData: Prisma.RecipeCreateInput[] = [
  // name        String   @id @default(cuid())
  // createdAt   DateTime @default(now())
  // updatedAt   DateTime @updatedAt
  // ingredients Ingredient[]
  {
    name: "Honey2",
    createdAt: new Date(),
    updatedAt: new Date(),
    ingredients: { create: [] },
  },
  {
    name: "Milk2",
    createdAt: new Date(),
    updatedAt: new Date(),
    ingredients: { create: [] },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const recipe of recipeSeedData) {
    console.log(recipe.name);
    const prismaRecipe = await prisma.recipe.create({
      data: recipe,
    });
    console.log(`Created recipe: ${prismaRecipe.name}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
