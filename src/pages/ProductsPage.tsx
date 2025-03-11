import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_ALL_CATEGORIES } from '../api/queries';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../api/mutations';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  image: string;
  sku: string;
  brand: string;
}

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch data
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_ALL_PRODUCTS);
  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);

  // Mutations
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => refetchProducts(),
  });
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => refetchProducts(),
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => refetchProducts(),
  });

  // Handlers
  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData: any) => {
    if (selectedProduct) {
      updateProduct({ variables: { id: selectedProduct.id, productData: formData } });
    } else {
      createProduct({ variables: { productData: formData } });
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if(selectedProduct){
      deleteProduct({ variables: { id: selectedProduct.id } });
      setIsDeleteModalOpen(false);
    }else return;
  };

  // Fields for the form
  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'price', label: 'Price', type: 'number' },
    {
      key: 'categoryId',
      label: 'Category',
      type: 'select',
      options: categoriesData?.categories.map((category: { id: any; name: any; }) => ({
        value: category.id,
        label: category.name,
      })),
    },
    { key: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
    { key: 'image', label: 'Image URL', type: 'text' },
    { key: 'sku', label: 'SKU', type: 'text' },
    { key: 'brand', label: 'Brand', type: 'text' },
  ];

  if (productsLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <button onClick={handleAdd} className="bg-[#FFE31A] text-gray-900 px-4 py-2 rounded mb-6">
        Add Product
      </button>

      <DataTable
        data={productsData?.products}
        columns={['name', 'price', 'category.name', 'stockQuantity']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
        fields={fields}
      />

      <CrudModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteConfirm}
        isDelete fields={[]}      />
    </div>
  );
};

export default ProductsPage;