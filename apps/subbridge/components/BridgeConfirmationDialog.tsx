import {Asset} from '@/config/asset'
import {Chain} from '@/config/chain'
import {useBridgeFee} from '@/hooks/useBridgeFee'
import {useTransfer} from '@/hooks/useTransfer'
import {
  amountAtom,
  assetAtom,
  destChainTransactionFeeAtom,
  destinationAccountAtom,
  fromAccountAtom,
  fromChainAtom,
  toChainAtom,
} from '@/store/bridge'
import {ArrowDownward} from '@mui/icons-material'
import {LoadingButton} from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogProps,
  DialogTitle,
  Paper,
  PaperProps,
  Skeleton,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {TransitionProps} from '@mui/material/transitions'
import {BoxProps} from '@mui/system'
import {sleep} from '@phala/utils'
import {encodeAddress} from '@polkadot/util-crypto'
import Decimal from 'decimal.js'
import {useAtom, useAtomValue} from 'jotai'
import {RESET} from 'jotai/utils'
import {useSnackbar} from 'notistack'
import {FC, forwardRef, ReactNode, Ref, useMemo, useRef, useState} from 'react'
import ExtraInfo from './BridgeBody/Extra'
import ExplorerLink from './ExplorerLink'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Info: FC<{label: ReactNode; children: ReactNode} & BoxProps> = ({
  label,
  children,
  ...boxProps
}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...boxProps}
    >
      {typeof label === 'string' ? (
        <Typography
          variant="body2"
          component="span"
          sx={{
            flex: 'none',
            mr: 2,
            color: theme.palette.text.secondary,
          }}
        >
          {label}
        </Typography>
      ) : (
        label
      )}

      {children}
    </Box>
  )
}

const Detail: FC<
  PaperProps & {
    kind: 'From' | 'To'
    chain: Chain
    account: string
    asset: Asset
    amount: string | null
  }
> = ({kind, chain, account, asset, amount, ...paperProps}) => {
  const displayAccount = useMemo(() => {
    if (chain.kind === 'polkadot' && account) {
      const {ss58Format} = chain
      return encodeAddress(account, ss58Format)
    }

    return account
  }, [chain, account])

  return (
    <Paper sx={{p: 2, width: 1}} {...paperProps}>
      <Stack spacing={2}>
        <Info label={kind}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img css={{width: 16, height: 16}} src={chain.icon} />
            <Typography variant="body2" component="span" sx={{ml: 1}}>
              {chain.name}
            </Typography>
          </Box>
        </Info>
        <Info label="Account">
          <Typography
            variant="caption"
            sx={{
              maxWidth: 200,
              wordBreak: 'break-all',
              textAlign: 'right',
              lineHeight: 1.2,
            }}
          >
            {displayAccount}
          </Typography>
        </Info>
        <Info label="Amount">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="body2" sx={{fontWeight: 600}}>
              {amount || <Skeleton width={64} />}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', ml: 1}}>
              <img css={{width: 16, height: 16}} src={asset.icon} />
              <Typography variant="body2" sx={{ml: 1}}>
                {asset.symbol}
              </Typography>
            </Box>
          </Box>
        </Info>
      </Stack>
    </Paper>
  )
}

const DialogBody: FC<BoxProps> = (props) => {
  const [fromChain] = useAtom(fromChainAtom)
  const [toChain] = useAtom(toChainAtom)
  const [fromAccount] = useAtom(fromAccountAtom)
  const [amount] = useAtom(amountAtom)
  const [asset] = useAtom(assetAtom)
  const [destinationAccount] = useAtom(destinationAccountAtom)
  const destChainTransactionFee = useAtomValue(destChainTransactionFeeAtom)
  const bridgeFee = useBridgeFee()

  const toAmount = useMemo(() => {
    if (!bridgeFee) {
      return null
    }
    const value = new Decimal(amount)
      .sub(bridgeFee)
      .sub(destChainTransactionFee)

    return value.toString()
  }, [amount, bridgeFee, destChainTransactionFee])

  if (!fromAccount) return null

  return (
    <Box {...props}>
      <Stack spacing={2} sx={{alignItems: 'center'}}>
        <Detail
          kind="From"
          chain={fromChain}
          account={fromAccount}
          amount={amount}
          asset={asset}
        />
        <ArrowDownward color="action" />
        <Detail
          kind="To"
          chain={toChain}
          account={destinationAccount}
          amount={toAmount}
          asset={asset}
        />
      </Stack>
      <ExtraInfo sx={{width: 1, mt: 3}} />
    </Box>
  )
}

