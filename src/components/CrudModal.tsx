import React, { useState, useEffect } from 'react';

const CrudModal = ({ isOpen, onClose, onSubmit, initialData, fields, isDelete }: CrudModalProps) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData || {}); // Update formData when initialData changes
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-white">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {isDelete ? 'Confirm Delete' : initialData ? 'Edit' : 'Add'}
        </h2>
        {isDelete ? (
          <p>Are you sure you want to delete this record?</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded-lg"
                    required
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option: { value: React.Key | readonly string[] | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded-lg"
                    required
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-[#FFE31A] text-gray-900 py-2 rounded-lg hover:bg-[#FFE31A]/90"
            >
              {isDelete ? 'Delete' : initialData ? 'Update' : 'Add'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrudModal;
