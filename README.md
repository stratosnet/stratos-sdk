# Stratos JavaScript SDK

## Technology Stack

TypeScript, axios, jest, webpack5, @cosmjs/crypto, bip39, crypto

## Prerequisites

### Packages to be installed on a global level

1. Install [Node.js](https://nodejs.org/en/download/) (version >= v12.18.1 );
2. Install **yarn** package management tool globally;

```bash
$ npm install -g yarn
```

### Project dependencies installation

In the project directory, execute the following command:

```bash
$ yarn install
```

## Getting Started

### Add Stratos SDK to your project

You can either install the Stratos SDK from npmjs by running using `yarn` or `npm`:

for `npm`

```bash

$ npm i @stratos-network/stratos-sdk.js

```

for `yarn`

```bash

$ yarn add  @stratos-network/stratos-sdk.js

```

or, alternatively, (and to be able to use the latest and most updated version of SDK) you could simple add it directly to your dependencies file (your `package.json`):

```json
{
  "name": "your-dapp-project",
  "version": "1.0.0",
  "description": "The mega dapp which uses the Stratos Network SDK",
  "dependencies": {
    "@stratos-network/stratos-sdk.js": "https://github.com/stratosnet/stratos-sdk.git#develop"
  }
}
```

also, if you prefer using `git+ssh` instead of `https` path, you could add it this way:

```json
{
  "name": "your-dapp-project",
  "version": "1.0.0",
  "description": "The mega dapp which uses the Stratos Network SDK",
  "dependencies": {
    "@stratos-network/stratos-sdk.js": "git+ssh://git@github.com:stratosnet/stratos-sdk.git#develop"
  }
}
```

### Example of using the SDK in your project

First, you need to import the SDK to your TS file and initialize it with the connection parameters and other options, so, you are basically, defining which endpoint of the Stratos Network (which environment) the SDK will be connecting to, when making network requests.

This is usually done at a very beginning of your application load. For example in a Root app store, or something like this. Somewhere, what is loaded at a very beginning.

```ts
// AppStore.ts

import * as stratosSdk from '@stratos-network/stratos-sdk.js';
import { Sdk } from '@stratos-network/stratos-sdk.js';

const networkInfo = {
    key: 'mainnet',
    name: 'Mainnet',
    stratosFaucetDenom: 'stos',
    restUrl: 'https://rest.thestratos.org',
    rpcUrl: 'https://rpc.thestratos.org',
    chainId: 'stratos-1',
    explorerUrl: 'https://explorer.thestratos.org/stratos',
  },

Sdk.default.init(networkInfo);
```

After that, you can import a Network API module and perform a network call. Here is an example how to use a Network API. For example here is how to update the ChainId after the SDK is initialized (yes, like other parameter, it could be changed, as it is just a config value)

```ts
// yourComponent.ts
import { networkService, Sdk } from '@stratos-network/stratos-sdk.js';

const main = async () => {
  let resolvedChainID;

  try {
    resolvedChainID = await networkService.getChainId();
  } catch (error) {
    console.log('🚀 ~ resolvedChainID error', error);
    // networkInfo here is from the previous example
    resolvedChainID = networkInfo.chainId;
  }

  Sdk.default.environment.chainId = resolvedChainID;
};

main();
```

To be able to sign a transaction, or to send it, you need to initialize the cosmjs client in the sdk. Typically, after you log in to the application, and verification has been passed, then it is a good time to configure the cosmjs. Here is how that could be done.

```ts
// yourLoginComponent.ts
import { networkService, Sdk } from '@stratos-network/stratos-sdk.js';
import * as stratosSdk from '@stratos-network/stratos-sdk.js';

const main = async () => {
  // mnemonic of the user that is logging in, PLEASE DO NOT COPY OR USE IT
  // and God forbids, do not hardcode it
  const testMnemonic =
    'speed script velvet draft assault observe invest bracket sick item car switch fruit very rigid only about matrix gorilla local uphold kid morning face';

  // your login logic to check and verify the password or pin or whatever

  const password = 'given_verified_password';
  const hdPathIndex = 0;

  const phrase = stratosSdk.hdVault.mnemonic.convertStringToArray(testMnemonic);
  const masterKeySeedInfo = await stratosSdk.hdVault.keyManager.createMasterKeySeed(
    phrase,
    password,
    hdPathIndex,
  );

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  // in case there was another user , with a different mnemonic or hdPathIndex,
  // it is better to reset cosmjs
  stratosSdk.cosmosService.resetCosmos();

  // and now we initialize the cosmjs
  await stratosSdk.cosmosService.getCosmos(serialized, password);
};

main();
```

One more example demonstrates how to delegate some STOS to a given validator. It also contains an example how you can create (restore) a wallet from a given mnemonic and hdPathIndex, which is in some way similar to the cosmjs initialization process.

```ts
// youDelegateComponent.ts
import * as stratosSdk, { transactions } from '@stratos-network/stratos-sdk.js';

const mainDelegate = async (
  hdPathIndex: number,
  givenMnemonic: string,
  validatorAddressToDelegate: string[],
  amount: number[],
) => {
  // It is just an example. Do not assume you have exactly 2 addresses or amounts given
  const validatorAddressOne = validatorAddressToDelegate[0];
  const validatorAddressTwo = validatorAddressToDelegate[1];

  const phrase = stratosSdk.hdVault.mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeed = await stratosSdk.hdVault.keyManager.createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await stratosSdk.hdVault.wallet.deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    // or throw an error
    return;
  }

  // This is just an example, and you don't need to restore the entire keyPairZero from
  // the mnemonic, and you could simply pass in the delegatorAddress from the outside of
  // the function
  const delegatorAddress = keyPairZero.address;

  const sendTxMessages = await transactions.getDelegateTx(delegatorAddress, [
    { amount: amount[0], validatorAddressOne },
    { amount: amount[1], validatorAddressTwo },
  ]);

  const signedTx = await transactions.sign(delegatorAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
    } catch (error) {
      const err: Error = error as Error;
    }
  }
};

const main = async () => {
  // validatorAddresses and amounts are arrays of data and testMnemonic is given
  const delegateResult = await mainDelegate(0, testMnemonic, validatorAddresses, amounts);
};

main();
```

You can find a lot more examples in the `src/run.ts` file. More about it in the next section, where you can learn how to develop in the SDK and how to run its code directly, without importing it in your application.

## Development

### Start the development environment

NOTE: Before using the development sandbox (details are below), you need to copy the `env.sandbox` file into the `.env` file and update `ZERO_MNEMONIC` with a mnemonic phrase that you would like to use.

For the purpose of developing new features, testing the changes, as well as the TS compilation, project has a **sandbox** file, which you can modify and save, and after that the source code would be re-compiled and executed.

To do so, first, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn start

```

Then, modify `src/run.ts` file, and save it, so the code would be re-compiled, executed and re-rendered in the output.

### Documentation

SDK comes with two directories containing Documentation. Those are `docs` and `docs-html`. You can always generate the latest docs by running either `yarn doc` (which would create docs in `md` format), or `yarn doc-html` (which would create html pages with the documentation).

### Testing

For the sake of consistency, all the tests should be created with `.spec.ts` extension, at the same level, where the tested file is located.

For example, for `src/utils.ts` the test file should be named as `src/utils.spec.ts`.

To run the tests, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn test

```

### Code quality

With the idea of following good practices and standards, code should be **linted** and cleaned-up before being commited. The project is configured to use **eslint** and **prettier** for this purpose.

To run the linting, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn lint

```

### Typing with \*.d.ts

The project is configured in such as way, so there is no need to manually create types. After running **build** command, all the types are generated automatiacally, based on _.ts_ files annotations.

## Build

Execute the following commands in the project directory to build resources for execution in the production environment.

```bash

$ yarn build

```

> Compiled bundles as well as the exported types, would be located in **"root directory/dist"**
