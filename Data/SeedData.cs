using INKFLOW.Models;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext db)
    {
        if (!await db.Brands.AnyAsync())
        {
            db.Brands.AddRange(
                new Brand { Name = "INKFLOW" },
                new Brand { Name = "Canson" },
                new Brand { Name = "Faber-Castell" },
                new Brand { Name = "Parker" });
            await db.SaveChangesAsync();
        }

        if (!await db.Categories.AnyAsync())
        {
            var paper = new Category { Name = "Папір" };
            var writing = new Category { Name = "Письмове приладдя" };
            var notebooks = new Category { Name = "Блокноти" };
            db.Categories.AddRange(paper, writing, notebooks);
            await db.SaveChangesAsync();

            db.Categories.AddRange(
                new Category { Name = "Для малювання", ParentCategoryId = paper.Id },
                new Category { Name = "Для друку", ParentCategoryId = paper.Id },
                new Category { Name = "Ручки", ParentCategoryId = writing.Id },
                new Category { Name = "Олівці", ParentCategoryId = writing.Id },
                new Category { Name = "У крапку", ParentCategoryId = notebooks.Id },
                new Category { Name = "У лінію", ParentCategoryId = notebooks.Id });
            await db.SaveChangesAsync();
        }

        if (await db.Products.AnyAsync())
            return;

        var brands = await db.Brands.ToDictionaryAsync(brand => brand.Name);
        var categories = await db.Categories.ToDictionaryAsync(category => category.Name);
        if (!brands.ContainsKey("INKFLOW") || !brands.ContainsKey("Canson")
            || !brands.ContainsKey("Faber-Castell") || !brands.ContainsKey("Parker")
            || !categories.ContainsKey("Для малювання") || !categories.ContainsKey("Для друку")
            || !categories.ContainsKey("Ручки") || !categories.ContainsKey("Олівці")
            || !categories.ContainsKey("У крапку") || !categories.ContainsKey("У лінію"))
            return;

        db.Products.AddRange(
            new Product
            {
                Name = "Скетчбук A5 Canson",
                Description = "Скетчбук для ескізів і малювання.",
                Price = 289,
                ImageUrl = "https://placehold.co/600x800?text=Sketchbook",
                Stock = 24,
                Color = "Кремовий",
                Thickness = 0.18f,
                Density = 120,
                Hardness = "Середня",
                Size = "A5, 40 аркушів",
                Specification = "Безкислотний папір, тверда обкладинка",
                BrandId = brands["Canson"].Id,
                CategoryId = categories["Для малювання"].Id
            },
            new Product
            {
                Name = "Папір для акварелі A4",
                Description = "Щільний папір для акварельних технік.",
                Price = 349,
                ImageUrl = "https://placehold.co/600x800?text=Watercolor+Paper",
                Stock = 18,
                Color = "Білий",
                Thickness = 0.45f,
                Density = 300,
                Hardness = "Висока",
                Size = "A4, 20 аркушів",
                Specification = "100% целюлоза, зерниста фактура",
                BrandId = brands["Canson"].Id,
                CategoryId = categories["Для малювання"].Id
            },
            new Product
            {
                Name = "Папір для принтера A4",
                Description = "Універсальний папір для щоденного друку.",
                Price = 179,
                ImageUrl = "https://placehold.co/600x800?text=Printer+Paper",
                Stock = 50,
                Color = "Білий",
                Thickness = 0.1f,
                Density = 80,
                Hardness = "Стандартна",
                Size = "A4, 500 аркушів",
                Specification = "Формат A4, клас C",
                BrandId = brands["INKFLOW"].Id,
                CategoryId = categories["Для друку"].Id
            },
            new Product
            {
                Name = "Ручка кулькова Parker Jotter",
                Description = "Металева кулькова ручка з синім стрижнем.",
                Price = 899,
                ImageUrl = "https://placehold.co/600x800?text=Parker+Pen",
                Stock = 12,
                Color = "Сріблястий",
                Thickness = 1,
                Density = 0,
                Hardness = "Нержавіюча сталь",
                Size = "Стрижень 0.7 мм",
                Specification = "Корпус із нержавіючої сталі",
                BrandId = brands["Parker"].Id,
                CategoryId = categories["Ручки"].Id
            },
            new Product
            {
                Name = "Набір графітових олівців",
                Description = "Набір олівців різної твердості для ескізів.",
                Price = 420,
                ImageUrl = "https://placehold.co/600x800?text=Pencils",
                Stock = 20,
                Color = "Графітовий",
                Thickness = 7,
                Density = 0,
                Hardness = "2H–6B",
                Size = "Набір із 12 штук",
                Specification = "Дерев'яний корпус, градації твердості",
                BrandId = brands["Faber-Castell"].Id,
                CategoryId = categories["Олівці"].Id
            },
            new Product
            {
                Name = "Блокнот у крапку INKFLOW",
                Description = "Блокнот для планування, нотаток і скетчів.",
                Price = 259,
                ImageUrl = "https://placehold.co/600x800?text=Dotted+Notebook",
                Stock = 30,
                Color = "Темно-зелений",
                Thickness = 0.12f,
                Density = 100,
                Hardness = "Середня",
                Size = "A5, 160 сторінок",
                Specification = "Крапкова розмітка, еластична застібка",
                BrandId = brands["INKFLOW"].Id,
                CategoryId = categories["У крапку"].Id
            },
            new Product
            {
                Name = "Блокнот у лінію INKFLOW",
                Description = "Компактний блокнот для щоденних записів.",
                Price = 229,
                ImageUrl = "https://placehold.co/600x800?text=Lined+Notebook",
                Stock = 28,
                Color = "Бежевий",
                Thickness = 0.12f,
                Density = 100,
                Hardness = "Середня",
                Size = "A5, 160 сторінок",
                Specification = "Лінійована розмітка, закладка-лясе",
                BrandId = brands["INKFLOW"].Id,
                CategoryId = categories["У лінію"].Id
            },
            new Product
            {
                Name = "Лінер Faber-Castell 0.4 мм",
                Description = "Пігментний лінер для креслення та ілюстрацій.",
                Price = 115,
                ImageUrl = "https://placehold.co/600x800?text=Fineliner",
                Stock = 40,
                Color = "Чорний",
                Thickness = 0.4f,
                Density = 0,
                Hardness = "Пігментне чорнило",
                Size = "0.4 мм",
                Specification = "Водостійкий, світлостійкий",
                BrandId = brands["Faber-Castell"].Id,
                CategoryId = categories["Ручки"].Id
            },
            new Product
            {
                Name = "Папір для ескізів A3",
                Description = "Папір великого формату для начерків і креслень.",
                Price = 319,
                ImageUrl = "https://placehold.co/600x800?text=Sketch+Paper",
                Stock = 16,
                Color = "Білий",
                Thickness = 0.16f,
                Density = 120,
                Hardness = "Середня",
                Size = "A3, 30 аркушів",
                Specification = "Гладка поверхня, підходить для олівця та лінера",
                BrandId = brands["Canson"].Id,
                CategoryId = categories["Для малювання"].Id
            });

        await db.SaveChangesAsync();
    }
}
