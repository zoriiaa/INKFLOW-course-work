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
}