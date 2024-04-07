import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Error from "../../Error";

export default function Category() {

    const [category, setCategory] = useState(null)
    const params = useParams();

    const getProduct = async ({ categoryId }) => {
        await axios.get(`/api/v1/category?id=${categoryId}`)
            .then(res => {
                if(res.data.success) {
                    setCategory(res.data);
                } else {
                    setCategory(null);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const categoryTemp = {
        categoryId: 1
    }

    useEffect(() => {

        setCategory(categoryTemp)
    }, [])


    return category ? 
    <div>category???</div> : 
    <Error />
}