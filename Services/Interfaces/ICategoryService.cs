using INKFLOW.Models;

namespace INKFLOW.Services.Interfaces;

public interface ICategoryService
{
    Task<List<Category>> GetCategoriesAsync();
}