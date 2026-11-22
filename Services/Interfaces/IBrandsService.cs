using INKFLOW.Models;
namespace INKFLOW.Services.Interfaces;

public interface IBrandsService
{
    Task<List<Brand>> GetBrandsAsync();
    Task<Brand?> CreateBrandAsync(string name);
    Task<CatalogMutationResult> UpdateBrandAsync(int id, string name);
    Task<CatalogMutationResult> DeleteBrandAsync(int id);
}