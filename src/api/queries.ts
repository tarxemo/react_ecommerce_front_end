import { gql } from '@apollo/client';

// User Queries
export const GET_ALL_USERS = gql`
  query MyQuery {
    CustomUsers {
      id
      username
      email
      userType
      phoneNumber
      address
      profilePicture
      dateOfBirth
      isVerified
      createdAt
      updatedAt
    }
  }
`;
// api/queries.ts
export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    getUserProfile(username: $username) {
      id
      username
      firstName
      lastName
      profilePicture
      dateJoined
      userType
      rating
      totalProducts
      products {
        id
        name
        description
        price
        image
        rating
        category {
          id
          name
        }
        createdAt
      }
    }
  }
`;
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      address
      dateOfBirth
      profilePicture
      userType
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      username
      email
      userType
      phoneNumber
      address
      profilePicture
      dateOfBirth
      isVerified
      createdAt
      updatedAt
    }
  }
`;

// Category Queries
export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      id
      name
      description
      parentCategory {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($id: ID!) {
    category(id: $id) {
      id
      name
      description
      parentCategory {
        id
        name
      }
    }
  }
`;

// Product Queries
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      name
      description
      price
      category {
        id
        name
      }
      seller {
        id
        username
        profilePicture
      }
      stockQuantity
      isAvailable
      image
      sku
      brand
      rating
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stockQuantity
      isAvailable
      image
      sku
      brand
      rating
      wishlistCount
      orderCount
      category {
        id
        name
        description
      }
      seller {
        id
        username
        email
        phoneNumber
        address
      }
      variations {
        id
        variationType
        variationValue
        priceModifier
        stockQuantity
      }
      reviews {
        id
        user {
          id
          username
        }
        rating
        comment
        createdAt
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category {
        id
        name
      }
      seller {
        id
        username
      }
      stockQuantity
      isAvailable
      image
      sku
      brand
      rating
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!) {
    productsByCategory(categoryId: $categoryId) {
      id
      name
      description
      price
      category {
        id
        name
      }
      seller {
        id
        username
        profilePicture
      }
      stockQuantity
      isAvailable
      image
      sku
      brand
      rating
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_BY_SELLER = gql`
  query GetProductsBySeller($sellerId: ID!) {
    productsBySeller(sellerId: $sellerId) {
      id
      name
      description
      price
      category {
        id
        name
      }
      seller {
        id
        username
        profilePicture
      }
      stockQuantity
      isAvailable
      image
      sku
      brand
      rating
      createdAt
      updatedAt
    }
  }
`;

// Product Variation Queries
export const GET_ALL_PRODUCT_VARIATIONS = gql`
  query GetAllProductVariations {
    productVariations {
      id
      product {
        id
        name
      }
      variationType
      variationValue
      priceModifier
      stockQuantity
    }
  }
`;

export const GET_PRODUCT_VARIATION_BY_ID = gql`
  query GetProductVariationById($id: ID!) {
    productVariation(id: $id) {
      id
      product {
        id
        name
      }
      variationType
      variationValue
      priceModifier
      stockQuantity
    }
  }
`;

export const GET_VARIATIONS_BY_PRODUCT = gql`
  query GetVariationsByProduct($productId: ID!) {
    variationsByProduct(productId: $productId) {
      id
      product {
        id
        name
      }
      variationType
      variationValue
      priceModifier
      stockQuantity
    }
  }
`;

// Cart Queries
export const GET_ALL_CARTS = gql`
  query GetAllCarts {
    carts {
      id
      user {
        id
        username
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_CART_BY_ID = gql`
  query GetCartById($id: ID!) {
    cart(id: $id) {
      id
      user {
        id
        username
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_CARTS_BY_USER = gql`
  query cartsByCustomuser {
    cartsByCustomuser {
      id
      user {
        id
        username
      }
      name
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Cart Item Queries
export const GET_ALL_CART_ITEMS = gql`
  query GetAllCartItems {
    cartItems {
      id
      cart {
        id
      }
      product {
        id
        name
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

export const GET_CART_ITEM_BY_ID = gql`
  query GetCartItemById($id: ID!) {
    cartItem(id: $id) {
      id
      cart {
        id
      }
      product {
        id
        name
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

export const GET_CART_ITEMS_BY_CART = gql`
  query GetCartItemsByCart($cartId: ID!) {
    cartItemsByCart(cartId: $cartId) {
      id
      cart {
        id
      }
      product {
        id
        name
        image
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

// Order Queries
export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders {
      id
      user {
        id
        username
      }
      totalAmount
      status
      createdAt
      updatedAt
      shippingAddress
      paymentMethod
      transactionId
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      user {
        id
        username
      }
      totalAmount
      status
      createdAt
      updatedAt
      shippingAddress
      paymentMethod
      transactionId
    }
  }
`;

export const GET_ORDERS_BY_USER = gql`
  query GetOrdersByUser {
    ordersByUser {
      id
      user {
        id
        username
      }
      totalAmount
      status
      createdAt
      updatedAt
      shippingAddress
      paymentMethod
      transactionId
    }
  }
`;

// Order Item Queries
export const GET_ALL_ORDER_ITEMS = gql`
  query GetAllOrderItems {
    orderItems {
      id
      order {
        id
      }
      product {
        id
        name
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

export const GET_ORDER_ITEM_BY_ID = gql`
  query GetOrderItemById($id: ID!) {
    orderItem(id: $id) {
      id
      order {
        id
      }
      product {
        id
        name
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

export const GET_ORDER_ITEMS_BY_ORDER = gql`
  query GetOrderItemsByOrder($orderId: ID!) {
    orderItemsByOrder(orderId: $orderId) {
      id
      order {
        id
      }
      product {
        id
        name
        image
      }
      variation {
        id
        variationType
        variationValue
      }
      quantity
      price
    }
  }
`;

// Payment Queries
export const GET_ALL_PAYMENTS = gql`
  query GetAllPayments {
    payments {
      id
      order {
        id
      }
      amount
      paymentMethod
      transactionId
      paymentStatus
      createdAt
    }
  }
`;

export const GET_PAYMENT_BY_ID = gql`
  query GetPaymentById($id: ID!) {
    payment(id: $id) {
      id
      order {
        id
      }
      amount
      paymentMethod
      transactionId
      paymentStatus
      createdAt
    }
  }
`;

export const GET_PAYMENTS_BY_ORDER = gql`
  query GetPaymentsByOrder($orderId: ID!) {
    paymentsByOrder(orderId: $orderId) {
      id
      order {
        id
      }
      amount
      paymentMethod
      transactionId
      paymentStatus
      createdAt
    }
  }
`;

// Review Queries
export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    reviews {
      id
      product {
        id
        name
      }
      user {
        id
        username
      }
      rating
      comment
      createdAt
    }
  }
`;

export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($id: ID!) {
    review(id: $id) {
      id
      product {
        id
        name
      }
      user {
        id
        username
      }
      rating
      comment
      createdAt
    }
  }
`;

export const GET_REVIEWS_BY_PRODUCT = gql`
  query GetReviewsByProduct($productId: ID!) {
    reviewsByProduct(productId: $productId) {
      id
      product {
        id
        name
      }
      user {
        id
        username
      }
      rating
      comment
      createdAt
    }
  }
`;

export const GET_REVIEWS_BY_USER = gql`
  query GetReviewsByUser($userId: ID!) {
    reviewsByUser(userId: $userId) {
      id
      product {
        id
        name
      }
      user {
        id
        username
      }
      rating
      comment
      createdAt
    }
  }
`;

// Wishlist Queries
export const GET_ALL_WISHLISTS = gql`
  query GetAllWishlists {
    wishlists {
      id
      user {
        id
        username
      }
      product {
        id
        name
      }
      addedAt
    }
  }
`;

export const GET_WISHLIST_BY_ID = gql`
  query GetWishlistById($id: ID!) {
    wishlist(id: $id) {
      id
      user {
        id
        username
      }
      product {
        id
        name
      }
      addedAt
    }
  }
`;

export const GET_WISHLISTS_BY_USER = gql`
  query GetWishlistsByUser{
    wishlistsByUser{
      id
      user {
        id
        username
      }
      product {
        id
        name
        image
        price
      }
      addedAt
    }
  }
`;

// Coupon Queries
export const GET_ALL_COUPONS = gql`
  query GetAllCoupons {
    coupons {
      id
      code
      discountType
      discountValue
      validFrom
      validTo
      maxUsage
      usedCount
      isActive
    }
  }
`;

export const GET_COUPON_BY_ID = gql`
  query GetCouponById($id: ID!) {
    coupon(id: $id) {
      id
      code
      discountType
      discountValue
      validFrom
      validTo
      maxUsage
      usedCount
      isActive
    }
  }
`;

export const GET_COUPONS_BY_CODE = gql`
  query GetCouponsByCode($code: String!) {
    couponsByCode(code: $code) {
      id
      code
      discountType
      discountValue
      validFrom
      validTo
      maxUsage
      usedCount
      isActive
    }
  }
`;

// Notification Queries
export const GET_ALL_NOTIFICATIONS = gql`
  query GetAllNotifications {
    notifications {
      id
      user {
        id
        username
      }
      message
      isRead
      createdAt
    }
  }
`;

export const GET_NOTIFICATION_BY_ID = gql`
  query GetNotificationById($id: ID!) {
    notification(id: $id) {
      id
      user {
        id
        username
      }
      message
      isRead
      createdAt
    }
  }
`;

export const GET_NOTIFICATIONS_BY_USER = gql`
  query GetNotificationsByUser($userId: ID!) {
    notificationsByUser(userId: $userId) {
      id
      user {
        id
        username
      }
      message
      isRead
      createdAt
    }
  }
`;

// Shipping Address Queries
export const GET_ALL_SHIPPING_ADDRESSES = gql`
  query GetAllShippingAddresses {
    shippingAddresses {
      id
      user {
        id
        username
      }
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      isDefault
    }
  }
`;

export const GET_SHIPPING_ADDRESS_BY_ID = gql`
  query GetShippingAddressById($id: ID!) {
    shippingAddress(id: $id) {
      id
      user {
        id
        username
      }
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      isDefault
    }
  }
`;

export const GET_SHIPPING_ADDRESSES_BY_USER = gql`
  query GetShippingAddressesByUser($userId: ID!) {
    shippingAddressesByUser(userId: $userId) {
      id
      user {
        id
        username
      }
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      isDefault
    }
  }
`;

// Return Queries
export const GET_ALL_RETURNS = gql`
  query GetAllReturns {
    returns {
      id
      order {
        id
      }
      reason
      status
      createdAt
    }
  }
`;

export const GET_RETURN_BY_ID = gql`
  query GetReturnById($id: ID!) {
    returnRequest(id: $id) {
      id
      order {
        id
      }
      reason
      status
      createdAt
    }
  }
`;

export const GET_RETURNS_BY_ORDER = gql`
  query GetReturnsByOrder($orderId: ID!) {
    returnsByOrder(orderId: $orderId) {
      id
      order {
        id
      }
      reason
      status
      createdAt
    }
  }
`;