import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { Keyring } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios from 'axios'
import { entropyToMnemonic } from 'bip39'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'
import { useCallback } from 'react'

import { ORION_AUTH_URL } from '@/config/env'
import { SentryLogger } from '@/utils/logs'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

// todo extract these 3 Fn to `packages/atlas/src/utils/user.ts` after #4168 is merged
export async function scryptHash(
  data: string,
  salt: Buffer | string,
  options: ScryptOpts = { N: 32768, r: 8, p: 1, dkLen: 32 }
): Promise<Buffer> {
  return new Promise((resolve) => {
    resolve(Buffer.from(scrypt(Buffer.from(data), salt, options)))
  })
}

function aes256CbcDecrypt(encryptedData: string, key: Buffer, iv: Buffer): string {
  const keyWA = enc.Hex.parse(key.toString('hex'))
  const ivWA = enc.Hex.parse(iv.toString('hex'))
  const decrypted = AES.decrypt(lib.CipherParams.create({ ciphertext: enc.Hex.parse(encryptedData) }), keyWA, {
    iv: ivWA,
    mode: mode.CBC,
  })
  return decrypted.toString(enc.Hex)
}

const getArtifacts = async (id: string) => {
  try {
    const res = await axios.get<{ cipherIv: string; encryptedSeed: string }>(`${ORION_AUTH_URL}/artifacts?id=${id}`)

    return res.data
  } catch (error) {
    SentryLogger.error('Error when fetching artifacts', 'useLogIn', error)
  }
}

export enum LogInErrors {
  ArtifactsNotFound = 'ArtifactsNotFound',
  LoginError = 'LoginError',
}

type LogInHandler = {
  data: {
    accountId: string
  } | null
  error?: LogInErrors
}

export const useLogIn = () => {
  return useCallback(async (email: string, password: string): Promise<LogInHandler> => {
    await cryptoWaitReady()
    const time = Date.now() - 1000
    const id = (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
    const data = await getArtifacts(id)
    if (!data) {
      return {
        data: null,
        error: LogInErrors.ArtifactsNotFound,
      }
    }

    const { cipherIv, encryptedSeed } = data
    const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(cipherIv, 'hex'))
    const decryptedSeed = aes256CbcDecrypt(encryptedSeed, cipherKey, Buffer.from(cipherIv, 'hex'))
    const keypair = keyring.addFromMnemonic(
      entropyToMnemonic(Buffer.from(decryptedSeed.slice(2, decryptedSeed.length), 'hex'))
    )
    const payload = {
      joystreamAccountId: keypair.address,
      gatewayName: 'Gleev',
      timestamp: time,
      action: 'login',
    }
    const signatureOverPayload = u8aToHex(keypair.sign(JSON.stringify(payload)))
    try {
      const response = await axios.post<{ accountId: string }>(
        `${ORION_AUTH_URL}/login`,
        {
          signature: signatureOverPayload,
          payload,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        data: response.data,
      }
    } catch (error) {
      SentryLogger.error('Error when posting login action', 'useLogIn', error)
      return {
        data: null,
        error: LogInErrors.LoginError,
      }
    }
  }, [])
}
