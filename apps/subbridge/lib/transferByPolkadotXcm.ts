import {AssetId} from '@/config/asset'
import {ChainId, CHAINS} from '@/config/chain'
import type {ApiPromise} from '@polkadot/api'
import type {SubmittableExtrinsic} from '@polkadot/api/types'
import type {ISubmittableResult} from '@polkadot/types/types'
import {u8aToHex} from '@polkadot/util'
import {decodeAddress} from '@polkadot/util-crypto'

export const transferByPolkadotXcm = ({
  polkadotApi,
  assetId,
  amount,
  fromChainId,
  toChainId,
  destinationAccount,
}: {
  polkadotApi: ApiPromise
  assetId: AssetId
  fromChainId: ChainId
  toChainId: ChainId
  amount: string
  destinationAccount: string
}): SubmittableExtrinsic<'promise', ISubmittableResult> => {
  const toChain = CHAINS[toChainId]
  let Concrete
  if (fromChainId === 'crab' && assetId === 'crab') {
    Concrete = {parents: 0, interior: {X1: {PalletInstance: 5}}}
  } else if (fromChainId === 'shiden') {
    if (assetId === 'pha') {
      Concrete = {parents: 1, interior: {X1: {Parachain: 2004}}}
    } else if (assetId === 'sdn') {
      Concrete = {parents: 0, interior: 'Here'}
    }
  }

  return polkadotApi.tx.polkadotXcm.reserveTransferAssets(
    {V1: {parents: 1, interior: {X1: {Parachain: toChain.paraId}}}},
    {
      V1: {
        parents: 0,
        interior: {
          X1: {
            AccountId32: {
              network: 'Any',
              id: u8aToHex(decodeAddress(destinationAccount)),
            },
          },
        },
      },
    },
    {V1: [{id: {Concrete}, fun: {Fungible: amount}}]},
    0
  )
}
