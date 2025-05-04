import { gql } from "@apollo/client";

// Login Mutation
export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      cart
      wishlist
      user {
        address
        createdAt
        dateOfBirth
        email
        id
        isVerified
        phoneNumber
        profilePicture
        updatedAt
        userType
        username
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $first_name: String
    $last_name: String
    $email: String
    $phone_number: String
    $address: String
    $date_of_birth: String
  ) {
    updateUserProfile(
      firstName: $first_name
      lastName: $last_name
      email: $email
      phoneNumber: $phone_number
      address: $address
      dateOfBirth: $date_of_birth
    ) {
      success
      errors
      user {
        id
        username
        email
        firstName
        lastName
        phoneNumber
        address
        dateOfBirth
        profilePicture
      }
    }
  }
`;

export const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($profile_picture: Upload!) {
    updateProfilePicture(profilePicture: $profile_picture) {
      success
      errors
      user {
        id
        profilePicture
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($old_password: String!, $new_password: String!) {
    updatePassword(oldPassword: $old_password, newPassword: $new_password) {
      success
      errors
    }
  }
`;
// Refresh Token Mutation
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;

// Logout Mutation
export const LOGOUT_USER = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($userData: CustomUserInput!) {
    createUser(userData: $userData) {
      user {
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
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateCustomUser($userData: UserInput!) {
    updateUser(userData: $userData) {
      user {
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
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
    }
  }
`;

// Category Mutations
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($categoryData: CategoryInput!) {
    createCategory(categoryData: $categoryData) {
      category {
        id
        name
        description
        parentCategory {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $categoryData: CategoryInput!) {
    updateCategory(id: $id, categoryData: $categoryData) {
      category {
        id
        name
        description
        parentCategory {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
    }
  }
`;

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($productData: ProductInput!, $image: Upload!) {
    createProduct(productData: $productData, image: $image) {
      product {
        id
        name
        description
        price
        category {
          id
          name
        }
        stockQuantity
        isAvailable
        image
        sku
        brand
        createdAt
        updatedAt
      }
    }
  }
`;


export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $productData: ProductInput!) {
    updateProduct(id: $id, productData: $productData) {
      product {
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
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
    }
  }
`;

// Product Variation Mutations
export const CREATE_PRODUCT_VARIATION = gql`
  mutation CreateProductVariation($variationData: ProductVariationInput!) {
    createProductVariation(variationData: $variationData) {
      variation {
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
  }
`;

export const UPDATE_PRODUCT_VARIATION = gql`
  mutation UpdateProductVariation($id: ID!, $variationData: ProductVariationInput!) {
    updateProductVariation(id: $id, variationData: $variationData) {
      variation {
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
  }
`;

export const DELETE_PRODUCT_VARIATION = gql`
  mutation DeleteProductVariation($id: ID!) {
    deleteProductVariation(id: $id) {
      success
    }
  }
`;

// Cart Mutations
export const CREATE_CART = gql`
  mutation CreateCart($cartData: CartInput!) {
    createCart(cartData: $cartData) {
      cart {
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
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($cartData: CartInput!) {
    updateCart(cartData: $cartData) {
      cart {
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
  }
`;

export const DELETE_CART = gql`
  mutation DeleteCart($id: ID!) {
    deleteCart(id: $id) {
      success
    }
  }
`;

// Cart Item Mutations
export const CREATE_CART_ITEM = gql`
  mutation CreateCartItem($cartItemData: CartItemInput!) {
    createCartItem(cartItemData: $cartItemData) {
      cartItem {
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
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $cartItemData: CartItemInput!) {
    updateCartItem(id: $id, cartItemData: $cartItemData) {
      cartItem {
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
  }
`;

export const DELETE_CART_ITEM = gql`
  mutation DeleteCartItem($id: ID!) {
    deleteCartItem(id: $id) {
      success
    }
  }
`;

// Order Mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($orderData: OrderInput!) {
    createOrder(orderData: $orderData) {
      order {
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
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $orderData: OrderInput!) {
    updateOrder(id: $id, orderData: $orderData) {
      order {
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
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      success
    }
  }
`;

// Order Item Mutations
export const CREATE_ORDER_ITEM = gql`
  mutation CreateOrderItem($orderItemData: OrderItemInput!) {
    createOrderItem(orderItemData: $orderItemData) {
      orderItem {
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
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem($id: ID!, $orderItemData: OrderItemInput!) {
    updateOrderItem(id: $id, orderItemData: $orderItemData) {
      orderItem {
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
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($id: ID!) {
    deleteOrderItem(id: $id) {
      success
    }
  }
`;

// Payment Mutations
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($paymentData: PaymentInput!) {
    createPayment(paymentData: $paymentData) {
      payment {
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
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $paymentData: PaymentInput!) {
    updatePayment(id: $id, paymentData: $paymentData) {
      payment {
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
  }
`;

export const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id) {
      success
    }
  }
`;

// Review Mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview($reviewData: ReviewInput!) {
    createReview(reviewData: $reviewData) {
      review {
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
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $reviewData: ReviewInput!) {
    updateReview(id: $id, reviewData: $reviewData) {
      review {
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
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      success
    }
  }
`;

// Wishlist Mutations
export const CREATE_WISHLIST = gql`
  mutation CreateWishlist($wishlistData: WishlistInput!) {
    createWishlist(wishlistData: $wishlistData) {
      myWishlist
      wishlist {
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
  }
`;

export const UPDATE_WISHLIST = gql`
  mutation UpdateWishlist($id: ID!, $wishlistData: WishlistInput!) {
    updateWishlist(id: $id, wishlistData: $wishlistData) {
      wishlist {
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
  }
`;

export const DELETE_WISHLIST = gql`
  mutation DeleteWishlist($id: ID!) {
    deleteWishlist(id: $id) {
      myWishlist
      success
    }
  }
`;

// Coupon Mutations
export const CREATE_COUPON = gql`
  mutation CreateCoupon($couponData: CouponInput!) {
    createCoupon(couponData: $couponData) {
      coupon {
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
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($id: ID!, $couponData: CouponInput!) {
    updateCoupon(id: $id, couponData: $couponData) {
      coupon {
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
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id) {
      success
    }
  }
`;

// Notification Mutations
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($notificationData: NotificationInput!) {
    createNotification(notificationData: $notificationData) {
      notification {
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
  }
`;

export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id: ID!, $notificationData: NotificationInput!) {
    updateNotification(id: $id, notificationData: $notificationData) {
      notification {
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
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      success
    }
  }
`;

// Shipping Address Mutations
export const CREATE_SHIPPING_ADDRESS = gql`
  mutation CreateShippingAddress($shippingAddressData: ShippingAddressInput!) {
    createShippingAddress(shippingAddressData: $shippingAddressData) {
      shippingAddress {
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
  }
`;

export const UPDATE_SHIPPING_ADDRESS = gql`
  mutation UpdateShippingAddress($id: ID!, $shippingAddressData: ShippingAddressInput!) {
    updateShippingAddress(id: $id, shippingAddressData: $shippingAddressData) {
      shippingAddress {
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
  }
`;

export const DELETE_SHIPPING_ADDRESS = gql`
  mutation DeleteShippingAddress($id: ID!) {
    deleteShippingAddress(id: $id) {
      success
    }
  }
`;

// Return Mutations
export const CREATE_RETURN = gql`
  mutation CreateReturn($returnData: ReturnInput!) {
    createReturn(returnData: $returnData) {
      returnRequest {
        id
        order {
          id
        }
        reason
        status
        createdAt
      }
    }
  }
`;

export const UPDATE_RETURN = gql`
  mutation UpdateReturn($id: ID!, $returnData: ReturnInput!) {
    updateReturn(id: $id, returnData: $returnData) {
      returnRequest {
        id
        order {
          id
        }
        reason
        status
        createdAt
      }
    }
  }
`;

export const DELETE_RETURN = gql`
  mutation DeleteReturn($id: ID!) {
    deleteReturn(id: $id) {
      success
    }
  }
`;