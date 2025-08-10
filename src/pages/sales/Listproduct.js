import React, { useCallback, useEffect, useMemo } from "react";
import Table from "../../component/VTable";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../features/product/productSlice";
import { ToastContainer } from "react-toastify";


function Product() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.products);

    const memoizedProductList = useSelector(
        (state) => state.products.productList,
        (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
    );

    const renderProductImage = useCallback((imageUrl) => (
        <img
            src={imageUrl?.image}
            alt="Product"
            className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-200"
            loading="lazy"
        />
    ), []);

    const columns = useMemo(() => [
        { title: "SrNo", dataIndex: "srno", key: "srno" },
        { title: "Product Name", dataIndex: "name", key: "name" },
        {
            title: "Product Image",
            dataIndex: "image",
            key: "productimg",
            render: renderProductImage,
        },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Price", dataIndex: "price", key: "price" },
    ], [renderProductImage]);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const tableData = useMemo(() => {
        return (memoizedProductList?.data || []).map((product, index) => ({
            key: product.id,
            srno: index + 1,
            name: product.name,
            image: product.image || '',
            description: product.description,
            price: `$ ${product.price}`,
        }));
    }, [memoizedProductList]);

    const isLoading = useMemo(() => loading.productList, [loading.productList]);
    const hasError = useMemo(() => error.productList, [error.productList]);

    if (isLoading) return <div className="text-center p-8">Loading products...</div>;
    if (hasError) return <div className="text-red-500 p-8">Error: {hasError}</div>;

    return (
        <>
            <ToastContainer />
            <div className="bg-white p-4 mb-2 rounded-lg dark:border-gray-700 mt-14">
                <h3 className="text-left text-[1.125rem] font-semibold">
                    Product
                </h3>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    <div className="flex justify-end mb-3 p-2">
                        <Link
                            to="/Add-product"
                            className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
                        >
                            Add Product
                        </Link>
                    </div>
                    <Table cols={columns} data={tableData} />
                </div>
            </div>
        </>
    );
}

export default React.memo(Product);