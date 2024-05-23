const shopModel = require('../models/shop.model');
const groupModel = require('../models/group.model');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const ROLES = require('../constants/ROLES')

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR
} = require('../core/error.response');
class GroupService {
    static create = async ({ shopId, userId, name }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to create group!');
        await groupModel.create({
            shop: shopId,
            addBy: userId,
            name: name
        });
        const groups = await groupModel
            .find({ shop: shopId })
            .populate('addBy', '_id name')
            .lean();
        return groups;
    }

    static delete = async ({ shopId, userId, groupId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to delete group!');
        const group = await groupModel.findById(groupId).lean();
        if (!group) throw new BAD_REQUEST_ERROR('Group not found!');
        await groupModel.findByIdAndDelete(groupId);
        const groups = await groupModel
            .find({ shop: shopId })
            .populate('addBy', '_id name')
            .lean();
        return groups;
    }

    static update = async ({ shopId, userId, groupId, name }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to update group!');
        const group = await groupModel.findById(groupId).lean();
        if (!group) throw new BAD_REQUEST_ERROR('Group not found!');
        await groupModel.findByIdAndUpdate(groupId, { name: name });
        const groups = await groupModel
            .find({ shop: shopId })
            .populate('addBy', '_id name')
            .lean();
        return groups;
    }

    static addProductToGroup = async ({ shopId, userId, groupId, productId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to add product to group!');
        const group = await groupModel.findById(groupId).lean();
        if (!group) throw new BAD_REQUEST_ERROR('Group not found!');
        if (group.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Group not found in this shop!');
        const product = await productModel.findById(productId).lean();
        if (!product) throw new BAD_REQUEST_ERROR('Product not found!');
        if (product.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Product not found in this shop!');
        if (product.groups.some(group => group.group.toString() === groupId)) throw new BAD_REQUEST_ERROR('Product already in this group!');
        product.groups.push({
            group: groupId,
            addBy: userId
        })
        await productModel.findByIdAndUpdate(productId, product);

        const productsInGroup = await productModel
            .find({ 'groups.group': groupId })
            .select('_id name groups')
            .populate('groups.addBy', '_id name email')
            .lean();

        productsInGroup.forEach(product => {
            product.addToGroupBy = product.groups.find(group => group.group.toString() === groupId).addBy.email;
            product.groups = undefined;
        })

        return productsInGroup;
    }

    static removeProductFromGroup = async ({ shopId, userId, groupId, productId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to remove product from group!');
        const group = await groupModel.findById(groupId).lean();
        if (!group) throw new BAD_REQUEST_ERROR('Group not found!');
        if (group.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Group not found in this shop!');
        const product = await productModel.findById(productId).lean();
        if (!product) throw new BAD_REQUEST_ERROR('Product not found!');
        if (product.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Product not found in this shop!');
        if (!product.groups.some(group => group.group.toString() === groupId)) throw new BAD_REQUEST_ERROR('Product not in this group!');
        product.groups = product.groups.filter(group => group.group.toString() !== groupId);
        await productModel.findByIdAndUpdate(productId, product);

        const productsInGroup = await productModel
            .find({ 'groups.group': groupId })
            .select('_id name groups')
            .populate('groups.addBy', '_id name email')
            .lean();

        productsInGroup.forEach(product => {
            product.addToGroupBy = product.groups.find(group => group.group.toString() === groupId).addBy.email;
            product.groups = undefined;
        })

        return productsInGroup;
    }

    static viewGroup = async ({ shopId, userId, groupId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new BAD_REQUEST_ERROR('User not in this shop!');
        const group = await groupModel.findById(groupId).lean();
        if (!group) throw new BAD_REQUEST_ERROR('Group not found!');
        if (group.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Group not found in this shop!');
        const productsInGroup = await productModel
            .find({ 'groups.group': groupId })
            .select('_id name groups')
            .populate('groups.addBy', '_id name email')
            .lean();

        productsInGroup.forEach(product => {
            product.addToGroupBy = product.groups.find(group => group.group.toString() === groupId).addBy.email;
            product.groups = undefined;
        })

        return productsInGroup;
    }
}

module.exports = GroupService