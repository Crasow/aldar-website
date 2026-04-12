import axios from 'axios';

const CATEGORIES_URL = '/api/categories';
const PRODUCTS_URL = '/api/products';
const PRICE_LIST_URL = '/api/price-list/download';

const getCategories = () => axios.get(CATEGORIES_URL);

const getProducts = () => axios.get(PRODUCTS_URL);

const downloadPriceList = (categoryId = null) => {
  const params = categoryId ? { category_id: categoryId } : {};
  return axios.get(PRICE_LIST_URL, { params, responseType: 'blob' });
};

const catalogService = {
  getCategories,
  getProducts,
  downloadPriceList,
};

export default catalogService;
