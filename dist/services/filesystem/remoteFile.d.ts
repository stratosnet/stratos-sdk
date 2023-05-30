import { wallet } from '../../hdVault';
export declare const downloadFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, filehashA: string, filesizeA: number) => Promise<void>;
export declare const updloadFile: (keypair: wallet.KeyPairInfo, fileReadPath: string) => Promise<void>;
