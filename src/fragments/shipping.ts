import { fragmentMoney } from "@saleor/fragments/products";
import gql from "graphql-tag";

export const shippingZoneFragment = gql`
  fragment ShippingZoneFragment on ShippingZone {
    id
    countries {
      code
      country
    }
    name
  }
`;
export const shippingMethodFragment = gql`
  ${fragmentMoney}
  fragment ShippingMethodFragment on ShippingMethod {
    id
    minimumOrderWeight {
      unit
      value
    }
    maximumOrderWeight {
      unit
      value
    }
    name
    type
    channelListings {
      id
      channel {
        id
        name
        currencyCode
      }
      price {
        ...Money
      }
      minimumOrderPrice {
        ...Money
      }
      maximumOrderPrice {
        ...Money
      }
    }
  }
`;
export const shippingMethodWithExcludedProductsFragment = gql`
  ${fragmentMoney}
  fragment ShippingMethodWithExcludedProductsFragment on ShippingMethod {
    id
    minimumOrderWeight {
      unit
      value
    }
    maximumOrderWeight {
      unit
      value
    }
    name
    type
    channelListings {
      id
      channel {
        id
        name
        currencyCode
      }
      price {
        ...Money
      }
      minimumOrderPrice {
        ...Money
      }
      maximumOrderPrice {
        ...Money
      }
    }
    excludedProducts(
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                net {
                  ...Money
                }
              }
              stop {
                net {
                  ...Money
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const shippingZoneDetailsFragment = gql`
  ${shippingZoneFragment}
  ${shippingMethodFragment}
  fragment ShippingZoneDetailsFragment on ShippingZone {
    ...ShippingZoneFragment
    default
    shippingMethods {
      ...ShippingMethodFragment
    }
    warehouses {
      id
      name
    }
  }
`;
