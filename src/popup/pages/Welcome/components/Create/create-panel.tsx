/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames'
import React, { useState } from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Button } from '../../../../components/button/index'
import { Header, Password, ConfirmPassword, WalletName } from './components/index'
import styles from './create-panel.module.css'
import './create-panel.css'
import { useCreateWallet } from '../../../../../queries/use-create-account'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const CreateContainer: React.FC<{
  header: React.ReactNode
  password: React.ReactNode
  confirm: React.ReactNode
  btn: React.ReactNode
  name: React.ReactNode
  nameWallet: string
  passwordWallet: string
  confirmPassword: string
}> = ({ header, password, confirm, btn, name, nameWallet, passwordWallet, confirmPassword }) => {
  const [createWallet, status] = useCreateWallet()
  return (
    <div className={classNames(`flex flex-col w-full justify-between relative ${styles.createContainer}`)}>
      <div className={classNames('flex flex-col')}>
        <div className={classNames('w-full')}>{header}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{name}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{password}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{confirm}</div>
      </div>
      <div
        onClick={() => {
          if (passwordWallet === confirmPassword) {
            createWallet({ name: nameWallet, password: passwordWallet })
          } else {
            alert('You enter wrong confirm password')
          }
        }}
        className={classNames(`w-full flex ${styles.itemBtn}`)}
      >
        {btn}
      </div>
    </div>
  )
}
export const CreatePanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const [nameWallet, setNameWallet] = useState('')
  const [passwordWallet, setPasswordWallet] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 create ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <CreateContainer
              nameWallet={nameWallet}
              passwordWallet={passwordWallet}
              confirmPassword={confirmPassword}
              header={<Header dismissPanel={dismissPanel} />}
              password={<Password setPasswordWallet={setPasswordWallet} />}
              confirm={<ConfirmPassword setConfirmPass={setConfirmPass} />}
              btn={<Button full>Next</Button>}
              name={<WalletName setName={setNameWallet} />}
            >
              <div>Button password coming soon</div>
            </CreateContainer>
          </Panel>
        </Customizer>
        <LayerHost id={layerHostId} className={layerHostClass} />
      </div>
    )
  )
}
const layerHostClass = mergeStyles({
  position: 'relative',
  height: 600,
  width: 360,
  overflow: 'scroll',
})

const focusTrapZoneProps: IFocusTrapZoneProps = {
  isClickableOutsideFocusTrap: true,
  forceFocusInsideTrap: false,
}

function useLayerSettings(trapPanel: boolean, layerHostId: string): { Layer?: ILayerProps } {
  return React.useMemo(() => {
    if (trapPanel) {
      const layerProps: ILayerProps = { hostId: layerHostId }
      return { Layer: layerProps }
    }
    return {}
  }, [trapPanel, layerHostId])
}