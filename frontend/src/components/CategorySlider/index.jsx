import React from 'react';
import axios from 'axios';
import CONFIG from '../../configs'

import {
  CategorySlideContainer
} from './style'
import CategoryCard from '../CategoryCard';

export default function CategorySlide() {

  const [categories, setCategories] = React.useState([]);

  const fetchCategories = async () => {
    await axios.get(CONFIG.API + '/shop/get-categories?shopId=all')
    .then(res => {
      setCategories(res.data.metadata);
    })
    .catch(err => {
      console.log(err);
    })
  }

  React.useEffect(() => {
    fetchCategories();
  }, [])

    return (
        <CategorySlideContainer>
            {categories.map((category, index) => <CategoryCard key={index} category={category} />)}
        </CategorySlideContainer>
    );
}
