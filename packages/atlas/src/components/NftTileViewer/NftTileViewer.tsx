import React from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useAsset } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  const { nftStatus, nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video?.thumbnailPhoto)
  const creatorAvatar = useAsset(nft?.video?.channel.avatarPhoto)
  const { canPutOnSale, canMakeBid, canCancelSale, canBuyNow } = useNftState(nft)
  const [openModal, closeModal] = useConfirmationModal()
  const { cancelNftSale } = useNftTransactions(nft?.video.id)

  const handleRemoveFromSale = () => {
    openModal({
      title: 'Remove from sale',
      description: 'Do you really want to remove your item from sale? You can put it on sale anytime.',
      primaryButton: {
        variant: 'destructive',
        text: 'Remove',
        onClick: () => {
          cancelNftSale(false)
          closeModal()
        },
      },
      secondaryButton: {
        variant: 'secondary',
        text: 'Cancel',
        onClick: () => closeModal(),
      },
    })
  }

  const { getCurrentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const msTimestamp = useMsTimestamp()

  const getNftProps = (): NftTileProps => {
    const nftCommonProps = {
      ...nftStatus,
      loading: loading || !nftId,
      thumbnail: {
        videoHref: absoluteRoutes.viewer.video(nft?.video.id),
        thumbnailUrl: thumbnail.url,
        loading: thumbnail.isLoadingAsset,
        thumbnailAlt: `${nft?.video?.title} video thumbnail`,
      },
      owner: nft?.ownerMember?.id
        ? {
            name: nft?.ownerMember?.handle,
            assetUrl:
              nft?.ownerMember?.metadata.avatar?.__typename === 'AvatarUri'
                ? nft.ownerMember?.metadata.avatar.avatarUri
                : '',
            loading,
            onClick: () => navigate(absoluteRoutes.viewer.member(nft?.ownerMember?.handle)),
          }
        : undefined,
      creator: {
        name: nft?.video.channel.title,
        loading: creatorAvatar.isLoadingAsset || loading,
        assetUrl: creatorAvatar.url,
        onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
      },
    } as NftTileProps
    switch (nft?.transactionalStatus.__typename) {
      case 'TransactionalStatusIdle':
      case 'TransactionalStatusInitiatedOfferToMember':
      case 'TransactionalStatusBuyNow':
        return {
          ...nftCommonProps,
        }
      case 'TransactionalStatusAuction': {
        const auctionPlannedEndBlock = nftStatus.status === 'auction' && nftStatus?.auctionPlannedEndBlock
        const isEnded = auctionPlannedEndBlock && getCurrentBlock() >= auctionPlannedEndBlock
        const plannedEndMsTimestamp =
          !isEnded && !!auctionPlannedEndBlock && convertBlockToMsTimestamp(auctionPlannedEndBlock)

        return {
          ...nftCommonProps,
          status: isEnded ? 'idle' : 'auction',
          buyNowPrice: isEnded ? undefined : Number(nft.transactionalStatus.auction?.buyNowPrice),
          startingPrice: Number(nft.transactionalStatus.auction?.startingPrice),
          topBid: Number(nft.transactionalStatus.auction?.lastBid?.amount),
          timeLeftMs: plannedEndMsTimestamp ? plannedEndMsTimestamp - msTimestamp : undefined,
        }
      }
      default:
        return {
          ...nftCommonProps,
        }
    }
  }
  return (
    <NftTile
      {...getNftProps()}
      fullWidth
      canPutOnSale={canPutOnSale}
      canBuyNow={canBuyNow}
      canCancelSale={canCancelSale}
      canMakeBid={canMakeBid}
      handleRemoveFromSale={handleRemoveFromSale}
    />
  )
}
