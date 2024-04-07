import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Error from "../Error";
import Layout from "../../components/Layout";

export default function Product() {

    const [product, setProduct] = useState(null)
    const params = useParams();

    const getProduct = async ({ productId }) => {
        await axios.get(`/api/v1/product?id=${productId}`)
            .then(res => {
                if(res.data.success) {
                    setProduct(res.data);
                } else {
                    setProduct(null);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const productTemp = {
        productId: 1
    }

    useEffect(() => {
        // getProduct(params.productId)
        setProduct(productTemp)
    }, [])


    return product ? 
    <Layout>
        <div>AAA</div>
    </Layout> : 
    <Error />
}