import * as keyUtils from './keyUtils';

export interface MasterKeyInfo {
  readonly encryptedMasterKeySeed: string;
  readonly masterKeySeedAddress: string;
}

export class KeyManager {
  protected encryptedMasterKeySeed: string;
  protected masterKeySeedAddress: string;

  public constructor(mnemonicArray: string[], password: string) {
    const derivedMasterKeySeed = keyUtils.generateMasterKeySeed(mnemonicArray);
    this.encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);
    this.masterKeySeedAddress = keyUtils.getMasterKeySeedAddress(
      keyUtils.getMasterKeySeedPublicKey(derivedMasterKeySeed),
    );
  }

  public get keyInfo(): MasterKeyInfo {
    return { encryptedMasterKeySeed: '', masterKeySeedAddress: '' };
  }

  public unlock(password: string): boolean {
    return true;
  }
}
