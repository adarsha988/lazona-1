import Table from "../../components/Table";
import { useSelector,useDispatch } from "react-redux";
import { fetchProducts } from "../../slices/productSlice";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";


const headers=[
  "id",
  "name",
  "quantity",
  "price"]
const AdminProducts=()=>{
  const {products,limit,currentPage}= useSelector((state)=>state.products);
   const dispatch=useDispatch();
   const initFetch= useCallback(()=>{
     dispatch(fetchProducts({limit,page:currentPage}));
   },[dispatch,limit,currentPage])
   
   useEffect(()=>{
     initFetch();
   },[initFetch])
console.log(products)
  return (
    <>
    <div className="flex d-flex jusify-content-end">
      <Link to="/admin/products/add">
      <button className="btn btn-danger">
        Add Product
      </button>
      </Link>
    </div>
    <Table products={products} headers={headers}/>

    </>
  )
}

export default AdminProducts;