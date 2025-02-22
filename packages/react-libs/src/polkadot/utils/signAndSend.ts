import type {ApiPromise} from '@polkadot/api'
import type {AddressOrPair, SubmittableExtrinsic} from '@polkadot/api/types'
import type {ExtrinsicStatus} from '@polkadot/types/interfaces'
import type {ISubmittableResult, Signer} from '@polkadot/types/types'

interface SignAndSendProps {
  account: AddressOrPair
  api: ApiPromise
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>
  signer: Signer
  onStatus?: (status: ExtrinsicStatus) => void
  onReady?: () => void
}

interface ExtrinsicResult {
  txHash: `0x${string}`
  method: string
  section: string
}

export const waitSignAndSend = ({
  account,
  api,
  extrinsic,
  onStatus,
  signer,
  onReady,
}: SignAndSendProps) => {
  const extrinsicResultPromise = new Promise<ExtrinsicResult>(
    (resolve, reject) => {
      const {section, method} = extrinsic.method.toHuman() as {
        section: string
        method: string
      }
      extrinsic
        .signAndSend(
          account,
          {signer, nonce: -1},
          ({status, isCompleted, txHash, dispatchError}) => {
            if (isCompleted) {
              if (dispatchError) {
                let errorInfo: string
                if (dispatchError.isModule) {
                  const decoded = api.registry.findMetaError(
                    dispatchError.asModule
                  )
                  errorInfo = `${decoded.section}.${
                    decoded.method
                  } ${decoded.docs.join(' ')}`
                } else {
                  errorInfo = dispatchError.toString()
                }
                // TODO: add txHash
                reject(
                  new Error(
                    `${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`
                  )
                )
              } else {
                resolve({txHash: txHash.toHex(), section, method})
              }
            }

            onStatus?.(status)
            if (status.isReady) {
              onReady?.()
            }
          }
        )
        .then((unsubscribe) => {
          extrinsicResultPromise.finally(() => {
            unsubscribe()
          })
        }, reject)
    }
  )

  return extrinsicResultPromise
}
