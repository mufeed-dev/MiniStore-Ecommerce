import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductsContext";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const productSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0")
    .min(0.01, "Price must be at least $0.01"),
  category: Yup.string()
    .required("Category is required")
    .oneOf(
      ["Electronics", "Clothing", "Books", "Home & Kitchen", "Sports", "Other"],
      "Please select a valid category"
    ),
  image: Yup.string().url("Please enter a valid URL").nullable().notRequired(),
});

const AddProduct = ({ editProduct, onSuccess }) => {
  const [formLoading, setFormLoading] = useState(false);
  const { addProduct, updateProduct, error, clearError } = useProducts();
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: "",
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  useEffect(() => {
    if (editProduct) {
      formik.setValues({
        name: editProduct.name || "",
        price: editProduct.price || "",
        category: editProduct.category || "",
        image: editProduct.image || "",
      });
    } else {
      formik.resetForm();
    }
    setSelectedFile(null);
    clearError();
  }, [editProduct, clearError]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      formik.setFieldValue("image", "");
    }
  };

  const handleSubmit = async (values) => {
    setFormLoading(true);
    clearError();

    try {
      const submitData = new FormData();
      submitData.append("name", values.name.trim());
      submitData.append("price", parseFloat(values.price));
      submitData.append("category", values.category);

      if (selectedFile) {
        submitData.append("image", selectedFile);
      } else if (values.image) {
        submitData.append("image", values.image);
      }

      if (editProduct) {
        await updateProduct(editProduct._id, submitData);
        toast.success("🎉 Product updated successfully!");
      } else {
        await addProduct(submitData);
        toast.success("🎉 Product added successfully!");
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to submit form:", err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Enter product name"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="0"
            step="0.01"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Enter price"
          />
          {formik.touched.price && formik.errors.price && (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.price}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.category}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          {selectedFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">
                Selected file: {selectedFile.name}
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-gray-500">OR</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="https://example.com/image.jpg"
            disabled={selectedFile !== null}
          />
          {formik.touched.image && formik.errors.image && (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.image}
            </div>
          )}
          {formik.values.image && !selectedFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <img
                src={formik.values.image}
                alt="Preview"
                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onSuccess}
            disabled={formLoading}
            className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formLoading || !formik.isValid || formik.isSubmitting}
            className="flex-1 px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center text-base"
          >
            {formLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editProduct ? "Updating..." : "Adding..."}
              </>
            ) : editProduct ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
