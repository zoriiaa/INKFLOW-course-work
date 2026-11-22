using INKFLOW.Data;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> CreateCategoryAsync(string name, int? parentCategoryId)
    {
        var normalizedName = name.Trim();
        if (string.IsNullOrEmpty(normalizedName)) return null;

        if (parentCategoryId.HasValue)
        {
            var parent = await _context.Categories
                .FirstOrDefaultAsync(category => category.Id == parentCategoryId.Value);
            if (parent == null || parent.ParentCategoryId.HasValue) return null;
        }

        var category = new Category
        {
            Name = normalizedName,
            ParentCategoryId = parentCategoryId
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<CatalogMutationResult> UpdateCategoryAsync(int id, string name, int? parentCategoryId)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return CatalogMutationResult.NotFound;

        var normalizedName = name.Trim();
        if (string.IsNullOrEmpty(normalizedName)) return CatalogMutationResult.Invalid;

        if (parentCategoryId.HasValue)
        {
            if (parentCategoryId.Value == id) return CatalogMutationResult.Invalid;

            var parent = await _context.Categories.FindAsync(parentCategoryId.Value);
            if (parent == null || parent.ParentCategoryId.HasValue)
                return CatalogMutationResult.Invalid;

            if (!category.ParentCategoryId.HasValue
                && await _context.Categories.AnyAsync(item => item.ParentCategoryId == id))
                return CatalogMutationResult.Invalid;
        }

        category.Name = normalizedName;
        category.ParentCategoryId = parentCategoryId;
        await _context.SaveChangesAsync();
        return CatalogMutationResult.Success;
    }

    public async Task<CatalogMutationResult> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return CatalogMutationResult.NotFound;

        var hasProducts = await _context.Products.AnyAsync(product => product.CategoryId == id);
        var hasSubcategories = await _context.Categories.AnyAsync(item => item.ParentCategoryId == id);
        if (hasProducts || hasSubcategories) return CatalogMutationResult.HasDependencies;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return CatalogMutationResult.Success;
    }
}