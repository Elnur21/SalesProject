import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCategories } from "../../redux/actions/categoryActions";
import { saveProduct } from "../../redux/actions/productActions";
import ProductDetail from "./ProductDetail";
import { validate } from "@babel/types";

function AddOrUpdateProduct({
  products,
  categories,
  getProducts,
  getCategories,
  saveProduct,
  history,
  ...props
}) {
  const [product, setProduct] = useState({ ...props.product });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    setProduct({ ...props.product });
  }, [props.product]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProduct(previousProduct => ({
      ...previousProduct,
      [name]: name === "categoryId" ? parseInt(value, 10) : value
    }));

    validate(name,value);
  }

  function validate(name,value) {
    if (name === "productName" && value === "") {
      setErrors(previousErrors => ({
        ...previousErrors,
        productName: "Product name must be here"
      }));
    }else if(name === "quantityPerUnit" && value === "") {
      setErrors(previousErrors => ({
        ...previousErrors,
        quantityPerUnit: "Quantity Per Unit must be here"
      }));
      
    }
    else if(name === "unitPrice" && value === "") {
      setErrors(previousErrors => ({
        ...previousErrors,
        unitPrice: "Unit Price must be here"
      }));
      
    }
    else if(name === "unitsInStock" && value === "") {
      setErrors(previousErrors => ({
        ...previousErrors,
        unitsInStock: "Units In Stock must be here"
      }));
      
    }
    else{
        setErrors(previousErrors => ({
            ...previousErrors,
            productName: ""
          }));
    }
  }

  function handleSave(event) {
    event.preventDefault();
    saveProduct(product).then(() => {
      history.push("/products");
    });
  }

  return (
    <ProductDetail
      product={product}
      categories={categories}
      onChange={handleChange}
      onSave={handleSave}
      errors={errors}
    />
  );
}

export function getProductById(products, productId) {
  let product = products.find(product => product.id == productId) || null;
  return product;
}

function mapStateToProps(state, ownProps) {
  const productId = ownProps.match.params.productId;
  const product =
    productId && state.productListReducer.length > 0
      ? getProductById(state.productListReducer, productId)
      : {};
  return {
    product,
    products: state.productListReducer,
    categories: state.categoryListReducer
  };
}

const mapDispatchToProps = {
  getCategories,
  saveProduct
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOrUpdateProduct);
