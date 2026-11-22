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
}