const BridgeConfirmationDialog: FC<DialogProps> = ({onClose, ...props}) => {
  const [, setAmount] = useAtom(amountAtom)
  const [confirming, setConfirming] = useState(false)
  const fromChain = useAtomValue(fromChainAtom)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const transfer = useTransfer()
  const transferredRef = useRef(false)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  const close = () => {
    onClose?.({}, 'backdropClick')
  }

  const onSubmit = async () => {
    let key
    setConfirming(true)
    try {
      const res = await transfer({
        onReady: () => {
          key = enqueueSnackbar(
            <Box display="flex" alignItems="center">
              <CircularProgress size={16} sx={{mr: 1, flex: 'none'}} />
              <span>Waiting for confirmation...</span>
            </Box>,
            {
              variant: 'default',
              persist: true,
            }
          )
          transferredRef.current = true
          setConfirming(false)
          close()
        },
      })

      if ('wait' in res) {
        // Ethers.js transaction
        const {transactionHash} = await res.wait()
        closeSnackbar(key)
        await sleep(1000)
        enqueueSnackbar(
          <>
            Transaction confirmed
            {fromChain.explorerURL && (
              <ExplorerLink
                kind="tx"
                hash={transactionHash}
                url={fromChain.explorerURL}
                sx={{ml: 1}}
              >
                View on explorer
              </ExplorerLink>
            )}
          </>,
          {variant: 'success'}
        )
      } else {
        // Polkadot.js extrinsic
        const {txHash} = res
        closeSnackbar(key)
        await sleep(1000)
        enqueueSnackbar(
          <>
            Extrinsic Success
            {fromChain.explorerURL && (
              <ExplorerLink
                kind="extrinsic"
                hash={txHash}
                url={fromChain.explorerURL}
                sx={{ml: 1}}
              >
                View on explorer
              </ExplorerLink>
            )}
          </>,
          {variant: 'success'}
        )
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setConfirming(false)
      if (key) {
        closeSnackbar(key)
        await sleep(1000)
      }

      if (err.receipt) {
        enqueueSnackbar(
          <>
            {err.reason || 'Transaction failed'}
            {fromChain.explorerURL && (
              <ExplorerLink
                kind="tx"
                hash={err.receipt.transactionHash}
                url={fromChain.explorerURL}
                sx={{ml: 1}}
              >
                View on explorer
              </ExplorerLink>
            )}
          </>,
          {variant: 'error'}
        )
      } else if (err.message) {
        enqueueSnackbar(err.message, {variant: 'error'})
      }
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      TransitionProps={{
        onExited: () => {
          if (transferredRef.current) {
            setAmount(RESET)
            transferredRef.current = false
          }
        },
      }}
      onClose={(...args) => {
        if (confirming) return
        onClose?.(...args)
      }}
      {...props}
    >
      <DialogTitle>Bridge Confirmation</DialogTitle>

      <DialogBody sx={[{px: 2}, !fullScreen && {width: 420}]} />

      <Stack spacing={2} sx={{px: 2, py: 3}}>
        <LoadingButton
          loading={confirming}
          size="large"
          variant="contained"
          fullWidth
          onClick={onSubmit}
        >
          Submit
        </LoadingButton>
        {fullScreen && (
          <Button size="large" fullWidth onClick={close}>
            Cancel
          </Button>
        )}
      </Stack>
    </Dialog>
  )
}

export default BridgeConfirmationDialog
