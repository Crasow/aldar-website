import axios from 'axios';
import catalogService from './catalogService';

jest.mock('axios');

describe('catalogService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should call axios.get with correct URL', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1' }];
      axios.get.mockResolvedValue({ data: mockCategories });

      const result = await catalogService.getCategories();

      expect(axios.get).toHaveBeenCalledWith('/api/categories/');
      expect(result.data).toEqual(mockCategories);
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await expect(catalogService.getCategories()).rejects.toThrow('Network error');
    });
  });

  describe('getProducts', () => {
    it('should call axios.get with correct URL', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1', price: 100 }];
      axios.get.mockResolvedValue({ data: mockProducts });

      const result = await catalogService.getProducts();

      expect(axios.get).toHaveBeenCalledWith('/api/products/');
      expect(result.data).toEqual(mockProducts);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch');
      axios.get.mockRejectedValue(error);

      await expect(catalogService.getProducts()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('downloadPriceList', () => {
    it('should call axios.get without category_id when categoryId is null', async () => {
      axios.get.mockResolvedValue({ data: new Blob() });

      await catalogService.downloadPriceList(null);

      expect(axios.get).toHaveBeenCalledWith('/api/price-list/download', {
        params: {},
        responseType: 'blob'
      });
    });

    it('should call axios.get with category_id when categoryId is provided', async () => {
      axios.get.mockResolvedValue({ data: new Blob() });

      await catalogService.downloadPriceList(5);

      expect(axios.get).toHaveBeenCalledWith('/api/price-list/download', {
        params: { category_id: 5 },
        responseType: 'blob'
      });
    });

    it('should return blob data', async () => {
      const mockBlob = new Blob(['PDF content']);
      axios.get.mockResolvedValue({ data: mockBlob });

      const result = await catalogService.downloadPriceList();

      expect(result.data).toEqual(mockBlob);
    });
  });
});
