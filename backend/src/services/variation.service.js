const variationModel = require('../models/variation.model');

class VariationService {
    static createVariations = async ( product ) => {
        if(product.variations.length === 0) {
            await variationModel.create({
                product: product._id,
                name: product.name,
                price: product.price
            })
        } else {
            let variations = [];
            let variationIdx = 0;
            product.variations[variationIdx].options.forEach((option, optionIdx) => {
                variations.push({
                    product: product._id,
                    name: `${option}`,
                    price: product.price,
                    variation_tier_idx: [optionIdx]
                })
            });
            while(variationIdx < product.variations.length - 1) {
                let newVariations = [];
                variations.forEach(variation => {
                    product.variations[variationIdx + 1].options.forEach((option, optionIdx) => {
                        newVariations.push({
                            product: product._id,
                            name: `${variation.name}, ${option}`,
                            price: product.price,
                            variation_tier_idx: [...variation.variation_tier_idx, optionIdx]
                        })
                    });
                });
                variations = newVariations;
                variationIdx++;
            }
            await variationModel.insertMany(variations);
        }
    }

    static addVariation = async () => {
        
    }

    static deleteVariation = async () => {

    }

    static getVariation = async ({ productId, variation_tier_idx }) => {
        return await variationModel.findOne({
            product: productId,
            variation_tier_idx: {
                $eq: variation_tier_idx
            }
        });
    }
}

module.exports = VariationService;