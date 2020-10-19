import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'
import { store } from 'popup/stores'
import { settingSlices } from 'popup/stores/features/settings'

import { createWalletWithPassword } from '../services/wallet'
import { GET_WALLET_KEY } from './use-get-wallet'

export const useCreateWallet = () => {
  return useMutation((params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password), {
    onSuccess: async (data, { name }) => {
      console.log('created wallet name: ', name)
      await queryCache.invalidateQueries(GET_WALLET_KEY)
      const firstAccount = data.masterAccount.getAccounts()[0]
      console.log('Set default first account: ', name)
      store.dispatch(settingSlices.actions.setWalletName({ walletName: data.name }))
      store.dispatch(settingSlices.actions.selectAccount({ accountName: firstAccount.name }))
    },
    onError: (err) => {
      console.error(err)
    },
  })
}