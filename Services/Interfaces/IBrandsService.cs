using INKFLOW.Models;
namespace INKFLOW.Services.Interfaces;

public interface IBrandsService
{
    Task<List<Brand>> GetBrandsAsync();
    Task<Brand?> CreateBrandAsync(string name);
}