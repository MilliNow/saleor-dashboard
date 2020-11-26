/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodWithExcludedProductsFragment
// ====================================================

export interface ShippingMethodWithExcludedProductsFragment_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodWithExcludedProductsFragment_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodWithExcludedProductsFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingMethodWithExcludedProductsFragment_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodWithExcludedProductsFragment_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodWithExcludedProductsFragment_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodWithExcludedProductsFragment_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingMethodWithExcludedProductsFragment_channelListings_channel;
  price: ShippingMethodWithExcludedProductsFragment_channelListings_price | null;
  minimumOrderPrice: ShippingMethodWithExcludedProductsFragment_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingMethodWithExcludedProductsFragment_channelListings_maximumOrderPrice | null;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_start_net;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_stop_net;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_start | null;
  stop: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange_stop | null;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing_priceRange | null;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_thumbnail | null;
  pricing: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node_pricing | null;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts_edges {
  __typename: "ProductCountableEdge";
  node: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges_node;
}

export interface ShippingMethodWithExcludedProductsFragment_excludedProducts {
  __typename: "ProductCountableConnection";
  pageInfo: ShippingMethodWithExcludedProductsFragment_excludedProducts_pageInfo;
  edges: ShippingMethodWithExcludedProductsFragment_excludedProducts_edges[];
}

export interface ShippingMethodWithExcludedProductsFragment {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderWeight: ShippingMethodWithExcludedProductsFragment_minimumOrderWeight | null;
  maximumOrderWeight: ShippingMethodWithExcludedProductsFragment_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingMethodWithExcludedProductsFragment_channelListings[] | null;
  excludedProducts: ShippingMethodWithExcludedProductsFragment_excludedProducts | null;
}
