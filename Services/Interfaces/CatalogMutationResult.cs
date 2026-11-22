namespace INKFLOW.Services.Interfaces;

public enum CatalogMutationResult
{
    Success,
    NotFound,
    Conflict,
    HasDependencies,
    Invalid
}
