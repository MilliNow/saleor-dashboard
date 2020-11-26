import Button from "@material-ui/core/Button";
import { useChannelsList } from "@saleor/channels/queries";
import {
  createShippingChannelsFromRate,
  createSortedShippingChannels
} from "@saleor/channels/utils";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { PAGINATE_BY } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { sectionNames } from "@saleor/intl";
import { commonMessages } from "@saleor/intl";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingMethodProductsAddDialog from "@saleor/shipping/components/ShippingMethodProductsAddDialog";
import ShippingZoneRatesPage, {
  FormData
} from "@saleor/shipping/components/ShippingZoneRatesPage";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingPriceRateVariables
} from "@saleor/shipping/handlers";
import {
  useShippingMethodChannelListingUpdate,
  useShippingPriceExcludeProduct,
  useShippingPriceRemoveProductsFromExclude,
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useProductsSearch, useShippingZone } from "@saleor/shipping/queries";
import {
  ShippingMethodDialog,
  ShippingMethodUrlQueryParams,
  shippingPriceRatesEditUrl,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PriceRatesUpdateProps {
  id: string;
  rateId: string;
  params: ShippingMethodUrlQueryParams;
}

export const PriceRatesUpdate: React.FC<PriceRatesUpdateProps> = ({
  id,
  params,
  rateId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const paginate = usePaginator();

  const paginationState = createPaginationState(PAGINATE_BY, params);

  const { data, loading, refetch } = useShippingZone({
    displayLoader: true,
    variables: { id, ...paginationState }
  });
  const {
    loadMore,
    search: productsSearch,
    result: productsSearchOpts
  } = useProductsSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });

  const { channel } = useAppChannel();

  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === rateId
  );

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    []
  );

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    rate?.excludedProducts.pageInfo,
    paginationState,
    params
  );

  const { data: channelsData } = useChannelsList({});

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({});

  const [
    unassignProduct,
    unassignProductOpts
  ] = useShippingPriceRemoveProductsFromExclude({
    onCompleted: data => {
      if (data.shippingPriceRemoveProductFromExclude.errors.length === 0) {
        handleSuccess();
        refetch();
      }
    }
  });

  const [assignProduct, assignProductOpts] = useShippingPriceExcludeProduct({
    onCompleted: data => {
      if (data.shippingPriceExcludeProducts.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    }
  });

  const shippingChannels = createShippingChannelsFromRate(
    rate?.channelListings
  );
  const allChannels = createSortedShippingChannels(channelsData?.channels);

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(shippingChannels);

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingMethodDialog,
    ShippingMethodUrlQueryParams
  >(navigate, params => shippingPriceRatesEditUrl(id, rateId, params), params);

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate(
    {}
  );

  const handleSuccess = () => {
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges)
    });
  };
  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        handleSuccess();
        navigate(shippingZoneUrl(id));
      }
    }
  });

  const handleSubmit = async (formData: FormData) => {
    const response = await updateShippingRate({
      variables: getUpdateShippingPriceRateVariables(formData, id, rateId)
    });
    const errors = response.data.shippingPriceUpdate.errors;
    if (errors.length === 0) {
      handleSuccess();
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          formData.noLimits,
          formData.channelListings,
          shippingChannels
        )
      });
    }
  };

  const handleProductAssign = (ids: string[]) =>
    assignProduct({
      variables: { id: rateId, input: { products: ids } }
    });

  const handleProductUnassign = (ids: string[]) => {
    unassignProduct({
      variables: { id: rateId, products: ids }
    });
    reset();
  };

  const handleBack = () => navigate(shippingZoneUrl(id));

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channel Availability"
          })}
          selected={channelListElements.length}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <DeleteShippingRateDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={() => openModal("remove")}
        handleConfirm={() =>
          deleteShippingRate({
            variables: {
              id: rateId
            }
          })
        }
        open={params.action === "remove"}
        name={rate?.name}
      />
      <ShippingMethodProductsAddDialog
        confirmButtonState={assignProductOpts.status}
        loading={productsSearchOpts.loading}
        open={params.action === "assign-product"}
        hasMore={productsSearchOpts.data?.search.pageInfo.hasNextPage}
        products={productsSearchOpts.data?.search.edges.map(edge => edge.node)}
        selectedChannelId={channel?.id}
        onClose={closeModal}
        onFetch={productsSearch}
        onFetchMore={loadMore}
        onSubmit={handleProductAssign}
      />
      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading" ||
          unassignProductOpts?.status === "loading" ||
          assignProductOpts?.status === "loading"
        }
        hasChannelChanged={shippingChannels?.length !== currentChannels?.length}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={() => openModal("remove")}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        channelErrors={
          updateShippingMethodChannelListingOpts?.data
            ?.shippingMethodChannelListingUpdate?.errors || []
        }
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onProductUnassign={handleProductUnassign}
        onProductAssign={() => openModal("assign-product")}
        variant={ShippingMethodTypeEnum.PRICE}
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        pageInfo={pageInfo}
        toolbar={
          <Button
            color="primary"
            onClick={() => handleProductUnassign(listElements)}
          >
            <FormattedMessage
              defaultMessage="Unassign"
              description="unassign products from shipping method, button"
            />
          </Button>
        }
      />
    </>
  );
};

export default PriceRatesUpdate;
