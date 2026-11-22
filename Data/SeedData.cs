using System.Text.Json;
using INKFLOW.Models;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext db)
    {
        if (await db.Brands.AnyAsync()
            || await db.Categories.AnyAsync()
            || await db.Products.AnyAsync())
            return;

        var assembly = typeof(SeedData).Assembly;
        await using var stream = assembly.GetManifestResourceStream("INKFLOW.Data.SeedCatalog.json")
            ?? throw new InvalidOperationException("The catalog seed resource was not found.");
        var seed = await JsonSerializer.DeserializeAsync<SeedCatalog>(
            stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidDataException("The catalog seed resource is invalid.");

        await using var transaction = await db.Database.BeginTransactionAsync();

        var brands = seed.Brands
            .Select(item => new Brand { Name = item.Name })
            .ToList();
        db.Brands.AddRange(brands);
        await db.SaveChangesAsync();

        var brandByName = brands.ToDictionary(item => item.Name, StringComparer.Ordinal);
        var categories = seed.Categories.ToDictionary(
            item => item.Name,
            item => new Category { Name = item.Name },
            StringComparer.Ordinal);

        foreach (var item in seed.Categories)
        {
            if (item.ParentName == null)
                continue;

            if (!categories.TryGetValue(item.ParentName, out var parent))
                throw new InvalidDataException($"Seed parent category '{item.ParentName}' was not found.");

            categories[item.Name].ParentCategory = parent;
        }

        db.Categories.AddRange(categories.Values);
        await db.SaveChangesAsync();

        var products = seed.Products.Select(item =>
        {
            if (!brandByName.TryGetValue(item.BrandName, out var brand))
                throw new InvalidDataException($"Seed brand '{item.BrandName}' was not found.");
            if (!categories.TryGetValue(item.CategoryName, out var category))
                throw new InvalidDataException($"Seed category '{item.CategoryName}' was not found.");

            return new Product
            {
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                ImageUrl = item.ImageUrl,
                Stock = item.Stock,
                Thickness = item.Thickness,
                Density = item.Density,
                Color = item.Color,
                Hardness = item.Hardness,
                Size = item.Size,
                Specification = item.Specification,
                BrandId = brand.Id,
                CategoryId = category.Id
            };
        }).ToList();

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    public sealed class SeedCatalog
    {
        public List<SeedBrand> Brands { get; set; } = new();
        public List<SeedCategory> Categories { get; set; } = new();
        public List<SeedProduct> Products { get; set; } = new();
    }

    public sealed class SeedBrand
    {
        public string Name { get; set; } = string.Empty;
    }

    public sealed class SeedCategory
    {
        public string Name { get; set; } = string.Empty;
        public string? ParentName { get; set; }
    }

    public sealed class SeedProduct
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int Stock { get; set; }
        public float? Thickness { get; set; }
        public float? Density { get; set; }
        public string? Color { get; set; }
        public string? Hardness { get; set; }
        public string? Size { get; set; }
        public string? Specification { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
    }
}
